import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Cloud,
  CloudOff,
  Copy,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createLearningClass,
  getLearningClassProgress,
  isCloudConfigured,
  type CloudProgressRecord,
} from "@/lib/classroom-cloud";
import { useAppState } from "@/lib/app-state";
import { learningChapters } from "@/data/learning";
import { OUTFALL_QUEST_IDS } from "@/data/locations";
import { SAMPLING_QUEST_IDS } from "@/data/exploration";

type Language = "zh" | "en";
type StudentMode = "join" | "restore";

const ERROR_MESSAGES: Record<string, { zh: string; en: string }> = {
  CLOUD_NOT_CONFIGURED: {
    zh: "云端服务尚未连接，请在已发布的网站重试。",
    en: "Cloud saving is not connected. Please retry on the published site.",
  },
  CLASS_NOT_FOUND: { zh: "找不到这个班级码，请向老师核对。", en: "Class code not found." },
  PROFILE_NOT_FOUND: {
    zh: "班级码或恢复码不正确，请检查后重试。",
    en: "The class code or recovery code is incorrect.",
  },
  CLASS_ACCESS_DENIED: {
    zh: "班级码或教师码不正确。",
    en: "The class code or teacher code is incorrect.",
  },
  INVALID_CLASS_NAME: { zh: "请输入班级名称。", en: "Enter a class name." },
  INVALID_DISPLAY_NAME: { zh: "请输入昵称。", en: "Enter a nickname." },
  CLOUD_REQUEST_FAILED: {
    zh: "暂时无法连接云端，请检查网络后重试。",
    en: "Cloud connection failed. Check your network and retry.",
  },
};

function getErrorMessage(error: unknown, language: Language) {
  const code = error instanceof Error ? error.message : "CLOUD_REQUEST_FAILED";
  return (ERROR_MESSAGES[code] ?? ERROR_MESSAGES["CLOUD_REQUEST_FAILED"])![language];
}

function completedIds(row: CloudProgressRecord, key: string) {
  const value = row.progress[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function chapterQuestionSummary(
  row: CloudProgressRecord,
  chapterId: string,
  fallbackTotal: number,
) {
  const chapterCompleted = completedIds(row, "completedChapters").includes(chapterId);
  const progress = row.progress["chapterQuestionProgress"];
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    return { completed: chapterCompleted ? fallbackTotal : 0, total: fallbackTotal };
  }
  const entry = (progress as Record<string, unknown>)[chapterId];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return { completed: chapterCompleted ? fallbackTotal : 0, total: fallbackTotal };
  }
  const data = entry as Record<string, unknown>;
  const ids = Array.isArray(data["completedQuestionIds"])
    ? data["completedQuestionIds"].filter((item): item is string => typeof item === "string")
    : [];
  const total = typeof data["total"] === "number" ? data["total"] : fallbackTotal;
  return { completed: chapterCompleted ? total : Math.min(ids.length, total), total };
}

function observationRecords(row: CloudProgressRecord) {
  const value = row.progress["activityRecords"];
  return Array.isArray(value)
    ? value.filter(
        (
          item,
        ): item is {
          id: string;
          locationName: string;
          activityTitle: string;
          responses: Record<string, string>;
          completedAt: string;
        } => Boolean(item && typeof item === "object" && "id" in item),
      )
    : [];
}

export function ClassroomSyncPanel({ language }: { language: Language }) {
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const {
    classroomLink,
    cloudSyncStatus,
    cloudSyncError,
    cloudLastSyncedAt,
    joinClassroom,
    restoreClassroom,
    disconnectClassroom,
    retryCloudSync,
  } = useAppState();
  const [mode, setMode] = useState<StudentMode>("join");
  const [classCode, setClassCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [studentBusy, setStudentBusy] = useState(false);
  const [revealRecovery, setRevealRecovery] = useState(false);
  const [className, setClassName] = useState("");
  const [teacherClassCode, setTeacherClassCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [createdClass, setCreatedClass] = useState<{
    classCode: string;
    teacherCode: string;
  } | null>(null);
  const [teacherRows, setTeacherRows] = useState<CloudProgressRecord[] | null>(null);
  const [selectedTeacherProfileId, setSelectedTeacherProfileId] = useState<string | null>(null);
  const [teacherBusy, setTeacherBusy] = useState(false);

  const statusText = (() => {
    if (cloudSyncStatus === "connecting") return t("正在连接…", "Connecting…");
    if (cloudSyncStatus === "syncing") return t("正在同步…", "Syncing…");
    if (cloudSyncStatus === "synced") return t("已同步", "Synced");
    if (cloudSyncStatus === "error") return t("同步失败", "Sync failed");
    return t("仅保存在本机", "Saved on this device only");
  })();

  async function copy(value: string, message: string) {
    await navigator.clipboard.writeText(value);
    toast.success(message);
  }

  async function submitStudent(event: FormEvent) {
    event.preventDefault();
    setStudentBusy(true);
    try {
      if (mode === "join") {
        const link = await joinClassroom(classCode, displayName);
        setRevealRecovery(true);
        toast.success(t("已加入班级，当前进度已同步。", "Joined. Your progress is synced."));
        await copy(
          link.recoveryCode,
          t("恢复码已复制，请保存好。", "Recovery code copied. Keep it safe."),
        );
      } else {
        await restoreClassroom(classCode, recoveryCode);
        setRevealRecovery(true);
        toast.success(t("已恢复云端学习进度。", "Cloud progress restored."));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, language));
    } finally {
      setStudentBusy(false);
    }
  }

  async function createClass(event: FormEvent) {
    event.preventDefault();
    setTeacherBusy(true);
    try {
      const result = await createLearningClass(className);
      setCreatedClass({ classCode: result.classCode, teacherCode: result.teacherCode });
      setTeacherClassCode(result.classCode);
      setTeacherCode(result.teacherCode);
      toast.success(
        t("班级已创建，请立即保存教师码。", "Class created. Save the teacher code now."),
      );
    } catch (error) {
      toast.error(getErrorMessage(error, language));
    } finally {
      setTeacherBusy(false);
    }
  }

  async function loadClass(event: FormEvent) {
    event.preventDefault();
    setTeacherBusy(true);
    try {
      const rows = await getLearningClassProgress(teacherClassCode, teacherCode);
      setTeacherRows(rows);
      toast.success(t(`已读取 ${rows.length} 位学生。`, `Loaded ${rows.length} learners.`));
    } catch (error) {
      setTeacherRows(null);
      toast.error(getErrorMessage(error, language));
    } finally {
      setTeacherBusy(false);
    }
  }

  return (
    <section className="no-print mt-7 overflow-hidden rounded-xl border border-teal/25 bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-paleeco/60 p-5">
        <div className="flex gap-3">
          <div className="rounded-lg bg-teal/10 p-2 text-teal">
            <Cloud className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-navy">{t("跨设备保存", "Save across devices")}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              {t(
                "无需邮箱注册。学生使用班级码＋昵称加入，并获得一个私人恢复码。",
                "No email account required. Join with a class code and nickname, then keep your private recovery code.",
              )}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5 bg-background">
          {cloudSyncStatus === "error" ? (
            <CloudOff className="size-3.5 text-destructive" />
          ) : cloudSyncStatus === "synced" ? (
            <CheckCircle2 className="size-3.5 text-mangrove" />
          ) : (
            <Cloud className="size-3.5 text-teal" />
          )}
          {statusText}
        </Badge>
      </div>

      <div className="p-5">
        {!isCloudConfigured() ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
            {t(
              "本地预览没有云端密钥；发布版本会自动连接项目数据库。你仍可在本机保存学习进度。",
              "This local preview has no cloud keys. The published site connects automatically; local progress still works.",
            )}
          </div>
        ) : classroomLink ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-teal text-white">{classroomLink.classCode}</Badge>
                <span className="text-sm font-semibold text-navy">{classroomLink.className}</span>
                <span className="text-sm text-muted-foreground">· {classroomLink.displayName}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {cloudLastSyncedAt
                  ? `${t("最近同步", "Last synced")}: ${new Date(cloudLastSyncedAt).toLocaleString(language === "zh" ? "zh-CN" : "en-GB")}`
                  : statusText}
              </p>
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-navy">
                  <KeyRound className="size-4 text-teal" />
                  {t(
                    "你的恢复码（相当于学习档案密码）",
                    "Your recovery code (your progress password)",
                  )}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <code className="rounded bg-background px-2 py-1.5 text-sm font-semibold tracking-wide">
                    {revealRecovery ? classroomLink.recoveryCode : "••••-••••-••••-••••"}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setRevealRecovery((value) => !value)}
                  >
                    {revealRecovery ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {revealRecovery ? t("隐藏", "Hide") : t("显示", "Show")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void copy(
                        classroomLink.recoveryCode,
                        t("恢复码已复制", "Recovery code copied"),
                      )
                    }
                  >
                    <Copy className="size-4" />
                    {t("复制", "Copy")}
                  </Button>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  {t(
                    "换手机或清除浏览器数据后，用班级码和恢复码找回进度。请勿发到公开群聊。",
                    "Use the class and recovery codes on a new device. Do not post the recovery code publicly.",
                  )}
                </p>
              </div>
              {cloudSyncStatus === "error" ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-destructive">
                  <span>
                    {getErrorMessage(new Error(cloudSyncError ?? "CLOUD_REQUEST_FAILED"), language)}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void retryCloudSync()}
                  >
                    <RefreshCw className="size-3.5" />
                    {t("重试", "Retry")}
                  </Button>
                </div>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    t(
                      "断开后，本机进度不会删除；请先保存恢复码。确定断开吗？",
                      "Local progress will remain. Save your recovery code first. Disconnect?",
                    ),
                  )
                )
                  disconnectClassroom();
              }}
            >
              <LogOut className="size-4" />
              {t("断开班级", "Disconnect")}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === "join" ? "default" : "outline"}
                onClick={() => setMode("join")}
              >
                <Users className="size-4" />
                {t("第一次加入", "Join for the first time")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "restore" ? "default" : "outline"}
                onClick={() => setMode("restore")}
              >
                <RefreshCw className="size-4" />
                {t("恢复已有进度", "Restore progress")}
              </Button>
            </div>
            <form onSubmit={submitStudent} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-navy">
                {t("班级码", "Class code")}
                <Input
                  className="mt-1 uppercase"
                  value={classCode}
                  onChange={(event) => setClassCode(event.target.value)}
                  placeholder="A1B2C3"
                  maxLength={10}
                  required
                />
              </label>
              {mode === "join" ? (
                <label className="text-xs font-medium text-navy">
                  {t("昵称（请听从老师要求）", "Nickname (follow your teacher's instruction)")}
                  <Input
                    className="mt-1"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder={t("例如：八年级03号", "e.g. Grade8-03")}
                    maxLength={40}
                    required
                  />
                </label>
              ) : (
                <label className="text-xs font-medium text-navy">
                  {t("恢复码", "Recovery code")}
                  <Input
                    className="mt-1 uppercase"
                    value={recoveryCode}
                    onChange={(event) => setRecoveryCode(event.target.value)}
                    placeholder="STU-XXXX-XXXX-XXXX"
                    required
                  />
                </label>
              )}
              <div className="sm:col-span-2">
                <Button type="submit" disabled={studentBusy}>
                  {studentBusy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Cloud className="size-4" />
                  )}
                  {mode === "join"
                    ? t("加入并同步当前进度", "Join and sync current progress")
                    : t("恢复云端进度", "Restore cloud progress")}
                </Button>
              </div>
            </form>
          </div>
        )}

        <details className="mt-6 border-t border-border pt-5">
          <summary className="cursor-pointer list-none text-sm font-semibold text-navy">
            <span className="inline-flex items-center gap-2">
              <School className="size-4 text-teal" />
              {t(
                "教师工具：创建班级或查看全班进度",
                "Teacher tools: create a class or view progress",
              )}
            </span>
          </summary>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <form onSubmit={createClass} className="rounded-lg border border-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                <GraduationCap className="size-4" />
                {t("创建班级", "Create a class")}
              </h3>
              <label className="mt-3 block text-xs font-medium text-navy">
                {t("班级名称", "Class name")}
                <Input
                  className="mt-1"
                  value={className}
                  onChange={(event) => setClassName(event.target.value)}
                  placeholder={t("例如：红树林科学社 2026", "e.g. Mangrove Science Club 2026")}
                  maxLength={80}
                  required
                />
              </label>
              <Button className="mt-3" type="submit" size="sm" disabled={teacherBusy}>
                {teacherBusy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <School className="size-4" />
                )}
                {t("生成班级码", "Generate class code")}
              </Button>
              {createdClass ? (
                <div className="mt-4 rounded-lg border border-mangrove/30 bg-paleeco p-3 text-xs">
                  <p className="font-semibold text-navy">{t("创建成功", "Class created")}</p>
                  <p className="mt-2">
                    {t("给学生：", "For students: ")}
                    <code className="font-bold">{createdClass.classCode}</code>
                  </p>
                  <p className="mt-1 break-all">
                    {t("教师码（仅显示在这里）：", "Teacher code (shown here only): ")}
                    <code className="font-bold">{createdClass.teacherCode}</code>
                  </p>
                  <Button
                    className="mt-3"
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void copy(
                        `${t("班级码", "Class code")}: ${createdClass.classCode}\n${t("教师码", "Teacher code")}: ${createdClass.teacherCode}`,
                        t("班级信息已复制", "Class details copied"),
                      )
                    }
                  >
                    <Copy className="size-4" />
                    {t("复制两项", "Copy both")}
                  </Button>
                </div>
              ) : null}
            </form>

            <form onSubmit={loadClass} className="rounded-lg border border-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Users className="size-4" />
                {t("查看班级进度", "View class progress")}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium text-navy">
                  {t("班级码", "Class code")}
                  <Input
                    className="mt-1 uppercase"
                    value={teacherClassCode}
                    onChange={(event) => setTeacherClassCode(event.target.value)}
                    required
                  />
                </label>
                <label className="text-xs font-medium text-navy">
                  {t("教师码", "Teacher code")}
                  <Input
                    className="mt-1 uppercase"
                    value={teacherCode}
                    onChange={(event) => setTeacherCode(event.target.value)}
                    required
                  />
                </label>
              </div>
              <Button
                className="mt-3"
                type="submit"
                size="sm"
                variant="outline"
                disabled={teacherBusy}
              >
                {teacherBusy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                {t("读取进度", "Load progress")}
              </Button>
            </form>
          </div>

          {teacherRows ? (
            <div className="mt-5">
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[1040px] text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t("昵称", "Nickname")}</th>
                      {learningChapters.map((chapter) => (
                        <th key={chapter.id} className="px-3 py-2 font-medium">
                          {t(`第${chapter.number}章题目`, `Chapter ${chapter.number}`)}
                        </th>
                      ))}
                      <th className="px-3 py-2 font-medium">{t("38站主线", "38 stations")}</th>
                      <th className="px-3 py-2 font-medium">{t("11排口支线", "11 outfalls")}</th>
                      <th className="px-3 py-2 font-medium">{t("观察记录", "Field logs")}</th>
                      <th className="px-3 py-2 font-medium">{t("最近同步", "Last synced")}</th>
                      <th className="px-3 py-2 font-medium">{t("详情", "Details")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherRows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-3 py-6 text-center text-muted-foreground">
                          {t("还没有学生加入。", "No learners have joined yet.")}
                        </td>
                      </tr>
                    ) : (
                      teacherRows.map((row) => {
                        const locationIds = completedIds(row, "completedLocationQuizzes");
                        return (
                          <tr key={row.profile_id} className="border-t border-border">
                            <td className="px-3 py-2 font-medium text-navy">{row.display_name}</td>
                            {learningChapters.map((chapter) => {
                              const summary = chapterQuestionSummary(
                                row,
                                chapter.id,
                                chapter.quiz.length,
                              );
                              return (
                                <td key={chapter.id} className="px-3 py-2 font-medium text-teal">
                                  {summary.completed}/{summary.total}
                                </td>
                              );
                            })}
                            <td className="px-3 py-2">
                              {SAMPLING_QUEST_IDS.filter((id) => locationIds.includes(id)).length} /
                              38
                            </td>
                            <td className="px-3 py-2">
                              {OUTFALL_QUEST_IDS.filter((id) => locationIds.includes(id)).length} /
                              11
                            </td>
                            <td className="px-3 py-2">{observationRecords(row).length}</td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {new Date(row.updated_at).toLocaleString(
                                language === "zh" ? "zh-CN" : "en-GB",
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedTeacherProfileId((current) =>
                                    current === row.profile_id ? null : row.profile_id,
                                  )
                                }
                                className="font-medium text-teal underline"
                              >
                                {selectedTeacherProfileId === row.profile_id
                                  ? t("收起", "Hide")
                                  : t("查看", "View")}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {selectedTeacherProfileId &&
                (() => {
                  const row = teacherRows.find(
                    (item) => item.profile_id === selectedTeacherProfileId,
                  );
                  if (!row) return null;
                  const records = observationRecords(row);
                  return (
                    <section className="mt-3 rounded-lg border border-teal/20 bg-paleeco p-4">
                      <h3 className="text-sm font-semibold text-navy">
                        {row.display_name} · {t("学习与观察详情", "Learning and field-log details")}
                      </h3>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {learningChapters.map((chapter) => {
                          const summary = chapterQuestionSummary(
                            row,
                            chapter.id,
                            chapter.quiz.length,
                          );
                          return (
                            <div key={chapter.id} className="rounded-md border bg-white p-3">
                              <p className="text-[11px] text-muted-foreground">
                                {t(`第 ${chapter.number} 章`, `Chapter ${chapter.number}`)}
                              </p>
                              <p className="mt-1 text-lg font-semibold text-teal">
                                {summary.completed}/{summary.total}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <h4 className="mt-4 text-xs font-semibold text-navy">
                        {t(`观察记录（${records.length}）`, `Field logs (${records.length})`)}
                      </h4>
                      {records.length === 0 ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t(
                            "该学生尚未提交观察记录。",
                            "This learner has not submitted a field log yet.",
                          )}
                        </p>
                      ) : (
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {records.slice(0, 20).map((record) => (
                            <article key={record.id} className="rounded-md border bg-white p-3">
                              <p className="text-xs font-semibold text-navy">
                                {record.activityTitle}
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                {record.locationName} ·{" "}
                                {new Date(record.completedAt).toLocaleString(
                                  language === "zh" ? "zh-CN" : "en-GB",
                                )}
                              </p>
                              <dl className="mt-2 space-y-1 text-[11px] leading-5 text-muted-foreground">
                                {Object.entries(record.responses).map(([key, value]) => (
                                  <div key={key}>
                                    <dt className="inline font-medium text-navy">{key}: </dt>
                                    <dd className="inline">{value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })()}
            </div>
          ) : null}

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-[11px] leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-mangrove" />
            <p>
              {t(
                "隐私设计：保存昵称、学习进度、学生主动提交的观察记录和更新时间；不收集邮箱、电话或生日。恢复码和教师码分别控制访问权限。",
                "Privacy: nickname, learning progress, learner-submitted field logs and update time are stored. No email, phone number or birthday is collected. Recovery and teacher codes control access.",
              )}
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
