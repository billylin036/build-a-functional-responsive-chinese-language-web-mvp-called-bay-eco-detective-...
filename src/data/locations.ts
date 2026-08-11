import type { EcoLocation } from "./types";
import { WATER_SAMPLES_2023 } from "./water-samples-2023";

export const YEARS = Array.from({ length: 11 }, (_, i) => 2015 + i);

export const OUTFALL_DECADE_COMPARISON = {
  baselineYear: 2015,
  revisitYear: 2025,
  surveyedOutfalls: 30,
  baselineComplianceRate: 53.3,
  revisitComplianceRate: 96.7,
  complianceChangePoints: 43.4,
  dryOutfallRate: 73.3,
  sourceLabel: "数据来源：深圳市绿源环保志愿者协会（截至 2026 年 3 月）",
  publicRevisitSourceUrl: "https://www.szhb.org/about/jishi",
  pointLevelNote:
    "公开纪事确认 2025 年开展了深圳湾排水口十年调查回访；逐排口的 2025 原始观察与检测表尚未提供，因此不能把整体结果写成某一个排口的现状。",
} as const;

export const OUTFALL_SOURCE = {
  title: "《深·水｜共爱深圳计划深圳湾排水口污染现状》",
  publisher: "深圳市绿源环保志愿者协会",
  pagePublished: "2015-06-06",
  reportDate: "2015-04-15",
  url: "https://www.szhb.org/5383.html",
  note: "原文表二和表四公开了 B1–B4、D1、4-1 至 4-6 共 11 个排口的坐标与现场描述。原坐标采用度和十进制分，本站换算为十进制度用于地图定位。",
} as const;

/**
 * 绿源 2015 年深圳湾排水口调查正文中公开了 11 个 GPS 坐标。
 * 原报告采用度和十进制分格式，这里转换为 WGS84 十进制度，直接与 OSM 对齐。
 * 调查共记录 30 个排水口；未公开坐标的点不再用随机位置代替。
 */
const outfallSeeds = [
  {
    code: "B1",
    name: "红树林保护区排口 B1",
    lng: 113.9970167,
    lat: 22.5287,
    observed: "常见少量清澈排水，排口附近有白色沉积，靠近可闻到异味",
  },
  {
    code: "B2",
    name: "红树林保护区排口 B2",
    lng: 114.0037333,
    lat: 22.52915,
    observed: "排口位于人行道下，排水黑臭并有白色泡沫",
  },
  {
    code: "B3",
    name: "红树林保护区排口 B3",
    lng: 114.0170667,
    lat: 22.5266333,
    observed: "排口处有黑色发臭积水，水流较小，外有防洪闸口",
  },
  {
    code: "B4",
    name: "红树林保护区排口 B4",
    lng: 114.0241833,
    lat: 22.5221167,
    observed: "排放浑浊污水，水量较大",
  },
  {
    code: "D1",
    name: "大沙河入海口旁排口 D1",
    lng: 113.95085,
    lat: 22.5227,
    observed: "位于大沙河出海口旁，排水较清、无臭",
  },
  {
    code: "4-1",
    name: "深圳湾北岸排口 4-1",
    lng: 113.9591167,
    lat: 22.5212833,
    observed: "排水较少，水较清、无臭",
  },
  {
    code: "4-2",
    name: "深圳湾北岸排口 4-2",
    lng: 113.96245,
    lat: 22.5220333,
    observed: "常排黑臭及浑浊白色污水，水量较大，周围有黑泥淤积和恶臭",
  },
  {
    code: "4-3",
    name: "深圳湾北岸排口 4-3",
    lng: 113.9699,
    lat: 22.52205,
    observed: "排放灰白浑水，时有刺鼻异味，水表有油污和漂浮物，水量不大",
  },
  {
    code: "4-4",
    name: "深圳湾北岸排口 4-4",
    lng: 113.9786167,
    lat: 22.5216667,
    observed: "排水较清、无臭，水体呈浅绿色",
  },
  {
    code: "4-5",
    name: "深圳湾北岸排口 4-5",
    lng: 113.9893667,
    lat: 22.5237,
    observed: "常排黑臭污水，周围黑泥淤积并散发恶臭",
  },
  {
    code: "4-6",
    name: "深圳湾北岸排口 4-6",
    lng: 113.99465,
    lat: 22.5233833,
    observed: "常排黑臭污水，周围黑泥淤积并散发恶臭",
  },
] as const;

const outfallLocations: EcoLocation[] = outfallSeeds.map((site, i) => {
  return {
    id: `of-${String(i + 1).padStart(2, "0")}`,
    name: site.name,
    type: "outfall",
    longitude: site.lng,
    latitude: site.lat,
    category: "入湾排口",
    image: "outfall",
    summary: `绿源 2015 年调查记录：${site.observed}。这是历史现场描述，不代表当前状态。`,
    riskLevel: "低",
    indicators: [
      { label: "调查编号", value: site.code },
      { label: "公开坐标", value: `${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}` },
      { label: "2015 年现场记录", value: site.observed },
    ],
    annualData: YEARS.map((year) => ({ year })),
    story: {
      what: `公开调查确认了该排口的位置和编号，并记录当时现场现象：${site.observed}。`,
      why: "排口连接城市排水系统与深圳湾水环境。现场颜色、气味和流量是调查线索，但污染物类型和来源仍需规范检测与对照。",
      matter:
        "这份记录来自 2015 年，只能说明调查期观察到什么。判断当前水质需要新的监测日期、采样条件、检测指标和判定标准。",
      action: "引用历史资料时保留年份；复查时记录同一坐标、潮位、天气和方法，再与参考点比较。",
    },
  };
});

const waterSampleLocations: EcoLocation[] = WATER_SAMPLES_2023.map((sample) => ({
  id: `ws-${String(sample.sampleNumber).padStart(2, "0")}`,
  name: sample.name,
  type: "sampling",
  longitude: sample.longitude,
  latitude: sample.latitude,
  category: `${sample.basin} · 2023 快速检测`,
  image: "water-sample",
  summary:
    "绿源 2023 年民间微观察记录的珠江流域现场快速检测点。卡片保留报告中的范围值，不把快速检测结果改写为官方水质等级。",
  riskLevel: "中",
  indicators: [
    { label: "报告序号", value: String(sample.sampleNumber) },
    { label: "所在流域", value: sample.basin },
  ],
  waterSample: {
    sampleNumber: sample.sampleNumber,
    year: 2023,
    basin: sample.basin,
    pH: sample.pH,
    totalPhosphorus: sample.totalPhosphorus,
    cod: sample.cod,
    ammoniaNitrogen: sample.ammoniaNitrogen,
    method: "DNA 取样点现场水质快速检测",
    sourceLabel: "深圳市绿源环保志愿者协会《碧水流深｜2023年度民间微观察》",
    coordinateNote:
      "原报告未刊出经纬度；地图位置按报告地名匹配到对应河段或地标，仅作参考定位，不是原始采样 GPS。",
  },
  annualData: [{ year: 2023 }],
  story: {
    what: `2023 年现场快速检测记录：pH ${sample.pH}，总磷 ${sample.totalPhosphorus}，COD ${sample.cod}，氨氮 ${sample.ammoniaNitrogen}。`,
    why: "pH、总磷、COD 与氨氮从酸碱条件、营养盐和有机污染等不同侧面提供线索；单个指标不能独立代表整个水生态系统。",
    matter:
      "报告给出的是现场快速检测的数值或范围。它适合用于发现问题和设计后续调查，但不能替代规范实验室检测，也不能脱离单位、方法和采样条件直接判定水质等级。",
    action:
      "比较不同点位时先确认指标、单位和检测方法一致；需要判断变化趋势时，还应在相近季节、水位和天气条件下重复采样。",
  },
}));

/** 地图只展示有公开调查或报告表值支撑的地点。 */
export const locations: EcoLocation[] = [...outfallLocations, ...waterSampleLocations];

export const OUTFALL_QUEST_IDS = outfallLocations.map((location) => location.id);

export const getLocation = (id: string) => locations.find((l) => l.id === id);

export const getAnnual = (loc: EcoLocation, year: number) =>
  loc.annualData.find((a) => a.year === year) ?? loc.annualData[loc.annualData.length - 1]!;

/** OpenStreetMap natural=bay geometry for 后海湾 / 深圳湾, simplified to 59 points. */
export const SHENZHEN_BAY_BOUNDARY: [number, number][] = [
  [22.446433, 113.886893],
  [22.405894, 113.901434],
  [22.421341, 113.91496],
  [22.423633, 113.925893],
  [22.419818, 113.927109],
  [22.424069, 113.929542],
  [22.426531, 113.937141],
  [22.4197, 113.938838],
  [22.426963, 113.938204],
  [22.433207, 113.946209],
  [22.439355, 113.947217],
  [22.449915, 113.956766],
  [22.457348, 113.976522],
  [22.468167, 113.980721],
  [22.477319, 113.992727],
  [22.489146, 113.99753],
  [22.487348, 114.014049],
  [22.48192, 114.015137],
  [22.481027, 114.020185],
  [22.484944, 114.024097],
  [22.489472, 114.021081],
  [22.496119, 114.030256],
  [22.50214, 114.022285],
  [22.502442, 114.029106],
  [22.503638, 114.022572],
  [22.506219, 114.028264],
  [22.504126, 114.033085],
  [22.509469, 114.035667],
  [22.50742, 114.030831],
  [22.510364, 114.032596],
  [22.511909, 114.027405],
  [22.519559, 114.021805],
  [22.527904, 114.002552],
  [22.527785, 113.998371],
  [22.52303, 113.994188],
  [22.520588, 113.977044],
  [22.522509, 113.950123],
  [22.491221, 113.947885],
  [22.488117, 113.939126],
  [22.483197, 113.937075],
  [22.484271, 113.93301],
  [22.479867, 113.931257],
  [22.482129, 113.921707],
  [22.485423, 113.924933],
  [22.487433, 113.917297],
  [22.482577, 113.920021],
  [22.481672, 113.911587],
  [22.478153, 113.912769],
  [22.479247, 113.910748],
  [22.475825, 113.909563],
  [22.473349, 113.912762],
  [22.469993, 113.910316],
  [22.475083, 113.903485],
  [22.472921, 113.901202],
  [22.46952, 113.90407],
  [22.465668, 113.89885],
  [22.466476, 113.894145],
  [22.457786, 113.896002],
  [22.446433, 113.886893],
];

export const SHENZHEN_BAY_CENTER: [number, number] = [22.467176, 113.941171];
export const SHENZHEN_BAY_DEFAULT_ZOOM = 12;
export const MAP_LIMIT_RADIUS_KM = 430;
export const MAP_MIN_ZOOM = 7;

/**
 * 地图活动范围：以深圳湾为中心，覆盖 2023 年珠江流域 38 个快速检测点。
 * Leaflet 与高德均使用矩形边界限制拖拽；经度跨度按深圳湾纬度换算。
 */
const latitudeRadius = MAP_LIMIT_RADIUS_KM / 111.32;
const longitudeRadius =
  MAP_LIMIT_RADIUS_KM / (111.32 * Math.cos((SHENZHEN_BAY_CENTER[0] * Math.PI) / 180));

export const MAP_LIMIT_BOUNDS = {
  south: SHENZHEN_BAY_CENTER[0] - latitudeRadius,
  west: SHENZHEN_BAY_CENTER[1] - longitudeRadius,
  north: SHENZHEN_BAY_CENTER[0] + latitudeRadius,
  east: SHENZHEN_BAY_CENTER[1] + longitudeRadius,
} as const;
