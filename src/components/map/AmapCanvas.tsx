import { useEffect, useRef, useState } from "react";
import {
  getAnnual,
  locations,
  SHENZHEN_BAY_BOUNDARY,
  SHENZHEN_BAY_CENTER,
  SHENZHEN_BAY_DEFAULT_ZOOM,
} from "@/data/locations";
import type { EcoLocation, LocationType } from "@/data/types";
import { loadAMap, type AMapMap, type AMapNamespace, type AMapOverlay } from "@/lib/amap-loader";
import type { MapCanvasProps } from "@/components/map/MapCanvas";

interface AmapCanvasProps extends MapCanvasProps {
  apiKey: string;
  securityCode?: string | undefined;
  serviceHost?: string | undefined;
  onLoadError: () => void;
}

const COLORS: Record<LocationType, string> = {
  mangrove: "#67A85B",
  outfall: "#0B8F91",
  task: "#FF6B4A",
};

function createMarkerElement(
  loc: EcoLocation,
  options: { selected: boolean; onRoute: boolean; dry: boolean; year: number },
  onSelect: () => void,
) {
  const color = options.dry && loc.type === "outfall" ? "#C7803F" : COLORS[loc.type];
  const size = options.selected ? 24 : 16;
  const button = document.createElement("button");
  button.type = "button";
  button.title = `${loc.name}，${options.year} 年数据`;
  button.setAttribute("aria-label", `查看${loc.name}的生态故事`);
  button.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    "display:block",
    "border-radius:9999px",
    `background:${color}`,
    "border:2px solid white",
    "cursor:pointer",
    options.selected
      ? "box-shadow:0 0 0 5px rgba(11,143,145,.35)"
      : options.onRoute
        ? "box-shadow:0 0 0 4px rgba(255,107,74,.48)"
        : "box-shadow:0 1px 4px rgba(9,30,66,.3)",
  ].join(";");
  button.addEventListener("click", onSelect);
  return button;
}

export default function AmapCanvas({
  activeLayers,
  year,
  selectedId,
  routeIds,
  currentRouteId,
  onSelect,
  recenterSignal,
  focusSignal,
  apiKey,
  securityCode,
  serviceHost,
  onLoadError,
}: AmapCanvasProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<AMapMap | null>(null);
  const amapRef = useRef<AMapNamespace | null>(null);
  const markerRef = useRef<AMapOverlay[]>([]);
  const routeRef = useRef<AMapOverlay | null>(null);
  const selectRef = useRef(onSelect);
  const [mapVersion, setMapVersion] = useState(0);
  selectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;
    let map: AMapMap | null = null;

    if (!elRef.current) return;
    loadAMap(apiKey, securityCode, serviceHost)
      .then((AMap) => {
        if (cancelled || !elRef.current) return;
        map = new AMap.Map(elRef.current, {
          center: [SHENZHEN_BAY_CENTER[1], SHENZHEN_BAY_CENTER[0]],
          zoom: SHENZHEN_BAY_DEFAULT_ZOOM,
          mapStyle: "amap://styles/whitesmoke",
          viewMode: "2D",
          resizeEnable: true,
        });
        const bay = new AMap.Polygon({
          path: SHENZHEN_BAY_BOUNDARY.map(
            ([latitude, longitude]) => [longitude, latitude] as [number, number],
          ),
          strokeColor: "#0B8F91",
          strokeWeight: 2,
          fillColor: "#0B8F91",
          fillOpacity: 0.09,
          bubble: true,
        });
        map.add(bay);
        AMap.plugin(["AMap.ToolBar", "AMap.Scale"], () => {
          if (!map || cancelled) return;
          map.addControl(new AMap.ToolBar({ position: "RB" }));
          map.addControl(new AMap.Scale({ position: "LB" }));
        });
        amapRef.current = AMap;
        mapRef.current = map;
        setMapVersion((version) => version + 1);
      })
      .catch(() => {
        if (!cancelled) onLoadError();
      });

    return () => {
      cancelled = true;
      map?.destroy();
      mapRef.current = null;
      amapRef.current = null;
    };
  }, [apiKey, onLoadError, securityCode, serviceHost]);

  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap) return;

    if (markerRef.current.length) map.remove(markerRef.current);
    markerRef.current = locations
      .filter((location) => activeLayers.includes(location.type))
      .map((location) => {
        const annual = getAnnual(location, year);
        const selected = selectedId === location.id || currentRouteId === location.id;
        const markerCode =
          location.type === "outfall"
            ? (location.indicators?.find((indicator) => indicator.label === "调查编号")?.value ??
              location.id.toUpperCase())
            : location.id.toUpperCase();
        const content = createMarkerElement(
          location,
          {
            selected,
            onRoute: routeIds.includes(location.id),
            dry: annual.waterFlow !== "有水",
            year,
          },
          () => selectRef.current(location.id),
        );
        const labelText = selected
          ? `${location.name}｜${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}｜${year} 年 水质 ${annual.waterQuality} 分`
          : markerCode;
        const marker = new AMap.Marker({
          position: [location.longitude, location.latitude],
          content,
          offset: new AMap.Pixel(-((selected ? 24 : 16) / 2), -((selected ? 24 : 16) / 2)),
          title: location.name,
          zIndex: selected ? 160 : routeIds.includes(location.id) ? 140 : 120,
          label: {
            content: `<div style="white-space:nowrap;border:1px solid rgba(11,143,145,.35);border-radius:6px;background:rgba(255,255,255,.96);padding:${selected ? "5px 8px" : "2px 5px"};color:#082f3a;font-size:${selected ? "11px" : "10px"};font-weight:600;box-shadow:0 2px 8px rgba(6,41,54,.16)">${labelText}</div>`,
            direction: "top" as const,
            offset: [0, -8] as [number, number],
          },
        });
        marker.on("click", () => selectRef.current(location.id));
        return marker;
      });
    if (markerRef.current.length) map.add(markerRef.current);

    if (routeRef.current) map.remove(routeRef.current);
    const routePath = routeIds
      .map((id) => locations.find((location) => location.id === id))
      .filter((location): location is EcoLocation => Boolean(location))
      .map((location) => [location.longitude, location.latitude] as [number, number]);
    routeRef.current =
      routePath.length > 1
        ? new AMap.Polyline({
            path: routePath,
            strokeColor: "#FF6B4A",
            strokeWeight: 5,
            strokeOpacity: 0.78,
            strokeStyle: "dashed",
            lineJoin: "round",
            zIndex: 110,
          })
        : null;
    if (routeRef.current) map.add(routeRef.current);
  }, [activeLayers, currentRouteId, mapVersion, routeIds, selectedId, year]);

  useEffect(() => {
    if (recenterSignal > 0) {
      mapRef.current?.setZoomAndCenter(SHENZHEN_BAY_DEFAULT_ZOOM, [
        SHENZHEN_BAY_CENTER[1],
        SHENZHEN_BAY_CENTER[0],
      ]);
    }
  }, [recenterSignal]);

  useEffect(() => {
    if (!selectedId || focusSignal === 0) return;
    const location = locations.find((item) => item.id === selectedId);
    if (location) {
      mapRef.current?.setZoomAndCenter(15, [location.longitude, location.latitude]);
    }
  }, [focusSignal, selectedId]);

  return (
    <div ref={elRef} className="h-full w-full" aria-label="深圳湾高德生态地图" role="application" />
  );
}
