import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  MapPin,
  ShieldAlert,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { EcoLocation } from "@/data/types";
import { OUTFALL_DECADE_COMPARISON, OUTFALL_SOURCE } from "@/data/locations";
import { getSamplingPointProfile, getSamplingStoryBeat } from "@/data/exploration";
import { getLearningModule, getLocationQuiz, TOTAL_LEARNING_POINTS } from "@/data/learning";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/app-state";
import { useLanguage } from "@/lib/language";
import { locationCategory, locationName } from "@/data/i18n";
import outfallImg from "@/assets/outfall.jpg";
import waterSampleImg from "@/assets/2023-citizen-observation-rapid-test-table.png";

const IMAGES: Record<string, string> = {
  outfall: outfallImg,
  "water-sample": waterSampleImg,
};

function QuizBlock({ location }: { location: EcoLocation }) {
  const quiz = getLocationQuiz(location);
  const module = getLearningModule(location.id);
  const { completedLocationQuizzes, recordLocationAnswer } = useAppState();
  const done = completedLocationQuizzes.includes(location.id);
  const [ready, setReady] = useState(done);
  const [picked, setPicked] = useState<number | null>(done ? quiz.answerIndex : null);

  useEffect(() => {
    setReady(done);
    setPicked(done ? quiz.answerIndex : null);
  }, [done, location.id, quiz.answerIndex]);

  if (!ready) {
    return (
      <section className="rounded-lg border border-teal/25 bg-paleeco p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 size-5 shrink-0 text-teal" />
          <div>
            <p className="text-sm font-semibold text-navy">完成本数据点学习</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              请先读上方数据和“三句话读懂这一站”，再完成挑战题。学习目标：{module.objective}
            </p>
            <button
              type="button"
              onClick={() => setReady(true)}
              className="mt-3 rounded-md bg-teal px-3 py-2 text-xs font-medium text-white hover:bg-teal/90"
            >
              我已阅读，开始答题
            </button>
          </div>
        </div>
      </section>
    );
  }

  const correct = picked === quiz.answerIndex;

  return (
    <section className="rounded-lg border border-border bg-paleeco p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-navy">地点挑战题</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {quiz.skill} · {quiz.difficulty}
          </p>
        </div>
        <Badge variant={done ? "default" : "secondary"}>{done ? "已完成" : "答对后完成"}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6">{quiz.question}</p>
      <div className="mt-3 space-y-1.5">
        {quiz.options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={done}
            aria-pressed={picked === index}
            onClick={() => {
              const isCorrect = index === quiz.answerIndex;
              setPicked(index);
              recordLocationAnswer(location.id, location.name, isCorrect);
            }}
            className={`block w-full rounded-md border px-3 py-2 text-left text-xs transition-colors ${
              picked === index
                ? index === quiz.answerIndex
                  ? "border-mangrove bg-white"
                  : "border-coral bg-white"
                : "border-border bg-white hover:border-teal disabled:cursor-not-allowed"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="mt-3 text-xs leading-5" role="status" aria-live="polite">
          {correct ? (
            <p className="text-mangrove">回答正确。{quiz.explanation}</p>
          ) : (
            <p className="text-coral">回答不正确。提示：{quiz.hint}</p>
          )}
        </div>
      )}
      {done && (
        <div className="mt-3 border-t border-teal/20 pt-3">
          <p className="flex items-center gap-1 text-xs font-medium text-mangrove">
            <CheckCircle2 className="size-3.5" />
            本数据点已计入学习进度
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            已完成 {completedLocationQuizzes.length} / {TOTAL_LEARNING_POINTS} 个数据点
          </p>
          <Link className="mt-2 inline-block text-xs text-teal underline" to="/learn">
            返回学习闯关中心
          </Link>
        </div>
      )}
    </section>
  );
}

function ActivityBlock({ location }: { location: EcoLocation }) {
  const activity = getLearningModule(location.id).activity;
  const { activityRecords, saveActivityRecord } = useAppState();
  const [started, setStarted] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const records = activityRecords.filter((record) => record.locationId === location.id);

  useEffect(() => {
    setStarted(false);
    setResponses({});
    setSaved(false);
  }, [location.id]);

  const complete = activity.fields.every((field) => responses[field.id]?.trim());

  return (
    <section className="rounded-lg border border-teal/25 bg-teal/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Activity className="mt-0.5 size-5 shrink-0 text-teal" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-teal">
              互动观察活动
            </p>
            <h3 className="mt-1 text-sm font-semibold text-navy">{activity.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {activity.mode} · {activity.duration}
            </p>
          </div>
        </div>
        {records.length > 0 && <Badge variant="outline">已记录 {records.length} 次</Badge>}
      </div>

      <p className="mt-3 text-xs leading-5">{activity.objective}</p>
      <ol className="mt-3 space-y-1 text-xs leading-5 text-muted-foreground">
        {activity.steps.map((step, index) => (
          <li key={step}>
            {index + 1}. {step}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-start gap-2 rounded-md bg-white/80 p-2.5 text-[11px] leading-5 text-muted-foreground">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-coral" />
        {activity.safety}
      </div>

      {!started ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-3 rounded-md bg-navy px-3 py-2 text-xs font-medium text-white hover:bg-navy/90"
        >
          开始记录
        </button>
      ) : (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!complete) return;
            saveActivityRecord(location.id, location.name, activity.title, responses);
            setSaved(true);
          }}
        >
          {activity.fields.map((field) => (
            <div key={field.id}>
              <label
                className="text-xs font-medium text-navy"
                htmlFor={`${location.id}-${field.id}`}
              >
                {field.label}
                {field.unit ? `（${field.unit}）` : ""}
              </label>
              {field.kind === "choice" ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {field.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={responses[field.id] === option}
                      onClick={() => {
                        setResponses((current) => ({ ...current, [field.id]: option }));
                        setSaved(false);
                      }}
                      className={`rounded-md border px-2.5 py-1.5 text-xs ${
                        responses[field.id] === option
                          ? "border-teal bg-white text-navy"
                          : "border-border bg-white text-muted-foreground hover:border-teal"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    id={`${location.id}-${field.id}`}
                    type={field.kind === "number" ? "number" : "text"}
                    min={field.kind === "number" ? 0 : undefined}
                    value={responses[field.id] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => {
                      setResponses((current) => ({ ...current, [field.id]: event.target.value }));
                      setSaved(false);
                    }}
                    className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-2 text-xs outline-none focus:border-teal"
                  />
                  {field.unit && (
                    <span className="text-xs text-muted-foreground">{field.unit}</span>
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={!complete || saved}
            className="rounded-md bg-teal px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saved ? "本次记录已保存" : "保存观察记录"}
          </button>
          {saved && (
            <p role="status" className="flex items-center gap-1 text-xs text-mangrove">
              <CheckCircle2 className="size-3.5" />
              已加入“学习成果”，可再次进入此地点进行新的重复观察。
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function OutfallDecadeComparison() {
  const data = OUTFALL_DECADE_COMPARISON;
  return (
    <section className="rounded-lg border border-teal/25 bg-paleeco p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">30 个排口整体达标率</p>
          <p className="mt-1 text-sm font-semibold text-navy">
            2015：{data.baselineComplianceRate}% <span className="mx-1 text-teal">→</span> 2025：
            {data.revisitComplianceRate}%
          </p>
        </div>
        <Badge variant="outline">整体对比</Badge>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        这是 30 个排口的总体结果，不代表当前这个排口的状况；2025 年逐点数据尚未公开。
      </p>
      <a
        href={data.publicRevisitSourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-teal underline underline-offset-2"
      >
        查看 2025 回访来源
        <ExternalLink className="size-3" />
      </a>
    </section>
  );
}

function WaterSampleCard({ location }: { location: EcoLocation }) {
  const sample = location.waterSample;
  if (!sample) return null;

  return (
    <section className="rounded-lg border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">2023 现场快速检测</p>
        <Badge variant="outline">报告序号 {sample.sampleNumber}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="pH" value={sample.pH} />
        <Metric label="总磷（TP）" value={sample.totalPhosphorus} />
        <Metric label="COD" value={sample.cod} />
        <Metric label="氨氮（NH₃-N）" value={sample.ammoniaNitrogen} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        数值按报告原表录入；原表截图未注明单位，因此本站不自行补写。
      </p>
      <p className="mt-2 rounded-md border-l-4 border-[#4F46E5] bg-card px-3 py-2 text-xs leading-5 text-muted-foreground">
        {sample.coordinateNote}
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">数据来源：{sample.sourceLabel}</p>
    </section>
  );
}

function SamplingStorylineCard({
  location,
  onNavigate,
}: {
  location: EcoLocation;
  onNavigate: (id: string) => void;
}) {
  const beat = getSamplingStoryBeat(location.id);
  const { completedLocationQuizzes } = useAppState();
  if (!beat) return null;
  const completed = completedLocationQuizzes.includes(location.id);

  return (
    <section className="rounded-lg border border-[#4F46E5]/30 bg-gradient-to-br from-[#4F46E5]/10 to-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-medium text-[#4F46E5]">
          主线故事 · 第 {beat.index} / {beat.total} 站
        </p>
        <Badge variant="outline">第 {beat.actNumber} 幕</Badge>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-navy">{beat.title}</h3>
      <p className="mt-2 text-xs leading-5 text-foreground">{beat.narrative}</p>
      <div className="mt-3 rounded-md bg-white/80 p-3">
        <p className="text-[11px] font-medium text-teal">本幕目标</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{beat.actGoal}</p>
        <p className="mt-2 text-[11px] font-medium text-teal">本站能力</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{beat.learningGoal}</p>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{beat.transition}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!beat.previousId}
          onClick={() => beat.previousId && onNavigate(beat.previousId)}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-xs text-navy disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="size-3.5" />
          上一站
        </button>
        {beat.nextId ? (
          <button
            type="button"
            disabled={!completed}
            title={completed ? "进入下一站" : "答对本站挑战题后解锁"}
            onClick={() => completed && onNavigate(beat.nextId!)}
            className="inline-flex items-center gap-1 rounded-md bg-[#4F46E5] px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {completed ? "下一站" : "答题后解锁"}
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <Link
            to="/learn"
            className="inline-flex items-center gap-1 rounded-md bg-mangrove px-3 py-2 text-xs font-medium text-white"
          >
            完成主线总结
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    </section>
  );
}

function OutfallSourceCard() {
  return (
    <section className="rounded-lg border border-teal/25 bg-paleeco p-3">
      <p className="text-sm font-semibold text-navy">这 11 个排口的数据从哪里来？</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {OUTFALL_SOURCE.publisher}官网于 {OUTFALL_SOURCE.pagePublished} 发布
        {OUTFALL_SOURCE.title}；文内调查报告日期为 {OUTFALL_SOURCE.reportDate}。
        {OUTFALL_SOURCE.note}
      </p>
      <a
        href={OUTFALL_SOURCE.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal underline underline-offset-2"
      >
        查看绿源官网原文
        <ExternalLink className="size-3" />
      </a>
    </section>
  );
}

const EN_ACTS = [
  {
    title: "Act I · Establish the evidence baseline",
    goal: "Read raw values and separate an observation from an interpretation or verdict.",
  },
  {
    title: "Act II · Trace mixing and comparison",
    goal: "Use upstream, tributary and downstream controls to build a spatial comparison.",
  },
  {
    title: "Act III · Enter the urban water network",
    goal: "Recognize rainfall, time, flow and human activity as possible confounding factors.",
  },
  {
    title: "Act IV · Reach the river–estuary zone",
    goal: "Include tide, freshwater–saltwater mixing and repeat sampling in the final design.",
  },
] as const;

const EN_STATION_QUESTIONS = [
  {
    question: "What is the strongest conclusion supported by one rapid field-test record?",
    options: [
      "It provides a clue for follow-up investigation",
      "It proves the long-term water-quality class",
      "It identifies the pollution source",
      "It proves the whole basin has the same condition",
    ],
    answer: 0,
    explanation:
      "A single rapid test is useful evidence, but it cannot establish a long-term class or cause by itself.",
  },
  {
    question:
      "Before comparing this station with another one, which information is most important?",
    options: [
      "Whether units, methods, timing and field conditions are comparable",
      "Which station name is shorter",
      "Which marker is closer on the screen",
      "Which value looks more dramatic",
    ],
    answer: 0,
    explanation:
      "A comparison is only meaningful when measurement and sampling conditions are sufficiently comparable.",
  },
  {
    question: "If two stations differ, what should a student investigator do next?",
    options: [
      "Treat the difference as a clue and collect repeat or control evidence",
      "Immediately name a polluter",
      "Delete the inconvenient value",
      "Assume the difference will never change",
    ],
    answer: 0,
    explanation:
      "A difference can guide the next investigation, but it does not explain its own cause.",
  },
  {
    question: "Which plan is most reproducible?",
    options: [
      "Record location, time, weather and water conditions, then repeat with the same method",
      "Visit once and rely on memory",
      "Change the method at every station",
      "Record only the most unusual observation",
    ],
    answer: 0,
    explanation: "A reproducible record lets another team understand and repeat the observation.",
  },
] as const;

function EnglishStationQuiz({ location }: { location: EcoLocation }) {
  const { completedLocationQuizzes, recordLocationAnswer } = useAppState();
  const question =
    EN_STATION_QUESTIONS[
      (location.waterSample?.sampleNumber ?? Number(location.id.slice(-2))) %
        EN_STATION_QUESTIONS.length
    ]!;
  const done = completedLocationQuizzes.includes(location.id);
  const [picked, setPicked] = useState<number | null>(done ? question.answer : null);

  useEffect(() => {
    setPicked(done ? question.answer : null);
  }, [done, location.id, question.answer]);

  return (
    <section className="rounded-lg border border-teal/25 bg-paleeco p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">Station challenge</p>
        <Badge variant={done ? "default" : "secondary"}>
          {done ? "Completed" : "Unlock the next stop"}
        </Badge>
      </div>
      <p className="mt-2 text-sm leading-6">{question.question}</p>
      <div className="mt-3 space-y-1.5">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={done}
            onClick={() => {
              setPicked(index);
              recordLocationAnswer(location.id, location.name, index === question.answer);
            }}
            className={`block w-full rounded-md border px-3 py-2 text-left text-xs ${
              picked === index
                ? index === question.answer
                  ? "border-mangrove bg-white"
                  : "border-coral bg-white"
                : "border-border bg-white hover:border-teal"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p
          className={`mt-3 text-xs leading-5 ${picked === question.answer ? "text-mangrove" : "text-coral"}`}
        >
          {picked === question.answer
            ? `Correct. ${question.explanation}`
            : "Try again: choose the conclusion or method that stays within the available evidence."}
        </p>
      )}
    </section>
  );
}

function EnglishStoryPanel({
  location,
  onClose,
  onNavigate,
}: {
  location: EcoLocation;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const beat = getSamplingStoryBeat(location.id);
  const { completedLocationQuizzes } = useAppState();
  const completed = completedLocationQuizzes.includes(location.id);
  const act = beat ? EN_ACTS[beat.actNumber - 1]! : null;
  const next = beat?.nextId;

  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0">
        <img
          src={IMAGES[location.image] ?? outfallImg}
          alt="Field evidence"
          className="h-32 w-full object-cover"
          loading="lazy"
        />
        <button
          onClick={onClose}
          aria-label="Close location"
          className="absolute right-2 top-2 rounded-full bg-card/90 p-1.5 text-navy shadow-sm"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <Badge variant="secondary">{locationCategory(location, "en")}</Badge>
          <h2 className="mt-2 text-lg font-semibold text-navy">{locationName(location, "en")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </p>
        </div>

        {location.waterSample ? (
          <section className="rounded-lg border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-navy">2023 rapid field test</p>
              <Badge variant="outline">Report row {location.waterSample.sampleNumber}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Metric label="pH" value={location.waterSample.pH} />
              <Metric label="Total phosphorus (TP)" value={location.waterSample.totalPhosphorus} />
              <Metric label="COD" value={location.waterSample.cod} />
              <Metric
                label="Ammonia nitrogen (NH₃-N)"
                value={location.waterSample.ammoniaNitrogen}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Values are transcribed from the report table. The published screenshot does not state
              units, so this site does not invent them. The report did not publish GPS coordinates;
              the marker is a place-name-matched reference location.
            </p>
          </section>
        ) : (
          <section className="rounded-lg border border-teal/25 bg-paleeco p-3">
            <p className="text-sm font-semibold text-navy">2015 historical outfall survey</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              This marker uses a coordinate and field description published by Green Source. It
              describes the survey period only and must not be treated as the current condition.
            </p>
            <a
              href={OUTFALL_SOURCE.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal underline"
            >
              Open the official source <ExternalLink className="size-3" />
            </a>
          </section>
        )}

        {beat && act && (
          <section className="rounded-lg border border-[#4F46E5]/30 bg-gradient-to-br from-[#4F46E5]/10 to-card p-4">
            <p className="font-mono text-[11px] font-medium text-[#4F46E5]">
              MAIN STORY · STATION {beat.index} / {beat.total}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-navy">{act.title}</h3>
            <p className="mt-2 text-xs leading-5 text-foreground">
              This station continues a 38-stop evidence journey. Carry the method learned at the
              previous stop into a new hydrological setting; this is a learning sequence, not a
              claim that all stations are physically connected.
            </p>
            <p className="mt-2 rounded-md bg-white/80 p-3 text-xs leading-5 text-muted-foreground">
              <span className="font-medium text-teal">Learning goal:</span> {act.goal}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={!beat.previousId}
                onClick={() => beat.previousId && onNavigate(beat.previousId)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-xs disabled:opacity-40"
              >
                <ArrowLeft className="size-3.5" />
                Previous
              </button>
              {next ? (
                <button
                  type="button"
                  disabled={!completed}
                  onClick={() => completed && onNavigate(next)}
                  className="inline-flex items-center gap-1 rounded-md bg-[#4F46E5] px-3 py-2 text-xs font-medium text-white disabled:bg-muted disabled:text-muted-foreground"
                >
                  {completed ? "Next station" : "Answer to unlock"}
                  <ArrowRight className="size-3.5" />
                </button>
              ) : (
                <Link
                  to="/learn"
                  className="rounded-md bg-mangrove px-3 py-2 text-xs font-medium text-white"
                >
                  Finish the quest
                </Link>
              )}
            </div>
          </section>
        )}

        <EnglishStationQuiz location={location} />
      </div>
    </div>
  );
}

function StudentReadCard({
  location,
  historicalObservation,
}: {
  location: EcoLocation;
  historicalObservation?: string;
}) {
  const quest = getSamplingPointProfile(location.id);
  const rows =
    location.type === "sampling" && quest
      ? [
          ["地点角色", `${quest.role}。${quest.roleLesson}`],
          ["学生要知道", quest.indicatorLesson],
          ["本点任务", quest.mission],
        ]
      : [
          ["2015 年看到什么", historicalObservation ?? "公开资料未描述现场现象。"],
          ["学生要知道", "这是一次历史现场观察，只说明当时的情况，不能代表现在。"],
          ["怎样继续调查", "回到同一坐标，记录日期、天气和潮位，再用规范方法复查。"],
        ];

  return (
    <section className="rounded-lg border border-coral/20 bg-coral/5 p-3">
      <div className="flex items-center gap-1.5">
        {quest && <Compass className="size-4 text-[#4F46E5]" />}
        <p className="text-sm font-semibold text-navy">
          {quest ? `${quest.missionCode} · 读懂这一站` : "三句话读懂这一站"}
        </p>
      </div>
      <div className="mt-2 divide-y divide-border/70">
        {rows.map(([label, text]) => (
          <div key={label} className="py-2 first:pt-0 last:pb-0">
            <p className="text-[11px] font-medium text-teal">{label}</p>
            <p className="mt-0.5 text-xs leading-5 text-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StoryPanel({
  location,
  onClose,
  onNavigate,
}: {
  location: EcoLocation;
  year: number;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const { language } = useLanguage();
  if (language === "en") {
    return <EnglishStoryPanel location={location} onClose={onClose} onNavigate={onNavigate} />;
  }
  const surveyCode = location.indicators?.find((item) => item.label === "调查编号")?.value;
  const publicCoordinate = location.indicators?.find((item) => item.label === "公开坐标")?.value;
  const historicalObservation = location.indicators?.find(
    (item) => item.label === "2015 年现场记录",
  )?.value;
  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0">
        <img
          src={IMAGES[location.image] ?? outfallImg}
          alt={`${location.name}现场示意图`}
          className="h-36 w-full object-cover"
          loading="lazy"
        />
        <button
          onClick={onClose}
          aria-label="关闭地点故事"
          className="absolute right-2 top-2 rounded-full bg-card/90 p-1.5 text-navy shadow-sm"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{location.category}</Badge>
            {location.type === "sampling" && <Badge variant="outline">2023 · 报告实测表</Badge>}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-navy">{location.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>

        {location.type === "outfall" && (
          <div className="grid grid-cols-2 gap-2">
            <Metric label="公开调查编号" value={surveyCode ?? "待确认"} />
            <Metric label="公开 GPS 坐标" value={publicCoordinate ?? "待确认"} />
          </div>
        )}

        {location.type === "outfall" && <OutfallDecadeComparison />}

        {location.type === "outfall" && <OutfallSourceCard />}

        {location.type === "sampling" && <WaterSampleCard location={location} />}

        {location.type === "sampling" && (
          <SamplingStorylineCard location={location} onNavigate={onNavigate} />
        )}

        <StudentReadCard
          location={location}
          {...(historicalObservation ? { historicalObservation } : {})}
        />

        <QuizBlock location={location} />
        <ActivityBlock location={location} />

        <p className="pb-2 text-[11px] leading-5 text-muted-foreground">
          {location.type === "outfall"
            ? "来源说明：坐标和现场描述来自绿源 2015 年公开调查；历史记录不代表当前状态。"
            : "来源说明：四项数据来自绿源 2023 年报告；报告未公开采样 GPS，地图位置是按真实地名匹配的参考位置。"}
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="h-full rounded-md border border-border bg-card px-2.5 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold leading-5 text-navy">{value}</p>
    </div>
  );
}
