import { useCallback, useState } from "react";
import AmapCanvas from "@/components/map/AmapCanvas";
import LeafletMapCanvas from "@/components/map/MapCanvas";
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
        <LeafletMapCanvas {...props} onTilesReady={handleTilesReady} />
      )}
      <div className="pointer-events-none absolute bottom-2 left-2 z-400 rounded bg-card/90 px-2 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
        {useAMap
          ? "高德在线地图"
          : leafletReady
            ? "OpenStreetMap 在线地图"
            : "正在连接 OpenStreetMap 在线地图"}
      </div>
    </div>
  );
}
