import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { EcoLocation } from "@/data/types";
import { getAnnual } from "@/data/locations";
import { getTask } from "@/data/tasks";
import { TrendChart } from "@/components/TrendChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/app-state";
import { routeStops } from "@/data/route";
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

function QuizBlock({ loc }: { loc: EcoLocation }) {
  const stop = routeStops.find((s) => s.locationId === loc.id);
  const { answerQuiz, answeredQuiz } = useAppState();
  const [picked, setPicked] = useState<number | null>(null);
  if (!stop) return null;
  const done = answeredQuiz.includes(loc.id);
  return (
    <div className="rounded-md border border-border bg-paleeco p-3">
      <p className="text-sm font-semibold text-navy">地点小问答</p>
      <p className="mt-1 text-sm">{stop.quiz.question}</p>
      <div className="mt-2 space-y-1">
        {stop.quiz.options.map((o, i) => (
          <button
            key={o}
            onClick={() => {
              setPicked(i);
              if (i === stop.quiz.answerIndex) answerQuiz(loc.id, `答对「${loc.name}」小问答`);
            }}
            className={`block w-full rounded-sm border px-2 py-1.5 text-left text-xs transition-colors ${
              picked === i
                ? i === stop.quiz.answerIndex
                  ? "border-mangrove bg-card"
                  : "border-coral bg-card"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className="mt-2 text-xs leading-5 text-foreground">
          {picked === stop.quiz.answerIndex ? "回答正确。" : "再想想。"}
          {stop.quiz.explain}
        </p>
      )}
      {done && (
        <p className="mt-1 flex items-center gap-1 text-xs text-mangrove">
          <CheckCircle2 className="size-3.5" /> 已记录到我的探索历史
        </p>
      )}
    </div>
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
  const relatedTask = getTask(location.relatedTasks[0] ?? "");

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
            <Badge
              variant={location.riskLevel === "高" ? "destructive" : "outline"}
              className="gap-1"
            >
              <AlertTriangle className="size-3" />风险 {location.riskLevel}
            </Badge>
            <span className="text-xs text-muted-foreground">{year} 年数据</span>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-navy">{location.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
          <p className="mt-2 text-sm leading-6">{location.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Metric label="水质评分" value={`${annual.waterQuality} 分`} />
          {location.type === "outfall" ? (
            <Metric label="过水状态" value={annual.waterFlow} />
          ) : (
            <Metric label="覆盖度" value={`${annual.mangroveCoverage}%`} />
          )}
          {location.type === "mangrove" && (
            <>
              <Metric label="当年成活率" value={`${annual.survivalRate}%`} />
              <Metric label="修复面积" value={`${location.restorationArea} 公顷`} />
              <Metric
                label="种植株数"
                value={`${location.plantedCount?.toLocaleString("zh-CN")} 株`}
              />
              <Metric label="修复起始" value={`${location.restorationYear} 年`} />
            </>
          )}
          <Metric label="当年公众记录" value={`${annual.observationCount} 条`} />
        </div>

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

        <div>
          <p className="mb-1 text-sm font-semibold text-navy">十年趋势（{year} 年为标记线）</p>
          <TrendChart
            data={location.annualData}
            year={year}
            dataKey={location.type === "mangrove" ? "survivalRate" : "waterQuality"}
            label={location.type === "mangrove" ? "成活率 %" : "水质评分"}
          />
        </div>

        {annual.event && (
          <div className="rounded-md border-l-4 border-coral bg-card p-3 text-sm">
            <span className="font-medium">{year} 年大事：</span>
            {annual.event}
          </div>
        )}

        <StoryBlock title="发生了什么？" text={location.story.what} />
        <StoryBlock title="为什么会这样？" text={location.story.why} />
        <StoryBlock title="这为什么重要？" text={location.story.matter} />
        <StoryBlock title="公众可以做什么？" text={location.story.action} />

        <QuizBlock loc={location} />

        {relatedTask && (
          <div className="rounded-md border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">相关公众任务</p>
            <p className="mt-0.5 text-sm font-medium text-navy">{relatedTask.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {relatedTask.difficulty}｜{relatedTask.duration}
            </p>
            <div className="mt-2 flex gap-2">
              <Button asChild size="sm">
                <Link to="/submit" search={{ task: relatedTask.id }}>
                  提交观察记录
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/tasks">查看全部任务</Link>
              </Button>
            </div>
          </div>
        )}

        <p className="pb-2 text-[11px] leading-5 text-muted-foreground">
          说明：本页数值为基于项目材料整理的示例数据，用于科普演示，不作为监测结论。
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-2.5 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-navy">{value}</p>
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
