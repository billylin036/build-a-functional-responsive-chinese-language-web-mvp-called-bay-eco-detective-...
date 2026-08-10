import { createClient } from "@supabase/supabase-js";

const cloudUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const cloudKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

const cloud =
  cloudUrl && cloudKey
    ? createClient(cloudUrl, cloudKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;

export interface CloudProgressRecord {
  profile_id: string;
  display_name: string;
  progress: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface RestoredProfile {
  profileId: string;
  displayName: string;
  className: string;
  progress: Record<string, unknown>;
  updatedAt: string;
}

function requireCloud() {
  if (!cloud) {
    throw new Error("CLOUD_NOT_CONFIGURED");
  }
  return cloud;
}

function normalizeSecret(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function normalizeClassCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function generateRecoveryCode(prefix: "STU" | "TEA") {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const body = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `${prefix}-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8)}`;
}

async function hashSecret(value: string) {
  const encoded = new TextEncoder().encode(normalizeSecret(value));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fail(error: { message?: string } | null) {
  if (!error) return;
  const known = [
    "CLASS_NOT_FOUND",
    "PROFILE_NOT_FOUND",
    "CLASS_ACCESS_DENIED",
    "INVALID_CLASS_NAME",
    "INVALID_DISPLAY_NAME",
  ].find((code) => error.message?.includes(code));
  throw new Error(known ?? "CLOUD_REQUEST_FAILED");
}

export function isCloudConfigured() {
  return Boolean(cloud);
}

export async function createLearningClass(name: string) {
  const teacherCode = generateRecoveryCode("TEA");
  const teacherHash = await hashSecret(teacherCode);
  const { data, error } = await requireCloud().rpc("create_learning_class", {
    p_name: name.trim(),
    p_teacher_hash: teacherHash,
  });
  fail(error);
  const row = (data as { class_id: string; class_code: string }[] | null)?.[0];
  if (!row) throw new Error("CLOUD_REQUEST_FAILED");
  return { classId: row.class_id, classCode: row.class_code, teacherCode };
}

export async function joinLearningClass(classCode: string, displayName: string) {
  const recoveryCode = generateRecoveryCode("STU");
  const recoveryHash = await hashSecret(recoveryCode);
  const { data, error } = await requireCloud().rpc("join_learning_class", {
    p_class_code: normalizeClassCode(classCode),
    p_display_name: displayName.trim(),
    p_recovery_hash: recoveryHash,
  });
  fail(error);
  const row = (data as { profile_id: string; class_name: string }[] | null)?.[0];
  if (!row) throw new Error("CLOUD_REQUEST_FAILED");
  return {
    profileId: row.profile_id,
    classCode: normalizeClassCode(classCode),
    className: row.class_name,
    displayName: displayName.trim(),
    recoveryCode,
  };
}

export async function restoreLearningProfile(
  classCode: string,
  recoveryCode: string,
): Promise<RestoredProfile> {
  const recoveryHash = await hashSecret(recoveryCode);
  const { data, error } = await requireCloud().rpc("restore_learning_profile", {
    p_class_code: normalizeClassCode(classCode),
    p_recovery_hash: recoveryHash,
  });
  fail(error);
  const row = (
    data as
      | {
          profile_id: string;
          display_name: string;
          class_name: string;
          progress: Record<string, unknown>;
          updated_at: string;
        }[]
      | null
  )?.[0];
  if (!row) throw new Error("PROFILE_NOT_FOUND");
  return {
    profileId: row.profile_id,
    displayName: row.display_name,
    className: row.class_name,
    progress: row.progress ?? {},
    updatedAt: row.updated_at,
  };
}

export async function saveLearningProgress(
  profileId: string,
  recoveryCode: string,
  progress: object,
) {
  const recoveryHash = await hashSecret(recoveryCode);
  const { data, error } = await requireCloud().rpc("save_learning_progress", {
    p_profile_id: profileId,
    p_recovery_hash: recoveryHash,
    p_progress: progress,
  });
  fail(error);
  if (data !== true) throw new Error("PROFILE_NOT_FOUND");
}

export async function getLearningClassProgress(classCode: string, teacherCode: string) {
  const teacherHash = await hashSecret(teacherCode);
  const { data, error } = await requireCloud().rpc("get_learning_class_progress", {
    p_class_code: normalizeClassCode(classCode),
    p_teacher_hash: teacherHash,
  });
  fail(error);
  return (data ?? []) as CloudProgressRecord[];
}
