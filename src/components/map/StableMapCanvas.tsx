import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { getAnnual, locations } from "@/data/locations";
import type { EcoLocation, LocationType } from "@/data/types";
import type { MapCanvasProps } from "@/components/map/MapCanvas";

const WIDTH = 1000;
const HEIGHT = 600;
const BOUNDS = { west: 113.91, east: 114.06, south: 22.47, north: 22.54 };

const COLORS: Record<LocationType, string> = {
  mangrove: "#67A85B",
  outfall: "#0B8F91",
  task: "#FF6B4A",
};

const NORTH_SHORE: [number, number][] = [
  [113.91, 22.518],
  [113.935, 22.515],
  [113.958, 22.507],
  [113.98, 22.508],
  [114.0, 22.514],
  [114.025, 22.524],
  [114.06, 22.536],
];

const SOUTH_SHORE: [number, number][] = [
  [113.91, 22.482],
  [113.94, 22.48],
  [113.97, 22.484],
  [114.0, 22.491],
  [114.03, 22.496],
  [114.06, 22.501],
];

function project(longitude: number, latitude: number) {
  return {
    x: ((longitude - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * WIDTH,
    y: ((BOUNDS.north - latitude) / (BOUNDS.north - BOUNDS.south)) * HEIGHT,
  };
}

function points(items: [number, number][]) {
  return items.map(([longitude, latitude]) => {
    const point = project(longitude, latitude);
    return `${point.x},${point.y}`;
  });
}

function markerLabel(location: EcoLocation, year: number) {
  const annual = getAnnual(location, year);
  return `${location.name}｜${year} 年 水质 ${annual.waterQuality} 分${
    location.type === "outfall" ? `｜${annual.waterFlow}` : ""
  }`;
}

export default function StableMapCanvas({
  activeLayers,
  year,
  selectedId,
  routeIds,
  currentRouteId,
  onSelect,
  recenterSignal,
  focusSignal,
}: MapCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const selected = locations.find((location) => location.id === selectedId) ?? null;

  const visibleLocations = useMemo(
    () => locations.filter((location) => activeLayers.includes(location.type)),
    [activeLayers],
  );
  const routeLocations = useMemo(
    () =>
      routeIds
        .map((id) => locations.find((location) => location.id === id))
        .filter((location): location is EcoLocation => Boolean(location)),
    [routeIds],
  );

  useEffect(() => {
    if (recenterSignal === 0) return;
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [recenterSignal]);

  useEffect(() => {
    if (!selected || focusSignal === 0) return;
    const point = project(selected.longitude, selected.latitude);
    const nextZoom = 2.2;
    setZoom(nextZoom);
    setPan({
      x: -(point.x - WIDTH / 2) * nextZoom,
      y: -(point.y - HEIGHT / 2) * nextZoom,
    });
  }, [focusSignal, selected]);

  const changeZoom = (next: number) => {
    const clamped = Math.min(3, Math.max(1, next));
    setZoom(clamped);
    if (clamped === 1) setPan({ x: 0, y: 0 });
  };

  const handleKey = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    dragRef.current = { pointerId: drag.pointerId, x: event.clientX, y: event.clientY };
    setPan((current) => ({ x: current.x + dx, y: current.y + dy }));
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const transform = `translate(${WIDTH / 2 + pan.x} ${HEIGHT / 2 + pan.y}) scale(${zoom}) translate(${-WIDTH / 2} ${-HEIGHT / 2})`;
  const north = points(NORTH_SHORE);
  const south = points(SOUTH_SHORE);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#cfe9ec]">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full touch-none select-none"
        role="application"
        aria-label="深圳湾生态地图"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={(event) => {
          event.preventDefault();
          changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
        }}
      >
        <rect width={WIDTH} height={HEIGHT} fill="#cfe9ec" />
        <g transform={transform}>
          <polygon points={`0,0 ${WIDTH},0 ${north.reverse().join(" ")}`} fill="#e8f1df" />
          <polyline
            points={north.reverse().join(" ")}
            fill="none"
            stroke="#6f9f78"
            strokeWidth="3"
          />
          <polygon
            points={`0,${HEIGHT} ${WIDTH},${HEIGHT} ${south.reverse().join(" ")}`}
            fill="#edf0dc"
          />
          <polyline
            points={south.reverse().join(" ")}
            fill="none"
            stroke="#8da67d"
            strokeWidth="2.5"
          />

          <path
            d="M80 125 C210 145 280 115 410 155 S700 165 930 80"
            fill="none"
            stroke="#d6c9aa"
            strokeWidth="9"
            opacity=".75"
          />
          <path d="M150 30 C170 105 220 160 250 240" fill="none" stroke="#9fd0d7" strokeWidth="8" />
          <path d="M510 20 C520 85 555 140 590 220" fill="none" stroke="#9fd0d7" strokeWidth="7" />
          <path d="M760 15 C745 90 770 145 815 185" fill="none" stroke="#9fd0d7" strokeWidth="7" />

          <text x="470" y="335" fill="#397c87" fontSize="25" fontWeight="700" opacity=".72">
            深圳湾
          </text>
          <text x="760" y="70" fill="#4c7054" fontSize="15" fontWeight="600">
            深圳 · 福田
          </text>
          <text x="115" y="540" fill="#607955" fontSize="14" fontWeight="600">
            香港 · 米埔湿地
          </text>

          {routeLocations.length > 1 && (
            <polyline
              points={routeLocations
                .map((location) => {
                  const point = project(location.longitude, location.latitude);
                  return `${point.x},${point.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#FF6B4A"
              strokeWidth={5 / zoom}
              strokeDasharray={`${10 / zoom} ${8 / zoom}`}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".85"
            />
          )}

          {visibleLocations.map((location) => {
            const point = project(location.longitude, location.latitude);
            const annual = getAnnual(location, year);
            const isSelected = selectedId === location.id || currentRouteId === location.id;
            const onRoute = routeIds.includes(location.id);
            const color =
              location.type === "outfall" && annual.waterFlow !== "有水"
                ? "#C7803F"
                : COLORS[location.type];
            const radius = (isSelected ? 11 : 7) / Math.sqrt(zoom);
            return (
              <g
                key={location.id}
                role="button"
                tabIndex={0}
                aria-label={location.name}
                className="cursor-pointer outline-none"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onSelect(location.id)}
                onKeyDown={(event) => handleKey(event, location.id)}
              >
                <title>{markerLabel(location, year)}</title>
                {(isSelected || onRoute) && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={radius + 6 / Math.sqrt(zoom)}
                    fill="none"
                    stroke={isSelected ? "#0B8F91" : "#FF6B4A"}
                    strokeWidth={3 / zoom}
                    opacity=".55"
                  />
                )}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={radius}
                  fill={color}
                  stroke="white"
                  strokeWidth={2.5 / zoom}
                  className="drop-shadow"
                />
              </g>
            );
          })}

          {selected &&
            (() => {
              const point = project(selected.longitude, selected.latitude);
              const label = markerLabel(selected, year);
              const labelWidth = Math.min(340, Math.max(190, label.length * 11));
              const labelX = Math.min(
                WIDTH - labelWidth - 12,
                Math.max(12, point.x - labelWidth / 2),
              );
              const labelY = Math.max(48, point.y - 34);
              return (
                <g className="pointer-events-none" aria-label={label}>
                  <rect
                    x={labelX}
                    y={labelY - 28}
                    width={labelWidth}
                    height={28}
                    rx={6}
                    fill="rgba(255,255,255,.96)"
                    stroke="rgba(11,143,145,.45)"
                    strokeWidth={1.5 / zoom}
                  />
                  <text
                    x={labelX + labelWidth / 2}
                    y={labelY - 10}
                    textAnchor="middle"
                    fill="#082f3a"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {label}
                  </text>
                </g>
              );
            })()}
        </g>
      </svg>

      <div className="absolute bottom-12 right-2 z-400 flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <button
          type="button"
          className="grid size-9 place-items-center border-b border-border text-lg font-semibold hover:bg-paleeco"
          aria-label="放大地图"
          onClick={() => changeZoom(zoom + 0.35)}
        >
          +
        </button>
        <button
          type="button"
          className="grid size-9 place-items-center text-lg font-semibold hover:bg-paleeco"
          aria-label="缩小地图"
          onClick={() => changeZoom(zoom - 0.35)}
        >
          −
        </button>
      </div>
    </div>
  );
}
