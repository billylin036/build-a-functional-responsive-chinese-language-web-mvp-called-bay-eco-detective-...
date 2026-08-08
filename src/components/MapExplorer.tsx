import {
  Component,
  useCallback,
  useMemo,
  useState,
  lazy,
  Suspense,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { ClientOnly, useNavigate } from "@tanstack/react-router";
import { Crosshair, Compass, Info } from "lucide-react";
import { locations, getAnnual, YEARS } from "@/data/locations";
import type { LocationType } from "@/data/types";
import { routeStops } from "@/data/route";
import { Timeline } from "@/components/map/Timeline";
import { LayerControls, LocationSearch } from "@/components/map/MapControls";
import { StoryPanel } from "@/components/StoryPanel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppState } from "@/lib/app-state";

const MapCanvas = lazy(() => import("@/components/map/LiveMapCanvas"));

function MapFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-paleeco">
      <iframe
        title="深圳湾实时互动底图"
        src="https://www.openstreetmap.org/export/embed.html?bbox=113.91%2C22.47%2C114.06%2C22.54&layer=mapnik&marker=22.512%2C113.995"
        className="h-full w-full border-0"
        loading="eager"
      />
      <div
        className="pointer-events-none absolute bottom-2 left-2 rounded bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-sm"
        role="status"
        aria-live="polite"
      >
        正在加载生态地点与互动图层…
      </div>
    </div>
  );
}

class MapErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("互动地图加载失败，已启用实时底图。", error, info);
  }

  override render() {
    if (this.state.failed) {
      return (
        <div className="relative h-full w-full">
          <MapFallback />
          <Button
            size="sm"
            variant="secondary"
            className="absolute right-2 top-2 z-500"
            onClick={() => window.location.reload()}
          >
            重新加载互动图层
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function MapExplorer() {
  const [layers, setLayers] = useState<LocationType[]>(["mangrove", "outfall", "task"]);
  const [year, setYear] = useState(2025);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recenter, setRecenter] = useState(0);
  const [focus, setFocus] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { routeStarted, routeProgress } = useAppState();

  const selected = useMemo(() => locations.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const routeIds = routeStarted ? routeStops.map((s) => s.locationId) : [];
  const currentRouteId = routeStarted ? (routeStops[routeProgress]?.locationId ?? null) : null;

  const yearEvent = useMemo(() => {
    const source = selected ?? locations[0]!;
    const own = getAnnual(source, year).event;
    if (own) return own;
    return locations.map((l) => getAnnual(l, year).event).find(Boolean);
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
        <ClientOnly fallback={<MapFallback />}>
          <MapErrorBoundary>
            <Suspense fallback={<MapFallback />}>
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
            </Suspense>
          </MapErrorBoundary>
        </ClientOnly>

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
              ["task", "公众任务"],
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
          <Button size="sm" onClick={() => navigate({ to: "/route" })}>
            <Compass className="size-4" />
            开始侦探路线
          </Button>
        </div>

        {/* 桌面端故事面板 */}
        {!isMobile && (
          <aside className="absolute bottom-0 right-0 top-0 z-500 hidden w-[24rem] border-l border-border bg-card shadow-lg lg:block">
            {selected ? (
              <StoryPanel location={selected} year={year} onClose={() => setSelectedId(null)} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                <Info className="size-6 text-teal" />
                <p className="text-sm font-medium text-navy">点击地图上的任意标记</p>
                <p className="text-xs leading-6 text-muted-foreground">
                  你可以切换左侧数据图层、拖动下方时间轴（{YEARS[0]}–{YEARS[YEARS.length - 1]}），
                  观察同一个地点在十年间的变化，再决定要不要参与一个公众任务。
                </p>
              </div>
            )}
          </aside>
        )}
      </div>

      <Timeline year={year} onChange={setYear} event={yearEvent} />

      {/* 移动端底部抽屉 */}
      <Sheet
        open={isMobile ? Boolean(selected) : false}
        onOpenChange={(o) => !o && setSelectedId(null)}
      >
        <SheetContent
          side="bottom"
          className="h-[min(68dvh,38rem)] max-h-[calc(100dvh-8rem)] rounded-t-xl p-0"
        >
          <SheetTitle className="sr-only">
            {selected ? `${selected.name}地点故事` : "地点故事"}
          </SheetTitle>
          {selected && (
            <StoryPanel location={selected} year={year} onClose={() => setSelectedId(null)} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
