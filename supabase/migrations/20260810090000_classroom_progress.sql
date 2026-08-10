-- Lightweight classroom progress storage. Access is restricted to the RPCs below;
-- the anonymous web client cannot read either table directly.
CREATE TABLE IF NOT EXISTS public.learning_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9]{6}$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  teacher_key_hash text NOT NULL CHECK (teacher_key_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.learning_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.learning_classes(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 40),
  recovery_hash text NOT NULL CHECK (recovery_hash ~ '^[0-9a-f]{64}$'),
  progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, recovery_hash)
);

CREATE INDEX IF NOT EXISTS learning_profiles_class_id_idx
  ON public.learning_profiles (class_id, updated_at DESC);

ALTER TABLE public.learning_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.learning_classes FROM anon, authenticated;
REVOKE ALL ON public.learning_profiles FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_learning_class(
  p_name text,
  p_teacher_hash text
)
RETURNS TABLE(class_id uuid, class_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_code text;
  v_name text := trim(p_name);
  v_hash text := lower(trim(p_teacher_hash));
BEGIN
  IF char_length(v_name) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION 'INVALID_CLASS_NAME';
  END IF;
  IF v_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'INVALID_TEACHER_KEY';
  END IF;

  LOOP
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.learning_classes AS lc WHERE lc.code = v_code
    );
  END LOOP;

  INSERT INTO public.learning_classes (code, name, teacher_key_hash)
  VALUES (v_code, v_name, v_hash)
  RETURNING id INTO v_id;

  RETURN QUERY SELECT v_id, v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_learning_class(
  p_class_code text,
  p_display_name text,
  p_recovery_hash text
)
RETURNS TABLE(profile_id uuid, class_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id uuid;
  v_class_name text;
  v_profile_id uuid;
  v_code text := upper(regexp_replace(trim(p_class_code), '[^A-Za-z0-9]', '', 'g'));
  v_name text := trim(p_display_name);
  v_hash text := lower(trim(p_recovery_hash));
BEGIN
  IF char_length(v_name) NOT BETWEEN 1 AND 40 THEN
    RAISE EXCEPTION 'INVALID_DISPLAY_NAME';
  END IF;
  IF v_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'INVALID_RECOVERY_KEY';
  END IF;

  SELECT lc.id, lc.name INTO v_class_id, v_class_name
  FROM public.learning_classes AS lc
  WHERE lc.code = v_code;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'CLASS_NOT_FOUND';
  END IF;

  INSERT INTO public.learning_profiles (class_id, display_name, recovery_hash)
  VALUES (v_class_id, v_name, v_hash)
  RETURNING id INTO v_profile_id;

  RETURN QUERY SELECT v_profile_id, v_class_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_learning_profile(
  p_class_code text,
  p_recovery_hash text
)
RETURNS TABLE(
  profile_id uuid,
  display_name text,
  class_name text,
  progress jsonb,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text := upper(regexp_replace(trim(p_class_code), '[^A-Za-z0-9]', '', 'g'));
  v_hash text := lower(trim(p_recovery_hash));
BEGIN
  IF v_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'INVALID_RECOVERY_KEY';
  END IF;

  RETURN QUERY
  SELECT lp.id, lp.display_name, lc.name, lp.progress, lp.updated_at
  FROM public.learning_profiles AS lp
  JOIN public.learning_classes AS lc ON lc.id = lp.class_id
  WHERE lc.code = v_code AND lp.recovery_hash = v_hash;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'PROFILE_NOT_FOUND';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_learning_progress(
  p_profile_id uuid,
  p_recovery_hash text,
  p_progress jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash text := lower(trim(p_recovery_hash));
BEGIN
  IF v_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN false;
  END IF;
  IF p_progress IS NULL OR jsonb_typeof(p_progress) <> 'object' OR pg_column_size(p_progress) > 262144 THEN
    RAISE EXCEPTION 'INVALID_PROGRESS';
  END IF;

  UPDATE public.learning_profiles AS lp
  SET progress = p_progress, updated_at = now()
  WHERE lp.id = p_profile_id AND lp.recovery_hash = v_hash;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_learning_class_progress(
  p_class_code text,
  p_teacher_hash text
)
RETURNS TABLE(
  profile_id uuid,
  display_name text,
  progress jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id uuid;
  v_code text := upper(regexp_replace(trim(p_class_code), '[^A-Za-z0-9]', '', 'g'));
  v_hash text := lower(trim(p_teacher_hash));
BEGIN
  IF v_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'INVALID_TEACHER_KEY';
  END IF;

  SELECT lc.id INTO v_class_id
  FROM public.learning_classes AS lc
  WHERE lc.code = v_code AND lc.teacher_key_hash = v_hash;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'CLASS_ACCESS_DENIED';
  END IF;

  RETURN QUERY
  SELECT lp.id, lp.display_name, lp.progress, lp.created_at, lp.updated_at
  FROM public.learning_profiles AS lp
  WHERE lp.class_id = v_class_id
  ORDER BY lp.updated_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.create_learning_class(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_learning_class(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.restore_learning_profile(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_learning_progress(uuid, text, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_learning_class_progress(text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_learning_class(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_learning_class(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.restore_learning_profile(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_learning_progress(uuid, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_learning_class_progress(text, text) TO anon, authenticated;
