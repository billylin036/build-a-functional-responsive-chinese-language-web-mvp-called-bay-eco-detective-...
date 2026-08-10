REVOKE EXECUTE ON FUNCTION public.create_learning_class(text, text) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.join_learning_class(text, text, text) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.restore_learning_profile(text, text) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.save_learning_progress(uuid, text, jsonb) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_learning_class_progress(text, text) FROM PUBLIC, authenticated;

GRANT EXECUTE ON FUNCTION public.create_learning_class(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.join_learning_class(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.restore_learning_profile(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.save_learning_progress(uuid, text, jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.get_learning_class_progress(text, text) TO anon;

GRANT EXECUTE ON FUNCTION public.create_learning_class(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.join_learning_class(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.restore_learning_profile(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.save_learning_progress(uuid, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_learning_class_progress(text, text) TO service_role;