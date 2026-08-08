import { useCallback, useState } from "react";
import AmapCanvas from "@/components/map/AmapCanvas";
import LeafletMapCanvas from "@/components/map/MapCanvas";
import StableMapCanvas from "@/components/map/StableMapCanvas";
import type { MapCanvasProps } from "@/components/map/MapCanvas";

const env = import.meta.env as Record<string, string | undefined>;

export default function LiveMapCanvas(props: MapCanvasProps) {
  const [amapFailed, setAmapFailed] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const apiKey = env["VITE_AMAP_KEY"]?.trim();
  const securityCode = env["VITE_AMAP_SECURITY_CODE"]?.trim();
  const serviceHost = env["VITE_AMAP_SERVICE_HOST"]?.trim();
  const useAMap = Boolean(apiKey) && !amapFailed;
  const handleLoadError = useCallback(() => setAmapFailed(true), []);
  const handleTilesReady = useCallback(() => setLeafletReady(true), []);

  return (
    <div className="relative h-full w-full">
      {useAMap ? (
        <AmapCanvas
          {...props}
          apiKey={apiKey!}
          securityCode={securityCode}
          serviceHost={serviceHost}
          onLoadError={handleLoadError}
        />
      ) : (
        <>
          <div className="absolute inset-0" aria-hidden={leafletReady} inert={leafletReady}>
            <StableMapCanvas {...props} />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              leafletReady ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!leafletReady}
          >
            <LeafletMapCanvas {...props} onTilesReady={handleTilesReady} />
          </div>
        </>
      )}
      <div className="pointer-events-none absolute bottom-2 left-2 z-400 rounded bg-card/90 px-2 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
        {useAMap
          ? "高德地图实时底图"
          : leafletReady
            ? "OpenStreetMap 实时底图 · 内置地图自动备援"
            : "正在连接实时底图 · 内置地图保持可用"}
      </div>
    </div>
  );
}
