import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Crosshair, GraduationCap, Info } from "lucide-react";
import { locations, getAnnual, YEARS } from "@/data/locations";
import type { LocationType } from "@/data/types";
import { TOTAL_LEARNING_POINTS } from "@/data/learning";
import { Timeline } from "@/components/map/Timeline";
import { LayerControls, LocationSearch } from "@/components/map/MapControls";
import { StoryPanel } from "@/components/StoryPanel";
import { Button } from "@/components/ui/button";
import { useIsCompactMap } from "@/hooks/use-mobile";
import { useAppState } from "@/lib/app-state";
import MapCanvas from "@/components/map/LiveMapCanvas";

export function MapExplorer() {
  const [layers, setLayers] = useState<LocationType[]>(["mangrove", "outfall", "learning"]);
  const [year, setYear] = useState(2025);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recenter, setRecenter] = useState(0);
  const [focus, setFocus] = useState(0);
  const isCompactMap = useIsCompactMap();
  const navigate = useNavigate();
  const { completedLocationQuizzes } = useAppState();

  const selected = useMemo(() => locations.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const routeIds = completedLocationQuizzes;
  const currentRouteId = null;

  const yearEvent = useMemo(() => {
    const source =
      selected?.type === "mangrove"
        ? selected
        : locations.find((location) => location.type === "mangrove")!;
    const own = getAnnual(source, year).event;
    if (own) return own;
    return locations
      .filter((location) => location.type === "mangrove")
      .map((location) => getAnnual(location, year).event)
      .find(Boolean);
  }, [selected, year]);

  const pick = useCallback((id: string) => {
    const location = locations.find((item) => item.id === id);
    if (location) {
      setLayers((current) =>
        current.includes(location.type) ? current : [...current, location.type],
      );
    }
    setSelectedId(id);
    setFocus((f) => f + 1);
  }, []);

  const visibleCount = locations.filter((l) => layers.includes(l.type)).length;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="relative min-h-0 flex-1">
        <MapCanvas
          activeLayers={layers}
          year={year}
          selectedId={selectedId}
          routeIds={routeIds}
          currentRouteId={currentRouteId}
          onSelect={pick}
          recenterSignal={recenter}
          focusSignal={focus}
        />

        {/* 左上：搜索 + 图层 + 图例 */}
        <div className="pointer-events-none absolute left-2 top-2 z-500 w-[min(19rem,calc(100%-1rem))] space-y-2">
          <div className="pointer-events-auto">
            <LocationSearch onPick={pick} />
          </div>
          <div className="pointer-events-auto hidden sm:block">
            <LayerControls
              active={layers}
              onToggle={(id) =>
                setLayers((ls) => (ls.includes(id) ? ls.filter((l) => l !== id) : [...ls, id]))
              }
            />
          </div>
          <div className="pointer-events-auto rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-sm">
            当前显示 {visibleCount} 个地点 · 点击标记查看故事
            {visibleCount === 0 && "（已隐藏全部图层，请至少开启一个）"}
          </div>
        </div>

        {/* 手机端图层横条 */}
        <div className="absolute left-2 right-2 top-14 z-500 flex gap-1 overflow-x-auto sm:hidden">
          {(
            [
              ["mangrove", "红树林"],
              ["outfall", "排口水质"],
              ["learning", "综合学习点"],
            ] as [LocationType, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() =>
                setLayers((ls) => (ls.includes(id) ? ls.filter((l) => l !== id) : [...ls, id]))
              }
              aria-pressed={layers.includes(id)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs shadow-sm ${
                layers.includes(id)
                  ? "border-teal bg-teal text-primary-foreground"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 右上：操作 */}
        <div className="absolute right-2 top-2 z-500 flex flex-col items-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setRecenter((r) => r + 1)}>
            <Crosshair className="size-4" />
            回到深圳湾
          </Button>
          <Button size="sm" onClick={() => navigate({ to: "/learn" })}>
            <GraduationCap className="size-4" />
            学习闯关
          </Button>
          <div className="rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-navy shadow-sm">
            已完成 {completedLocationQuizzes.length} / {TOTAL_LEARNING_POINTS}
          </div>
        </div>

        {!selected && (
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 z-[450] w-[min(34rem,calc(100%-1rem))] -translate-x-1/2"
            role="status"
          >
            <div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full border border-teal/25 bg-card/95 px-4 py-2 text-xs text-navy shadow-lg backdrop-blur-sm">
              <Info className="size-4 shrink-0 text-teal" />
              <span className="truncate sm:hidden">点击地图标记开始学习</span>
              <span className="hidden sm:inline">
                点击任意地图标记阅读资料并答题；完成全部 {TOTAL_LEARNING_POINTS}{" "}
                个数据点后解锁综合测验
              </span>
            </div>
          </div>
        )}

        {selected && (
          <aside
            className={`absolute z-[700] overflow-hidden border border-border bg-card shadow-2xl ${
              isCompactMap
                ? "inset-x-0 bottom-0 h-[min(62%,36rem)] rounded-t-xl"
                : "bottom-2 right-2 top-2 w-[25rem] rounded-xl"
            }`}
            aria-label={`${selected.name}地点数据`}
          >
            <StoryPanel location={selected} year={year} onClose={() => setSelectedId(null)} />
          </aside>
        )}
      </div>

      <Timeline year={year} onChange={setYear} event={yearEvent} />
    </div>
  );
}
