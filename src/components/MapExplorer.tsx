import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CircleHelp,
  Compass,
  Crosshair,
  GraduationCap,
  History,
  Info,
  X,
} from "lucide-react";
import { locations, OUTFALL_QUEST_IDS } from "@/data/locations";
import type { LocationType } from "@/data/types";
import { TOTAL_CHAPTERS } from "@/data/learning";
import { SAMPLING_QUEST_IDS } from "@/data/exploration";
import { LocationSearch } from "@/components/map/MapControls";
import { StoryPanel } from "@/components/StoryPanel";
import { Button } from "@/components/ui/button";
import { useIsCompactMap } from "@/hooks/use-mobile";
import { useAppState } from "@/lib/app-state";
import MapCanvas from "@/components/map/LiveMapCanvas";
import { useLanguage } from "@/lib/language";
import { locationName } from "@/data/i18n";

const ACTIVE_MAP_LAYERS: LocationType[] = ["outfall", "sampling"];
const SURVEY_YEAR = 2015;

const TUTORIAL_STEPS = [
  {
    title: "先选一个真实数据点",
    text: "地图只保留公开调查排口和 2023 年报告采样点。教程会带你到第一站。",
  },
  {
    title: "先读原始记录，再看解释",
    text: "先找到年份和原始数值，再阅读“学生要知道”。不要把一次快速检测当成完整水质结论。",
  },
  {
    title: "答题并保存探索进度",
    text: "阅读后点击“我已阅读，开始答题”。答错可以重试；答对后，这一站会计入大世界探索。",
  },
] as const;

export function MapExplorer() {
  const { language, tr } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recenter, setRecenter] = useState(0);
  const [focus, setFocus] = useState(0);
  const [locatedName, setLocatedName] = useState<string | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const isCompactMap = useIsCompactMap();
  const navigate = useNavigate();
  const { completedChapters, completedLocationQuizzes } = useAppState();

  const selected = useMemo(() => locations.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const routeIds = completedLocationQuizzes;
  const currentRouteId =
    SAMPLING_QUEST_IDS.find((id) => !completedLocationQuizzes.includes(id)) ??
    SAMPLING_QUEST_IDS.at(-1) ??
    null;
  const currentQuestStation = currentRouteId
    ? SAMPLING_QUEST_IDS.indexOf(currentRouteId) + 1
    : SAMPLING_QUEST_IDS.length;
  const currentOutfallId =
    OUTFALL_QUEST_IDS.find((id) => !completedLocationQuizzes.includes(id)) ?? OUTFALL_QUEST_IDS[0]!;
  const outfallQuestProgress = OUTFALL_QUEST_IDS.filter((id) =>
    completedLocationQuizzes.includes(id),
  ).length;

  const pick = useCallback(
    (id: string) => {
      const location = locations.find((item) => item.id === id);
      setSelectedId(id);
      setLocatedName(location ? locationName(location, language) : null);
      setFocus((f) => f + 1);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `/?location=${encodeURIComponent(id)}`);
      }
    },
    [language],
  );

  useEffect(() => {
    if (!selected) return;
    setLocatedName(locationName(selected, language));
  }, [language, selected]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialLocationId = searchParams.get("location");
    if (initialLocationId && locations.some((location) => location.id === initialLocationId)) {
      pick(initialLocationId);
    }
    if (searchParams.get("tutorial") === "1") {
      setTutorialOpen(true);
      setTutorialStep(0);
    }
  }, [pick]);

  const samplingQuestProgress = completedLocationQuizzes.filter((id) =>
    SAMPLING_QUEST_IDS.includes(id),
  ).length;
  const tutorialLocationId =
    SAMPLING_QUEST_IDS.find((id) => !completedLocationQuizzes.includes(id)) ??
    SAMPLING_QUEST_IDS[0]!;

  const layerCounts = useMemo(
    () => ({
      outfall: locations.filter((location) => location.type === "outfall").length,
      sampling: locations.filter((location) => location.type === "sampling").length,
    }),
    [],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <MapCanvas
          activeLayers={ACTIVE_MAP_LAYERS}
          year={SURVEY_YEAR}
          selectedId={selectedId}
          routeIds={routeIds}
          currentRouteId={currentRouteId}
          onSelect={pick}
          recenterSignal={recenter}
          focusSignal={focus}
          language={language}
        />

        {/* 左上：搜索 + 数据范围说明 */}
        <div className="pointer-events-none absolute left-2 top-2 z-500 w-[min(22rem,calc(100%-1rem))] space-y-2">
          <div className="pointer-events-auto">
            <LocationSearch onPick={pick} />
          </div>
          {locatedName && (
            <p
              className="pointer-events-none w-fit max-w-full truncate rounded-full bg-navy/90 px-3 py-1 text-[11px] text-white shadow"
              role="status"
            >
              {tr("已定位：", "Located: ")}
              {locatedName}
            </p>
          )}
          <div className="pointer-events-auto hidden rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-sm sm:block">
            <p className="font-medium text-navy">
              {tr(
                `地图共 ${locations.length} 个真实资料点`,
                `${locations.length} evidence-backed locations`,
              )}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-teal" />
                {tr(
                  `${layerCounts.outfall} 个历史排口`,
                  `${layerCounts.outfall} historical outfalls`,
                )}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="grid size-3.5 place-items-center rounded-full border-2 border-[#4F46E5] bg-white shadow-sm ring-1 ring-white">
                  <span className="size-1 rounded-full bg-[#312E81]" />
                </span>
                {tr(
                  `${layerCounts.sampling} 个 2023 快速检测点`,
                  `${layerCounts.sampling} rapid-test stations from 2023`,
                )}
              </span>
            </div>
            <a
              href="https://www.szhb.org/5383.html"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block font-medium text-teal underline underline-offset-2"
            >
              {tr("查看 2015 排口观察来源", "View the 2015 outfall source")}
            </a>
          </div>
        </div>

        {/* 右上：操作 */}
        <div className="absolute right-2 top-14 z-500 flex flex-col items-end gap-2 sm:top-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTutorialStep(0);
              setTutorialOpen(true);
            }}
          >
            <CircleHelp className="size-4" />
            {tr("新手教程", "How to play")}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setRecenter((r) => r + 1)}>
            <Crosshair className="size-4" />
            {tr("回到深圳湾", "Back to Shenzhen Bay")}
          </Button>
          <Button size="sm" onClick={() => navigate({ to: "/learn" })}>
            <GraduationCap className="size-4" />
            {tr("学习闯关", "Learning Quest")}
          </Button>
          <div className="rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-navy shadow-sm">
            {tr(
              `课程 ${completedChapters.length} / ${TOTAL_CHAPTERS} 章`,
              `Course ${completedChapters.length} / ${TOTAL_CHAPTERS}`,
            )}
          </div>
          <button
            type="button"
            onClick={() => currentRouteId && pick(currentRouteId)}
            className="group flex items-center gap-2 rounded-md border border-[#4F46E5]/30 bg-card/95 px-3 py-2 text-left text-xs text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-[#4F46E5]/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/35"
            aria-label={tr(
              `继续证据主线第 ${currentQuestStation} 站`,
              `Continue the Evidence Quest at station ${currentQuestStation}`,
            )}
          >
            <span className="grid size-6 place-items-center rounded-full bg-[#4F46E5]/10">
              <Compass className="size-3.5 text-[#4F46E5]" />
            </span>
            <span>
              <span className="block font-medium">{tr("证据主线", "Evidence Quest")}</span>
              <span className="block text-[10px] text-muted-foreground">
                {samplingQuestProgress === SAMPLING_QUEST_IDS.length
                  ? tr("已完成·回看第 38 站", "Complete · revisit station 38")
                  : tr(
                      `继续第 ${currentQuestStation} 站 · ${samplingQuestProgress}/38`,
                      `Continue station ${currentQuestStation} · ${samplingQuestProgress}/38`,
                    )}
              </span>
            </span>
            <ArrowRight className="ml-1 size-3.5 text-[#4F46E5] transition group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => pick(currentOutfallId)}
            className="group flex items-center gap-2 rounded-md border border-coral/30 bg-card/95 px-3 py-2 text-left text-xs text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-coral/60 hover:shadow-md"
            aria-label={tr("继续历史排口支线", "Continue the historical outfall quest")}
          >
            <span className="grid size-6 place-items-center rounded-full bg-coral/10">
              <History className="size-3.5 text-coral" />
            </span>
            <span>
              <span className="block font-medium">{tr("历史排口支线", "Outfall Archive")}</span>
              <span className="block text-[10px] text-muted-foreground">
                {tr(`继续 · ${outfallQuestProgress}/11`, `Continue · ${outfallQuestProgress}/11`)}
              </span>
            </span>
            <ArrowRight className="ml-1 size-3.5 text-coral transition group-hover:translate-x-0.5" />
          </button>
        </div>

        {tutorialOpen && (
          <div className="absolute inset-0 z-[850] flex items-center justify-center bg-navy/45 p-3 backdrop-blur-[2px]">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="map-tutorial-title"
              className="w-full max-w-md rounded-xl border border-teal/25 bg-card p-5 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] text-teal">
                    {tr("新手教程", "Tutorial")} · {tutorialStep + 1}/{TUTORIAL_STEPS.length}
                  </p>
                  <h2 id="map-tutorial-title" className="mt-1 text-xl font-semibold text-navy">
                    {language === "zh"
                      ? TUTORIAL_STEPS[tutorialStep]!.title
                      : [
                          "Choose an evidence-backed station",
                          "Read the record before interpreting it",
                          "Answer and save your progress",
                        ][tutorialStep]}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label={tr("关闭新手教程", "Close tutorial")}
                  onClick={() => setTutorialOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-7 text-foreground">
                {language === "zh"
                  ? TUTORIAL_STEPS[tutorialStep]!.text
                  : [
                      "The map contains only published survey outfalls and stations from the 2023 report. The tutorial opens the first stop in the 38-station evidence quest.",
                      "Identify the year and raw values first. A rapid field test is evidence, not a complete water-quality verdict.",
                      "After reading, start the challenge. You can retry a wrong answer; a correct answer unlocks the next station.",
                    ][tutorialStep]}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
                {TUTORIAL_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className={`h-1.5 rounded-full ${index <= tutorialStep ? "bg-teal" : "bg-muted"}`}
                  />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={tutorialStep === 0}
                  onClick={() => setTutorialStep((step) => Math.max(0, step - 1))}
                >
                  {tr("上一步", "Back")}
                </Button>
                {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setTutorialStep((step) => step + 1)}
                  >
                    {tr("下一步", "Next")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setTutorialOpen(false);
                      pick(tutorialLocationId);
                    }}
                  >
                    {tr("开始第一站", "Start station 1")}
                  </Button>
                )}
              </div>
            </section>
          </div>
        )}

        {!selected && (
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 z-[450] w-[min(34rem,calc(100%-1rem))] -translate-x-1/2"
            role="status"
          >
            <div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full border border-teal/25 bg-card/95 px-4 py-2 text-xs text-navy shadow-lg backdrop-blur-sm">
              <Info className="size-4 shrink-0 text-teal" />
              <span className="truncate sm:hidden">
                {tr("点击地图标记查看资料", "Tap a marker to explore")}
              </span>
              <span className="hidden sm:inline">
                {tr(
                  "点击地图标记查看资料与地点练习；四章主课程请前往“学习闯关”",
                  "Open a marker for evidence and a station challenge; use Learning Quest for the four course chapters.",
                )}
              </span>
            </div>
          </div>
        )}

        {selected && (
          <aside
            className={`absolute z-[700] overflow-hidden border border-border bg-card shadow-2xl ${
              isCompactMap
                ? "inset-0 rounded-none border-0"
                : "bottom-2 right-2 top-2 w-[25rem] rounded-xl"
            }`}
            aria-label={`${locationName(selected, language)} ${tr("地点数据", "location evidence")}`}
          >
            <StoryPanel
              location={selected}
              year={SURVEY_YEAR}
              onNavigate={pick}
              onClose={() => {
                setSelectedId(null);
                setLocatedName(null);
                window.history.replaceState(null, "", "/");
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
