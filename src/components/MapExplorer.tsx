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
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
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

          {isCompactMap && selected && (
            <aside
              className="absolute inset-x-0 bottom-0 z-500 h-[min(58%,34rem)] rounded-t-xl border-t border-border bg-card shadow-2xl"
              aria-label={`${selected.name}地点数据`}
            >
              <StoryPanel location={selected} year={year} onClose={() => setSelectedId(null)} />
            </aside>
          )}
        </div>

        {/* 桌面端数据面板与地图并排，避免覆盖或卸载地图 */}
        <aside className="hidden w-[24rem] shrink-0 border-l border-border bg-card shadow-lg lg:block">
          {selected ? (
            <StoryPanel location={selected} year={year} onClose={() => setSelectedId(null)} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <Info className="size-6 text-teal" />
              <p className="text-sm font-medium text-navy">点击地图上的任意标记</p>
              <p className="text-xs leading-6 text-muted-foreground">
                选择一个数据点，阅读地点资料并完成对应测验。全部 {TOTAL_LEARNING_POINTS}{" "}
                个数据点完成后， 可在“学习闯关”中参加综合测验并获得证书。
              </p>
            </div>
          )}
        </aside>
      </div>

      <Timeline year={year} onChange={setYear} event={yearEvent} />
    </div>
  );
}
