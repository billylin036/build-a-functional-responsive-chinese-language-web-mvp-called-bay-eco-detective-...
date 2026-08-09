import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  MapPin,
  ShieldAlert,
  X,
} from "lucide-react";
import type { EcoLocation } from "@/data/types";
import { getAnnual } from "@/data/locations";
import {
  getLearningModule,
  getLearningSources,
  getLocationQuiz,
  TOTAL_LEARNING_POINTS,
} from "@/data/learning";
import { TrendChart } from "@/components/TrendChart";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/app-state";
import mangroveImg from "@/assets/mangrove.jpg";
import outfallImg from "@/assets/outfall.jpg";
import birdImg from "@/assets/bird.jpg";
import coastImg from "@/assets/coast.jpg";

const IMAGES: Record<string, string> = {
  mangrove: mangroveImg,
  outfall: outfallImg,
  bird: birdImg,
  coast: coastImg,
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
              请先阅读地点资料和“深度知识卡”，再完成挑战题。本题学习目标：{module.objective}
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

function KnowledgeBlock({ location }: { location: EcoLocation }) {
  const module = getLearningModule(location.id);
  const sources = getLearningSources(module.knowledge.sourceIds);

  return (
    <section className="rounded-lg border border-coral/25 bg-coral/5 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-coral" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-coral">深度知识卡</p>
          <h3 className="mt-1 text-sm font-semibold text-navy">{module.knowledge.title}</h3>
          <p className="mt-2 text-sm leading-6">{module.knowledge.fact}</p>
          <div className="mt-3 rounded-md bg-white/80 px-3 py-2">
            <p className="text-[11px] font-medium text-navy">想一想</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {module.knowledge.think}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-teal underline"
              >
                {source.publisher}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
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

function RestorationComparison({ location }: { location: EcoLocation }) {
  const [view, setView] = useState<"before" | "after">("after");

  useEffect(() => setView("after"), [location.id]);

  const before = view === "before";
  return (
    <section className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div>
          <p className="text-sm font-semibold text-navy">修复前后对比</p>
          <p className="text-[11px] text-muted-foreground">
            示意图片用于解释修复过程，不代表同机位监测照片
          </p>
        </div>
        <div
          className="flex shrink-0 rounded-sm border border-border p-0.5"
          role="group"
          aria-label="选择对比阶段"
        >
          {(["before", "after"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
              className={`rounded-[3px] px-2 py-1 text-xs ${view === mode ? "bg-teal text-white" : "text-muted-foreground"}`}
            >
              {mode === "before" ? "修复前" : "修复后"}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <img
          src={before ? coastImg : mangroveImg}
          alt={`${location.name}${before ? "修复前" : "修复后"}生态环境示意图`}
          className="h-40 w-full object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-sm bg-navy/90 px-2 py-1 text-xs text-white">
          {before
            ? `修复启动前 · ${location.restorationYear ?? "项目"}年以前`
            : "修复后 · 长期维护阶段"}
        </span>
      </div>
    </section>
  );
}

export function StoryPanel({
  location,
  year,
  onClose,
}: {
  location: EcoLocation;
  year: number;
  onClose: () => void;
}) {
  const annual = getAnnual(location, year);
  const surveyCode = location.indicators?.find((item) => item.label === "调查编号")?.value;
  const publicCoordinate = location.indicators?.find((item) => item.label === "公开坐标")?.value;
  const historicalObservation = location.indicators?.find(
    (item) => item.label === "2015 年现场记录",
  )?.value;
  const learningIndicator = location.indicators?.[0];

  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0">
        <img
          src={IMAGES[location.image] ?? mangroveImg}
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
            {location.type !== "outfall" && (
              <Badge
                variant={location.riskLevel === "高" ? "destructive" : "outline"}
                className="gap-1"
              >
                <AlertTriangle className="size-3" />
                风险 {location.riskLevel}
              </Badge>
            )}
            {location.type === "mangrove" && (
              <span className="text-xs text-muted-foreground">{year} 年示例数据</span>
            )}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-navy">{location.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
          <p className="mt-2 text-sm leading-6">{location.summary}</p>
        </div>

        {location.type === "mangrove" && (
          <div className="grid grid-cols-2 gap-2">
            <Metric label="修复起始" value={`${location.restorationYear} 年`} />
            <Metric label="修复面积" value={`${location.restorationArea} 公顷`} />
            <Metric
              label="种植株数"
              value={`${location.plantedCount?.toLocaleString("zh-CN")} 株`}
            />
            <Metric label="当前成活率" value={`${location.survivalRate}%`} />
          </div>
        )}

        {location.type === "outfall" && (
          <div className="grid grid-cols-2 gap-2">
            <Metric label="公开调查编号" value={surveyCode ?? "待确认"} />
            <Metric label="公开 GPS 坐标" value={publicCoordinate ?? "待确认"} />
            <div className="col-span-2">
              <Metric label="2015 年现场观察" value={historicalObservation ?? "原文未描述"} />
            </div>
            <div className="col-span-2">
              <Metric label="定量水质指标" value="原公开资料未提供；仅展示 2015 年现场观察" />
            </div>
          </div>
        )}

        {location.type === "learning" && learningIndicator && (
          <div className="grid grid-cols-2 gap-2">
            <Metric label={learningIndicator.label} value={learningIndicator.value} />
            <Metric label="学习主题" value={location.category} />
          </div>
        )}

        {location.condition && (
          <p className="text-sm">
            <span className="font-medium text-navy">现状：</span>
            {location.condition}
          </p>
        )}
        {location.risks && (
          <p className="text-sm">
            <span className="font-medium text-navy">风险因素：</span>
            {location.risks.join("、")}
          </p>
        )}

        {location.type === "mangrove" && <RestorationComparison location={location} />}

        {location.type === "mangrove" && (
          <div>
            <p className="mb-1 text-sm font-semibold text-navy">
              示例成活率趋势（{year} 年为标记线）
            </p>
            <TrendChart
              data={location.annualData}
              year={year}
              dataKey="survivalRate"
              label="示例成活率 %"
            />
          </div>
        )}

        {location.type === "mangrove" && annual.event && (
          <div className="rounded-md border-l-4 border-coral bg-card p-3 text-sm">
            <span className="font-medium">{year} 年示例事件：</span>
            {annual.event}
          </div>
        )}

        <StoryBlock title="发生了什么？" text={location.story.what} />
        <StoryBlock title="为什么会这样？" text={location.story.why} />
        <StoryBlock title="这为什么重要？" text={location.story.matter} />
        <StoryBlock title="进一步思考" text={location.story.action} />

        <KnowledgeBlock location={location} />
        <QuizBlock location={location} />
        <ActivityBlock location={location} />

        <p className="pb-2 text-[11px] leading-5 text-muted-foreground">
          {location.type === "outfall"
            ? "数据说明：本页展示绿源 2015 年报告正文公开的排口编号、坐标与历史水体现场描述；这些内容不代表当前状态，也不能替代定量检测。"
            : "数据说明：本页中的趋势数值与图片含示例内容，用于学习交互，不作为正式监测结论。"}
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

function StoryBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-navy">{title}</p>
      <p className="mt-0.5 text-sm leading-6 text-foreground">{text}</p>
    </div>
  );
}
