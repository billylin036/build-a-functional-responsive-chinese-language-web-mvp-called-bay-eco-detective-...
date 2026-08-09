import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Crosshair, GraduationCap, Info } from "lucide-react";
import { locations } from "@/data/locations";
import type { LocationType } from "@/data/types";
import { TOTAL_CHAPTERS } from "@/data/learning";
import { LocationSearch } from "@/components/map/MapControls";
import { StoryPanel } from "@/components/StoryPanel";
import { Button } from "@/components/ui/button";
import { useIsCompactMap } from "@/hooks/use-mobile";
import { useAppState } from "@/lib/app-state";
import MapCanvas from "@/components/map/LiveMapCanvas";

const ACTIVE_MAP_LAYERS: LocationType[] = ["outfall", "mangrove", "learning"];
const SURVEY_YEAR = 2015;

export function MapExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recenter, setRecenter] = useState(0);
  const [focus, setFocus] = useState(0);
  const isCompactMap = useIsCompactMap();
  const navigate = useNavigate();
  const { completedChapters, completedLocationQuizzes } = useAppState();

  const selected = useMemo(() => locations.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const routeIds = completedLocationQuizzes;
  const currentRouteId = null;

  const pick = useCallback((id: string) => {
    setSelectedId(id);
    setFocus((f) => f + 1);
  }, []);

  const layerCounts = useMemo(
    () => ({
      outfall: locations.filter((location) => location.type === "outfall").length,
      mangrove: locations.filter((location) => location.type === "mangrove").length,
      learning: locations.filter((location) => location.type === "learning").length,
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
        />

        {/* 左上：搜索 + 数据范围说明 */}
        <div className="pointer-events-none absolute left-2 top-2 z-500 w-[min(22rem,calc(100%-1rem))] space-y-2">
          <div className="pointer-events-auto">
            <LocationSearch onPick={pick} />
          </div>
          <div className="pointer-events-auto hidden rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-sm sm:block">
            <p className="font-medium text-navy">地图共 {locations.length} 个学习入口</p>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-teal" />
                {layerCounts.outfall} 个历史排口
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-mangrove" />
                {layerCounts.mangrove} 个红树林示例点
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-coral" />
                {layerCounts.learning} 个综合学习点
              </span>
            </div>
            <a
              href="https://www.szhb.org/5383.html"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block font-medium text-teal underline underline-offset-2"
            >
              查看 2015 排口观察来源
            </a>
          </div>
        </div>

        {/* 右上：操作 */}
        <div className="absolute right-2 top-14 z-500 flex flex-col items-end gap-2 sm:top-2">
          <Button size="sm" variant="secondary" onClick={() => setRecenter((r) => r + 1)}>
            <Crosshair className="size-4" />
            回到深圳湾
          </Button>
          <Button size="sm" onClick={() => navigate({ to: "/learn" })}>
            <GraduationCap className="size-4" />
            学习闯关
          </Button>
          <div className="rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-navy shadow-sm">
            课程 {completedChapters.length} / {TOTAL_CHAPTERS} 章
          </div>
        </div>

        {!selected && (
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 z-[450] w-[min(34rem,calc(100%-1rem))] -translate-x-1/2"
            role="status"
          >
            <div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full border border-teal/25 bg-card/95 px-4 py-2 text-xs text-navy shadow-lg backdrop-blur-sm">
              <Info className="size-4 shrink-0 text-teal" />
              <span className="truncate sm:hidden">点击地图标记查看资料</span>
              <span className="hidden sm:inline">
                点击地图标记查看资料与地点练习；四章主课程请前往“学习闯关”
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
            <StoryPanel
              location={selected}
              year={SURVEY_YEAR}
              onClose={() => setSelectedId(null)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
