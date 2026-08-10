import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Cloud, CloudOff, ClipboardPenLine, MapPin, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLearningModule } from "@/data/learning";
import { locationName } from "@/data/i18n";
import { locations } from "@/data/locations";
import { useAppState } from "@/lib/app-state";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/observations")({
  head: () => ({
    meta: [
      { title: "观察记录 | 湾区生态侦探 v1.0 公测版" },
      {
        name: "description",
        content: "学生完成安全观察后填写结构化记录，并同步到班级教师面板。",
      },
    ],
  }),
  component: ObservationRecordsPage,
});

function ObservationRecordsPage() {
  const { language } = useLanguage();
  const { classroomLink, cloudSyncStatus, activityRecords, saveActivityRecord } = useAppState();
  const [locationId, setLocationId] = useState(locations[0]!.id);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const location = locations.find((item) => item.id === locationId) ?? locations[0]!;
  const activity = getLearningModule(location.id).activity;
  const isEnglish = language === "en";
  const fields = isEnglish
    ? [
        {
          id: "context",
          label: "Date, time, weather and observation setting",
          kind: "text" as const,
          placeholder: "Example: 10 Aug, 15:20, cloudy, reviewed from a safe public path",
        },
        {
          id: "observation",
          label: "Direct observation (describe only what you saw)",
          kind: "text" as const,
          placeholder: "Colour, flow, smell, wildlife, litter or shoreline evidence",
        },
        {
          id: "limit",
          label: "Limitation or follow-up question",
          kind: "text" as const,
          placeholder: "What can this record not establish? What should be checked next?",
        },
      ]
    : activity.fields;
  const activityTitle = isEnglish ? "Structured field observation" : activity.title;
  const complete = fields.every((field) => responses[field.id]?.trim());
  const locationRecords = useMemo(
    () => activityRecords.filter((record) => record.locationId === location.id),
    [activityRecords, location.id],
  );

  useEffect(() => {
    setResponses({});
    setSaved(false);
  }, [location.id, language]);

  const t = (zh: string, en: string) => (isEnglish ? en : zh);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="rounded-xl border border-teal/25 bg-gradient-to-br from-paleeco to-card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-teal text-white">{t("独立记录空间", "STUDENT FIELD LOG")}</Badge>
            <h1 className="mt-3 text-2xl font-semibold text-navy sm:text-3xl">
              {t("观察记录", "Observation records")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {t(
                "先离开电脑，在教师组织的安全地点完成观察；回到页面后整理记录。地图不会再弹出长表单。加入班级的学生保存后会自动同步，老师可以查看记录内容。",
                "Complete the observation away from the computer at a teacher-supervised safe site, then return here to organise the record. Joined-class records sync automatically for teacher review.",
              )}
            </p>
          </div>
          <div className="rounded-lg border bg-white/85 p-3 text-xs">
            {classroomLink ? (
              <p className="flex items-center gap-2 text-mangrove">
                <Cloud className="size-4" />
                {t(
                  `已连接班级 ${classroomLink.classCode} · ${cloudSyncStatus === "synced" ? "已同步" : "正在同步"}`,
                  `Class ${classroomLink.classCode} · ${cloudSyncStatus === "synced" ? "synced" : "syncing"}`,
                )}
              </p>
            ) : (
              <div>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CloudOff className="size-4" />
                  {t("当前只保存在本机", "Currently saved on this device only")}
                </p>
                <Link className="mt-2 inline-flex text-teal underline" to="/me">
                  {t("加入班级以同步给老师", "Join a class to sync with your teacher")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ClipboardPenLine className="mt-0.5 size-5 shrink-0 text-teal" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-navy">
                {t("填写一条新记录", "Create a new record")}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t(
                  "选择真实资料点，再根据观察卡整理现场笔记。",
                  "Choose a sourced map site and organise your field notes.",
                )}
              </p>
            </div>
          </div>

          <label
            className="mt-5 block text-xs font-medium text-navy"
            htmlFor="observation-location"
          >
            {t("关联地图地点", "Linked map site")}
          </label>
          <select
            id="observation-location"
            value={location.id}
            onChange={(event) => setLocationId(event.target.value)}
            className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          >
            <optgroup label={t("2015 历史排口", "2015 historical outfalls")}>
              {locations
                .filter((item) => item.type === "outfall")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {locationName(item, language)}
                  </option>
                ))}
            </optgroup>
            <optgroup label={t("2023 快速检测点", "2023 rapid-test stations")}>
              {locations
                .filter((item) => item.type === "sampling")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {locationName(item, language)}
                  </option>
                ))}
            </optgroup>
          </select>

          <div className="mt-4 rounded-lg border border-teal/20 bg-paleeco p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                  <MapPin className="size-4 text-teal" />
                  {locationName(location, language)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{activityTitle}</p>
              </div>
              <Badge variant="outline">{t(activity.duration, "Field / classroom")}</Badge>
            </div>
            <p className="mt-3 text-xs leading-5">
              {isEnglish
                ? "Record direct evidence, its context and one limitation. Do not turn an observation into a pollution verdict."
                : activity.objective}
            </p>
            {!isEnglish && (
              <ol className="mt-3 space-y-1 text-xs leading-5 text-muted-foreground">
                {activity.steps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 flex items-start gap-2 rounded-md bg-white/90 p-2.5 text-[11px] leading-5 text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-coral" />
              {isEnglish
                ? "Stay on open public paths. Do not enter water, mudflats or outfalls, touch unknown material, or disturb wildlife. Minors must work with a teacher or guardian."
                : activity.safety}
            </p>
          </div>

          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!complete) return;
              const labelledResponses = Object.fromEntries(
                fields.map((field) => [field.label, responses[field.id] ?? ""]),
              );
              saveActivityRecord(
                location.id,
                locationName(location, language),
                activityTitle,
                labelledResponses,
              );
              setSaved(true);
            }}
          >
            {fields.map((field) => (
              <div key={field.id}>
                <label className="text-xs font-medium text-navy" htmlFor={`field-${field.id}`}>
                  {field.label}
                  {field.unit ? `（${field.unit}）` : ""}
                </label>
                {field.kind === "choice" ? (
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {field.options?.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={responses[field.id] === option}
                        onClick={() => {
                          setResponses((current) => ({ ...current, [field.id]: option }));
                          setSaved(false);
                        }}
                        className={`rounded-md border px-3 py-2 text-xs ${responses[field.id] === option ? "border-teal bg-paleeco text-navy" : "border-border bg-white text-muted-foreground hover:border-teal"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      id={`field-${field.id}`}
                      type={field.kind === "number" ? "number" : "text"}
                      min={field.kind === "number" ? 0 : undefined}
                      value={responses[field.id] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(event) => {
                        setResponses((current) => ({ ...current, [field.id]: event.target.value }));
                        setSaved(false);
                      }}
                      className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                    />
                    {field.unit && (
                      <span className="text-xs text-muted-foreground">{field.unit}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Button type="submit" disabled={!complete || saved}>
              {saved
                ? t("本次记录已保存", "Record saved")
                : t("保存并同步记录", "Save and sync record")}
            </Button>
            {saved && (
              <p role="status" className="flex items-center gap-1.5 text-xs text-mangrove">
                <CheckCircle2 className="size-4" />
                {t(
                  "记录已加入学习成果；连接班级时老师也能查看。",
                  "Added to My Progress and available to your teacher when class sync is connected.",
                )}
              </p>
            )}
          </form>
        </section>

        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">
            {t("该地点的历史记录", "Records for this site")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(`已保存 ${locationRecords.length} 次`, `${locationRecords.length} saved`)}
          </p>
          {locationRecords.length === 0 ? (
            <p className="mt-4 rounded-md border border-dashed p-4 text-xs leading-5 text-muted-foreground">
              {t(
                "还没有记录。重复观察时请保留相同方法，并注明不同的天气或潮位条件。",
                "No records yet. For repeats, keep the method comparable and document changing conditions.",
              )}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {locationRecords.slice(0, 8).map((record) => (
                <article key={record.id} className="rounded-md border border-border p-3">
                  <p className="text-xs font-medium text-navy">{record.activityTitle}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(record.completedAt).toLocaleString(isEnglish ? "en-GB" : "zh-CN")}
                  </p>
                  <p className="mt-2 line-clamp-4 text-[11px] leading-5 text-muted-foreground">
                    {Object.values(record.responses).join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
