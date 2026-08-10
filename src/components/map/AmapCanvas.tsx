import { useEffect, useRef, useState } from "react";
import {
  locations,
  MAP_LIMIT_BOUNDS,
  MAP_MIN_ZOOM,
  SHENZHEN_BAY_BOUNDARY,
  SHENZHEN_BAY_CENTER,
  SHENZHEN_BAY_DEFAULT_ZOOM,
} from "@/data/locations";
import type { EcoLocation, LocationType } from "@/data/types";
import { loadAMap, type AMapMap, type AMapNamespace, type AMapOverlay } from "@/lib/amap-loader";
import { wgs84ToGcj02 } from "@/lib/china-coordinates";
import type { MapCanvasProps } from "@/components/map/MapCanvas";
import { locationName } from "@/data/i18n";

interface AmapCanvasProps extends MapCanvasProps {
  apiKey: string;
  securityCode?: string | undefined;
  serviceHost?: string | undefined;
  onLoadError: () => void;
}

const COLORS: Record<LocationType, string> = {
  mangrove: "#67A85B",
  outfall: "#0B8F91",
  learning: "#FF6B4A",
  sampling: "#4F46E5",
};

function amapLngLat(latitude: number, longitude: number): [number, number] {
  const [gcjLatitude, gcjLongitude] = wgs84ToGcj02(latitude, longitude);
  return [gcjLongitude, gcjLatitude];
}

function createMarkerElement(
  loc: EcoLocation,
  options: {
    selected: boolean;
    current: boolean;
    onRoute: boolean;
    dry: boolean;
    year: number;
  },
  onSelect: () => void,
  displayName: string,
) {
  const color = COLORS[loc.type];
  const isSampling = loc.type === "sampling";
  const size = isSampling
    ? options.selected
      ? 28
      : options.current
        ? 26
        : 22
    : options.selected
      ? 22
      : options.current
        ? 20
        : 14;
  const button = document.createElement("button");
  button.type = "button";
  button.title = displayName;
  button.setAttribute("aria-label", displayName);
  button.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    "box-sizing:border-box",
    "padding:0",
    isSampling ? "display:grid" : "display:block",
    isSampling ? "place-items:center" : "",
    "border-radius:9999px",
    isSampling ? "background:linear-gradient(145deg,#fff 35%,#E9E7FF 100%)" : `background:${color}`,
    isSampling ? `border:2.5px solid ${color}` : "border:2px solid white",
    "cursor:pointer",
    options.selected
      ? "box-shadow:0 0 0 3px #fff,0 0 0 6px rgba(79,70,229,.78),0 6px 16px rgba(8,47,58,.34)"
      : options.current
        ? "box-shadow:0 0 0 3px #fff,0 0 0 6px #FF6B4A,0 5px 14px rgba(8,47,58,.32)"
        : options.onRoute
          ? "box-shadow:0 0 0 3px #fff,0 0 0 5px #67A85B,0 4px 12px rgba(8,47,58,.3)"
          : "box-shadow:0 0 0 2px rgba(255,255,255,.98),0 4px 11px rgba(8,47,58,.4)",
  ].join(";");
  if (isSampling) {
    const number = document.createElement("span");
    number.textContent = String(loc.waterSample?.sampleNumber ?? Number(loc.id.split("-")[1]));
    number.style.cssText = [
      "display:block",
      "color:#312E81",
      "font-family:ui-sans-serif,system-ui,sans-serif",
      `font-size:${size >= 26 ? 11 : 9}px`,
      "font-weight:850",
      "line-height:1",
      "letter-spacing:-.04em",
    ].join(";");
    button.appendChild(number);
  }
  button.addEventListener("click", onSelect);
  return button;
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
  language,
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
          center: amapLngLat(SHENZHEN_BAY_CENTER[0], SHENZHEN_BAY_CENTER[1]),
          zoom: SHENZHEN_BAY_DEFAULT_ZOOM,
          zooms: [MAP_MIN_ZOOM, 18],
          mapStyle: "amap://styles/whitesmoke",
          viewMode: "2D",
          resizeEnable: true,
        });
        map.setLimitBounds(
          new AMap.Bounds(
            amapLngLat(MAP_LIMIT_BOUNDS.south, MAP_LIMIT_BOUNDS.west),
            amapLngLat(MAP_LIMIT_BOUNDS.north, MAP_LIMIT_BOUNDS.east),
          ),
        );
        const bay = new AMap.Polygon({
          path: SHENZHEN_BAY_BOUNDARY.map(([latitude, longitude]) =>
            amapLngLat(latitude, longitude),
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
        const selected = selectedId === location.id;
        const current = currentRouteId === location.id;
        const labelCode = markerCode(location);
        const content = createMarkerElement(
          location,
          {
            selected,
            current,
            onRoute: routeIds.includes(location.id),
            dry: false,
            year,
          },
          () => selectRef.current(location.id),
          locationName(location, language),
        );
        const labelText = selected
          ? `${locationName(location, language)}｜${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
          : current
            ? language === "en"
              ? `Continue · ${labelCode}`
              : `继续·${labelCode}`
            : labelCode;
        const iconSize =
          location.type === "sampling"
            ? selected
              ? 28
              : current
                ? 26
                : 22
            : selected
              ? 22
              : current
                ? 20
                : 14;
        const marker = new AMap.Marker({
          position: amapLngLat(location.latitude, location.longitude),
          content,
          offset: new AMap.Pixel(-(iconSize / 2), -(iconSize / 2)),
          title: locationName(location, language),
          zIndex: selected ? 180 : current ? 160 : routeIds.includes(location.id) ? 140 : 120,
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
      .map((location) => amapLngLat(location.latitude, location.longitude));
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
  }, [activeLayers, currentRouteId, language, mapVersion, routeIds, selectedId, year]);

  useEffect(() => {
    if (recenterSignal > 0) {
      mapRef.current?.setZoomAndCenter(
        SHENZHEN_BAY_DEFAULT_ZOOM,
        amapLngLat(SHENZHEN_BAY_CENTER[0], SHENZHEN_BAY_CENTER[1]),
      );
    }
  }, [recenterSignal]);

  useEffect(() => {
    if (!selectedId || focusSignal === 0) return;
    const location = locations.find((item) => item.id === selectedId);
    if (location) {
      mapRef.current?.setZoomAndCenter(15, amapLngLat(location.latitude, location.longitude));
    }
  }, [focusSignal, selectedId]);

  return (
    <div
      ref={elRef}
      className="h-full w-full"
      aria-label={language === "zh" ? "深圳湾高德生态地图" : "Shenzhen Bay ecological map"}
      role="application"
    />
  );
}
