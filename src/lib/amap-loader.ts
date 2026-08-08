export interface AMapEventTarget {
  on(eventName: string, handler: () => void): void;
}

export type AMapOverlay = AMapEventTarget;

export interface AMapMap {
  add(overlays: AMapOverlay | AMapOverlay[]): void;
  remove(overlays: AMapOverlay | AMapOverlay[]): void;
  addControl(control: object): void;
  setZoomAndCenter(zoom: number, center: [number, number], immediately?: boolean): void;
  destroy(): void;
}

interface AMapMapOptions {
  center: [number, number];
  zoom: number;
  mapStyle?: string;
  viewMode?: "2D" | "3D";
  resizeEnable?: boolean;
}

interface AMapMarkerOptions {
  position: [number, number];
  content: HTMLElement;
  offset?: AMapPixel;
  title?: string;
  zIndex?: number;
}

interface AMapPolygonOptions {
  path: [number, number][];
  strokeColor: string;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
  bubble?: boolean;
}

interface AMapPolylineOptions {
  path: [number, number][];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
  strokeStyle?: "solid" | "dashed";
  lineJoin?: "round" | "miter" | "bevel";
  zIndex?: number;
}

interface AMapPixel {
  readonly x: number;
  readonly y: number;
}

export interface AMapNamespace {
  plugin(plugins: string[], callback: () => void): void;
  Map: new (container: HTMLElement, options: AMapMapOptions) => AMapMap;
  Marker: new (options: AMapMarkerOptions) => AMapOverlay;
  Polygon: new (options: AMapPolygonOptions) => AMapOverlay;
  Polyline: new (options: AMapPolylineOptions) => AMapOverlay;
  Pixel: new (x: number, y: number) => AMapPixel;
  ToolBar: new (options?: object) => object;
  Scale: new (options?: object) => object;
}

declare global {
  interface Window {
    AMap?: AMapNamespace;
    _AMapSecurityConfig?: {
      securityJsCode?: string;
      serviceHost?: string;
    };
  }
}

let loaderPromise: Promise<AMapNamespace> | null = null;

export function loadAMap(key: string, securityCode?: string, serviceHost?: string) {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<AMapNamespace>((resolve, reject) => {
    if (serviceHost) {
      window._AMapSecurityConfig = { serviceHost };
    } else if (securityCode) {
      window._AMapSecurityConfig = { securityJsCode: securityCode };
    }

    const script = document.createElement("script");
    script.id = "amap-js-api";
    script.async = true;
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        loaderPromise = null;
        reject(new Error("高德地图脚本已加载，但 API 未初始化。"));
      }
    };
    script.onerror = () => {
      loaderPromise = null;
      script.remove();
      reject(new Error("高德地图加载失败。"));
    };
    document.head.appendChild(script);
  });

  return loaderPromise;
}
