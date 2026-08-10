import { useCallback, useEffect, useState } from "react";
import AmapCanvas from "@/components/map/AmapCanvas";
import LeafletMapCanvas from "@/components/map/MapCanvas";
import type { MapCanvasProps } from "@/components/map/MapCanvas";
import { MAP_LIMIT_RADIUS_KM } from "@/data/locations";

const env = import.meta.env as Record<string, string | undefined>;

export default function LiveMapCanvas(props: MapCanvasProps) {
  const [amapFailed, setAmapFailed] = useState(false);
  const [leafletProvider, setLeafletProvider] = useState<string | null>(null);
  const apiKey = env["VITE_AMAP_KEY"]?.trim();
  const securityCode = env["VITE_AMAP_SECURITY_CODE"]?.trim();
  const serviceHost = env["VITE_AMAP_SERVICE_HOST"]?.trim();
  // AMap is excellent for mainland access but its cartographic labels are Chinese.
  // English mode therefore always uses the separate English-labelled WGS84 provider chain.
  const useAMap = props.language === "zh" && Boolean(apiKey) && !amapFailed;
  const handleLoadError = useCallback(() => setAmapFailed(true), []);
  const handleTilesReady = useCallback((providerName: string) => {
    setLeafletProvider(providerName);
  }, []);

  useEffect(() => {
    setLeafletProvider(null);
  }, [props.language]);

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
        <LeafletMapCanvas
          key={`leaflet-${props.language}`}
          {...props}
          onTilesReady={handleTilesReady}
        />
      )}
      <div className="pointer-events-none absolute bottom-2 left-2 z-400 rounded bg-card/90 px-2 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
        {props.language === "zh"
          ? useAMap
            ? "高德地图 JS API"
            : (leafletProvider ?? "正在连接国内地图")
          : (leafletProvider ?? "Connecting to the English map")}
        {props.language === "zh"
          ? ` · 活动范围约 ${MAP_LIMIT_RADIUS_KM} 公里`
          : ` · Study area about ${MAP_LIMIT_RADIUS_KM} km`}
      </div>
    </div>
  );
}
