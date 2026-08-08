import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { locations, getAnnual, SHENZHEN_BAY_CENTER } from "@/data/locations";
import type { EcoLocation, LocationType } from "@/data/types";

export interface MapCanvasProps {
  activeLayers: LocationType[];
  year: number;
  selectedId: string | null;
  routeIds: string[];
  currentRouteId: string | null;
  onSelect: (id: string) => void;
  recenterSignal: number;
  focusSignal: number;
}

interface LeafletMapCanvasProps extends MapCanvasProps {
  onTilesReady?: (() => void) | undefined;
}

const COLORS: Record<LocationType, string> = {
  mangrove: "#67A85B",
  outfall: "#0B8F91",
  task: "#FF6B4A",
};

function markerHtml(loc: EcoLocation, opts: { selected: boolean; onRoute: boolean; dry: boolean }) {
  const color = opts.dry && loc.type === "outfall" ? "#C7803F" : COLORS[loc.type];
  const size = opts.selected ? 22 : 14;
  const ring = opts.selected
    ? "box-shadow:0 0 0 4px rgba(11,143,145,.35);"
    : opts.onRoute
      ? "box-shadow:0 0 0 3px rgba(255,107,74,.55);"
      : "";
  return `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;${ring}"></span>`;
}

export default function MapCanvas({
  activeLayers,
  year,
  selectedId,
  routeIds,
  currentRouteId,
  onSelect,
  recenterSignal,
  focusSignal,
  onTilesReady,
}: LeafletMapCanvasProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const tileSnapshotRef = useRef<HTMLDivElement | null>(null);
  const [mapVersion, setMapVersion] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const selectRef = useRef(onSelect);
  const tilesReadyRef = useRef(onTilesReady);
  selectRef.current = onSelect;
  tilesReadyRef.current = onTilesReady;

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    let cancelled = false;
    let map: LeafletMap | null = null;
    let resizeObserver: ResizeObserver | null = null;

    void import("leaflet")
      .then((leaflet) => {
        if (cancelled || !elRef.current) return;
        const L = leaflet;
        map = L.map(elRef.current, {
          center: SHENZHEN_BAY_CENTER,
          zoom: 13,
          zoomControl: false,
          attributionControl: true,
        });
        L.control
          .zoom({
            position: "bottomright",
            zoomInTitle: "放大地图",
            zoomOutTitle: "缩小地图",
          })
          .addTo(map);
        const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          keepBuffer: 2,
          updateWhenIdle: true,
          updateWhenZooming: false,
          attribution: "© OpenStreetMap 贡献者 | 底图为开源地图，站点数据为示例数据",
        });
        let tileErrorsInCycle = 0;
        const captureTileSnapshot = () => {
          const mapElement = elRef.current;
          const snapshot = tileSnapshotRef.current;
          const mapPane = mapElement?.querySelector<HTMLElement>(".leaflet-map-pane");
          const tilePane = mapElement?.querySelector<HTMLElement>(".leaflet-tile-pane");
          if (!snapshot || !mapPane || !tilePane?.querySelector(".leaflet-tile-loaded")) return;

          const clone = tilePane.cloneNode(true) as HTMLElement;
          clone.setAttribute("aria-hidden", "true");
          snapshot.replaceChildren(clone);
          snapshot.style.transform = mapPane.style.transform;
        };
        const clearTileSnapshot = () => {
          if (tileErrorsInCycle === 0) tileSnapshotRef.current?.replaceChildren();
        };

        map.on("zoomstart", captureTileSnapshot);
        tiles.on("loading", () => {
          tileErrorsInCycle = 0;
        });
        tiles.on("tileerror", () => {
          tileErrorsInCycle += 1;
        });
        tiles.on("load", clearTileSnapshot);
        tiles.once("tileload", () => tilesReadyRef.current?.());
        tiles.addTo(map);
        L.polygon(
          [
            [22.4885, 113.9235],
            [22.4975, 113.9705],
            [22.5065, 114.0225],
            [22.5285, 114.0435],
            [22.5205, 114.0475],
            [22.4995, 114.0195],
            [22.4835, 113.9605],
            [22.4795, 113.9245],
          ],
          { color: "#0B8F91", weight: 1.5, fillColor: "#0B8F91", fillOpacity: 0.08 },
        )
          .bindTooltip("深圳湾水域（示意）")
          .addTo(map);

        leafletRef.current = leaflet;
        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        resizeObserver = new ResizeObserver(() => map?.invalidateSize({ pan: false }));
        resizeObserver.observe(elRef.current);
        setMapVersion((version) => version + 1);
      })
      .catch(() => setLoadFailed(true));

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      map?.remove();
      mapRef.current = null;
      layerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  // 渲染标记：图层 / 年份 / 选中 / 路线 变化都会重绘
  useEffect(() => {
    const group = layerRef.current;
    const leaflet = leafletRef.current;
    if (!group || !leaflet) return;
    const L = leaflet;
    group.clearLayers();
    locations
      .filter((l) => activeLayers.includes(l.type))
      .forEach((loc) => {
        const annual = getAnnual(loc, year);
        const dry = annual.waterFlow !== "有水";
        const selected = selectedId === loc.id || currentRouteId === loc.id;
        const markerSize = selected ? 22 : 14;
        const marker = L.marker([loc.latitude, loc.longitude], {
          icon: L.divIcon({
            className: "eco-marker",
            html: markerHtml(loc, { selected, onRoute: routeIds.includes(loc.id), dry }),
            iconSize: [markerSize, markerSize],
            iconAnchor: [markerSize / 2, markerSize / 2],
            tooltipAnchor: [0, -(markerSize / 2 + 4)],
          }),
          keyboard: true,
          title: loc.name,
        });
        marker.bindTooltip(
          `${loc.name}｜${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}｜${year} 年 水质 ${annual.waterQuality} 分${
            loc.type === "outfall" ? `｜${annual.waterFlow}` : ""
          }`,
          { direction: "top", permanent: selected, className: "eco-data-label" },
        );
        marker.on("click", () => selectRef.current(loc.id));
        marker.addTo(group);
        if (selected) marker.openTooltip();
      });
  }, [activeLayers, year, selectedId, routeIds, currentRouteId, mapVersion]);

  // 回到深圳湾
  useEffect(() => {
    if (recenterSignal > 0) mapRef.current?.flyTo(SHENZHEN_BAY_CENTER, 13, { duration: 0.8 });
  }, [recenterSignal]);

  // 聚焦选中地点
  useEffect(() => {
    if (!selectedId || focusSignal === 0) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) mapRef.current?.flyTo([loc.latitude, loc.longitude], 15, { duration: 0.8 });
  }, [selectedId, focusSignal]);

  return (
    <div className="relative h-full w-full bg-paleeco">
      <div
        ref={tileSnapshotRef}
        className="pointer-events-none absolute inset-0 isolate z-0 overflow-hidden"
        aria-hidden="true"
      />
      <div
        ref={elRef}
        className="relative z-10 h-full w-full"
        aria-label="深圳湾生态地图"
        role="application"
      />
      {mapVersion === 0 && !loadFailed && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-paleeco/80 text-sm text-muted-foreground">
          正在连接实时地图…
        </div>
      )}
      {loadFailed && (
        <button
          type="button"
          className="absolute inset-x-4 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-md border border-border bg-card px-4 py-2 text-sm shadow"
          onClick={() => window.location.reload()}
        >
          地图连接失败，点击重试
        </button>
      )}
    </div>
  );
}
