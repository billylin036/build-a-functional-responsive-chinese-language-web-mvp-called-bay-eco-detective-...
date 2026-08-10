import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Polygon, TileLayer } from "leaflet";
import {
  locations,
  MAP_LIMIT_BOUNDS,
  MAP_MIN_ZOOM,
  SHENZHEN_BAY_BOUNDARY,
  SHENZHEN_BAY_CENTER,
  SHENZHEN_BAY_DEFAULT_ZOOM,
} from "@/data/locations";
import type { EcoLocation, LocationType } from "@/data/types";
import { wgs84ToGcj02 } from "@/lib/china-coordinates";
import type { Language } from "@/lib/language";
import { locationName } from "@/data/i18n";

export interface MapCanvasProps {
  activeLayers: LocationType[];
  year: number;
  selectedId: string | null;
  routeIds: string[];
  currentRouteId: string | null;
  onSelect: (id: string) => void;
  recenterSignal: number;
  focusSignal: number;
  language: Language;
}

interface LeafletMapCanvasProps extends MapCanvasProps {
  onTilesReady?: ((providerName: string) => void) | undefined;
}

type TileCoordinateSystem = "gcj02" | "wgs84";

const COLORS: Record<LocationType, string> = {
  mangrove: "#67A85B",
  outfall: "#0B8F91",
  learning: "#FF6B4A",
  sampling: "#4F46E5",
};

const TILE_PROVIDERS = [
  {
    name: "高德地图国内线路",
    url: "https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&size=1&scl=1&style=7",
    subdomains: "1234",
    maxZoom: 18,
    attribution: "© 高德地图",
    coordinateSystem: "gcj02",
  },
  {
    name: "OpenStreetMap 国际线路",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
    attribution: "© OpenStreetMap 贡献者",
    coordinateSystem: "wgs84",
  },
  {
    name: "OpenStreetMap HOT 国际线路",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
    attribution: "© OpenStreetMap 贡献者 · HOT",
    coordinateSystem: "wgs84",
  },
  {
    name: "CARTO 国际线路",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    maxZoom: 20,
    attribution: "© OpenStreetMap 贡献者 · CARTO",
    coordinateSystem: "wgs84",
  },
] as const satisfies ReadonlyArray<{
  name: string;
  url: string;
  subdomains: string;
  maxZoom: number;
  attribution: string;
  coordinateSystem: TileCoordinateSystem;
}>;

function mapLatLng(
  latitude: number,
  longitude: number,
  coordinateSystem: TileCoordinateSystem,
): [number, number] {
  return coordinateSystem === "gcj02" ? wgs84ToGcj02(latitude, longitude) : [latitude, longitude];
}

function mapBounds(coordinateSystem: TileCoordinateSystem): [[number, number], [number, number]] {
  return [
    mapLatLng(MAP_LIMIT_BOUNDS.south, MAP_LIMIT_BOUNDS.west, coordinateSystem),
    mapLatLng(MAP_LIMIT_BOUNDS.north, MAP_LIMIT_BOUNDS.east, coordinateSystem),
  ];
}

function markerHtml(loc: EcoLocation, opts: { selected: boolean; onRoute: boolean; dry: boolean }) {
  const color = COLORS[loc.type];
  const size = opts.selected ? 22 : 14;
  const ring = opts.selected
    ? "box-shadow:0 0 0 4px rgba(11,143,145,.35);"
    : opts.onRoute
      ? "box-shadow:0 0 0 3px rgba(255,107,74,.55);"
      : "";
  return `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;${ring}"></span>`;
}

function markerCode(loc: EcoLocation) {
  if (loc.type === "outfall") {
    return (
      loc.indicators?.find((indicator) => indicator.label === "调查编号")?.value ??
      loc.id.toUpperCase()
    );
  }
  const number = loc.id.split("-")[1] ?? loc.id;
  const prefix = loc.type === "mangrove" ? "红" : loc.type === "sampling" ? "测" : "学";
  return `${prefix}${Number(number)}`;
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
  language,
  onTilesReady,
}: LeafletMapCanvasProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const tileSnapshotRef = useRef<HTMLDivElement | null>(null);
  const [mapVersion, setMapVersion] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [tilesReady, setTilesReady] = useState(false);
  const [coordinateSystem, setCoordinateSystem] = useState<TileCoordinateSystem>("gcj02");
  const [compactLabels, setCompactLabels] = useState(false);
  const selectRef = useRef(onSelect);
  const tilesReadyRef = useRef(onTilesReady);
  selectRef.current = onSelect;
  tilesReadyRef.current = onTilesReady;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setCompactLabels(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    let cancelled = false;
    let map: LeafletMap | null = null;
    let tiles: TileLayer | null = null;
    let bay: Polygon | null = null;
    let activeCoordinateSystem: TileCoordinateSystem = "gcj02";
    let resizeObserver: ResizeObserver | null = null;
    let resizeFrame = 0;
    let fallbackTimer = 0;
    const layoutTimers: number[] = [];
    let cleanupViewportListeners: (() => void) | null = null;

    void import("leaflet")
      .then((leaflet) => {
        if (cancelled || !elRef.current) return;
        const L = leaflet;
        map = L.map(elRef.current, {
          center: mapLatLng(SHENZHEN_BAY_CENTER[0], SHENZHEN_BAY_CENTER[1], activeCoordinateSystem),
          zoom: SHENZHEN_BAY_DEFAULT_ZOOM,
          minZoom: MAP_MIN_ZOOM,
          maxBounds: mapBounds(activeCoordinateSystem),
          maxBoundsViscosity: 1,
          bounceAtZoomLimits: false,
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
        let tileErrorsInCycle = 0;
        let tileProviderIndex = 0;
        let providerHasLoadedTile = false;
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

        const tryNextProvider = (providerIndex: number) => {
          if (cancelled || providerIndex !== tileProviderIndex || providerHasLoadedTile) return;
          if (providerIndex + 1 < TILE_PROVIDERS.length) {
            startTileProvider(providerIndex + 1);
          } else {
            setLoadFailed(true);
          }
        };

        const startTileProvider = (providerIndex: number) => {
          if (cancelled || !map) return;
          window.clearTimeout(fallbackTimer);
          tiles?.remove();
          tileProviderIndex = providerIndex;
          providerHasLoadedTile = false;
          tileErrorsInCycle = 0;
          setTilesReady(false);
          setLoadFailed(false);
          const provider = TILE_PROVIDERS[providerIndex]!;
          if (provider.coordinateSystem !== activeCoordinateSystem) {
            activeCoordinateSystem = provider.coordinateSystem;
            setCoordinateSystem(activeCoordinateSystem);
            map.setMaxBounds(mapBounds(activeCoordinateSystem));
            map.setView(
              mapLatLng(SHENZHEN_BAY_CENTER[0], SHENZHEN_BAY_CENTER[1], activeCoordinateSystem),
              map.getZoom(),
              { animate: false },
            );
            bay?.setLatLngs(
              SHENZHEN_BAY_BOUNDARY.map(([latitude, longitude]) =>
                mapLatLng(latitude, longitude, activeCoordinateSystem),
              ),
            );
          }
          const activeTiles = L.tileLayer(provider.url, {
            subdomains: provider.subdomains,
            maxZoom: provider.maxZoom,
            keepBuffer: window.matchMedia("(max-width: 767px)").matches ? 1 : 2,
            updateWhenIdle: true,
            updateWhenZooming: false,
            crossOrigin: true,
            attribution: `${provider.attribution} | 历史观察与学习资料见站内来源说明`,
          });
          tiles = activeTiles;
          activeTiles.on("loading", () => {
            tileErrorsInCycle = 0;
          });
          activeTiles.on("tileerror", () => {
            tileErrorsInCycle += 1;
            if (tileErrorsInCycle >= 4) tryNextProvider(providerIndex);
          });
          activeTiles.on("load", clearTileSnapshot);
          activeTiles.once("tileload", () => {
            if (providerIndex !== tileProviderIndex) return;
            providerHasLoadedTile = true;
            window.clearTimeout(fallbackTimer);
            setTilesReady(true);
            setLoadFailed(false);
            tilesReadyRef.current?.(provider.name);
          });
          activeTiles.addTo(map);
          fallbackTimer = window.setTimeout(() => tryNextProvider(providerIndex), 7000);
        };

        map.on("zoomstart", captureTileSnapshot);
        startTileProvider(0);
        bay = L.polygon(
          SHENZHEN_BAY_BOUNDARY.map(([latitude, longitude]) =>
            mapLatLng(latitude, longitude, activeCoordinateSystem),
          ),
          {
            color: "#0B8F91",
            weight: 1.5,
            fillColor: "#0B8F91",
            fillOpacity: 0.06,
          },
        )
          .bindTooltip("深圳湾水域｜公开海湾边界")
          .addTo(map);

        leafletRef.current = leaflet;
        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        const invalidateMapSize = () => {
          window.cancelAnimationFrame(resizeFrame);
          resizeFrame = window.requestAnimationFrame(() => map?.invalidateSize({ pan: false }));
        };
        if ("ResizeObserver" in window) {
          resizeObserver = new ResizeObserver(invalidateMapSize);
          resizeObserver.observe(elRef.current);
        }
        window.addEventListener("resize", invalidateMapSize);
        window.addEventListener("orientationchange", invalidateMapSize);
        window.addEventListener("pageshow", invalidateMapSize);
        window.visualViewport?.addEventListener("resize", invalidateMapSize);
        [0, 250, 800].forEach((delay) => {
          layoutTimers.push(window.setTimeout(invalidateMapSize, delay));
        });
        setMapVersion((version) => version + 1);

        cleanupViewportListeners = () => {
          window.removeEventListener("resize", invalidateMapSize);
          window.removeEventListener("orientationchange", invalidateMapSize);
          window.removeEventListener("pageshow", invalidateMapSize);
          window.visualViewport?.removeEventListener("resize", invalidateMapSize);
        };
      })
      .catch(() => setLoadFailed(true));

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      layoutTimers.forEach((timer) => window.clearTimeout(timer));
      window.cancelAnimationFrame(resizeFrame);
      cleanupViewportListeners?.();
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
        const dry = false;
        const selected = selectedId === loc.id || currentRouteId === loc.id;
        const markerSize = selected ? 22 : 14;
        const labelCode = markerCode(loc);
        const marker = L.marker(mapLatLng(loc.latitude, loc.longitude, coordinateSystem), {
          icon: L.divIcon({
            className: "eco-marker",
            html: markerHtml(loc, { selected, onRoute: routeIds.includes(loc.id), dry }),
            iconSize: [markerSize, markerSize],
            iconAnchor: [markerSize / 2, markerSize / 2],
            tooltipAnchor: [0, -(markerSize / 2 + 4)],
          }),
          keyboard: true,
          title: locationName(loc, language),
        });
        marker.bindTooltip(
          selected
            ? `${locationName(loc, language)}｜${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`
            : labelCode,
          {
            direction: "top",
            permanent: loc.type !== "sampling" && (!compactLabels || selected),
            className: selected
              ? "eco-data-label eco-data-label--selected"
              : "eco-data-label eco-data-label--compact",
          },
        );
        marker.on("click", () => selectRef.current(loc.id));
        marker.addTo(group);
        if (selected) marker.openTooltip();
      });
  }, [
    activeLayers,
    year,
    selectedId,
    routeIds,
    currentRouteId,
    mapVersion,
    compactLabels,
    coordinateSystem,
    language,
  ]);

  // 回到深圳湾
  useEffect(() => {
    if (recenterSignal > 0) {
      mapRef.current?.flyTo(
        mapLatLng(SHENZHEN_BAY_CENTER[0], SHENZHEN_BAY_CENTER[1], coordinateSystem),
        SHENZHEN_BAY_DEFAULT_ZOOM,
        { duration: 0.8 },
      );
    }
  }, [recenterSignal, coordinateSystem]);

  // 聚焦选中地点
  useEffect(() => {
    if (!selectedId || focusSignal === 0) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) {
      mapRef.current?.flyTo(mapLatLng(loc.latitude, loc.longitude, coordinateSystem), 15, {
        duration: 0.8,
      });
    }
  }, [selectedId, focusSignal, coordinateSystem]);

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
        aria-label="深圳湾生态互动学习地图"
        role="application"
      />
      {!tilesReady && !loadFailed && (
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
