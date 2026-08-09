import type { AnnualData, EcoLocation, RiskLevel } from "./types";

export const YEARS = Array.from({ length: 11 }, (_, i) => 2015 + i);

/** 确定性伪随机（避免每次渲染数据抖动） */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function buildAnnual(
  seed: number,
  opts: {
    baseQuality: number;
    endQuality: number;
    baseCoverage: number;
    endCoverage: number;
    baseSurvival: number;
    endSurvival: number;
    dryFrom?: number | undefined;
    events?: Record<number, string | undefined> | undefined;
  },
): AnnualData[] {
  const rnd = seeded(seed);
  return YEARS.map((year, i) => {
    const t = i / (YEARS.length - 1);
    const jitter = (rnd() - 0.5) * 4;
    const flow: AnnualData["waterFlow"] =
      opts.dryFrom && year >= opts.dryFrom ? (year >= opts.dryFrom + 2 ? "干涸" : "微流") : "有水";
    return {
      year,
      waterQuality: Math.round(
        clamp(opts.baseQuality + (opts.endQuality - opts.baseQuality) * t + jitter, 10, 100),
      ),
      waterFlow: flow,
      mangroveCoverage: Math.round(
        clamp(opts.baseCoverage + (opts.endCoverage - opts.baseCoverage) * t + jitter / 2, 0, 100),
      ),
      survivalRate: Math.round(
        clamp(opts.baseSurvival + (opts.endSurvival - opts.baseSurvival) * t + jitter / 2, 0, 100),
      ),
      observationCount: Math.round(4 + i * (3 + rnd() * 4)),
      event: opts.events?.[year],
    };
  });
}

const mangroveSeeds: {
  id: string;
  name: string;
  lng: number;
  lat: number;
  year: number;
  area: number;
  planted: number;
  survival: number;
  condition: string;
  risks: string[];
  risk: RiskLevel;
  summary: string;
  what: string;
  why: string;
}[] = [
  {
    id: "mg-01",
    name: "福田红树林保护区北岸修复地",
    lng: 114.0206,
    lat: 22.5228,
    year: 2015,
    area: 6.8,
    planted: 12400,
    survival: 88,
    condition: "林分郁闭，滩涂底栖生物明显恢复",
    risks: ["外来物种入侵", "台风倒伏"],
    risk: "低",
    summary: "最早一批系统化修复地块，也是目前长势最好的样板区。",
    what: "2015 年种下的秋茄与桐花树已形成连片林带，滩面出现大量招潮蟹洞穴。",
    why: "这里潮位适中、淡水与海水交汇稳定，加上连续 10 年的抚育管护，幼苗度过了最脆弱的前三年。",
  },
  {
    id: "mg-02",
    name: "沙河西滨海修复点",
    lng: 113.9781,
    lat: 22.5115,
    year: 2017,
    area: 3.2,
    planted: 6800,
    survival: 62,
    condition: "边缘带缺株明显，中心区长势尚可",
    risks: ["浪蚀冲刷", "海漂垃圾缠绕"],
    risk: "中",
    summary: "同样的苗木、同样的团队，成活率却比北岸低了一大截。",
    what: "外缘 30 米内的幼苗多次被浪打断，补种两次后才稳定下来。",
    why: "这里缺少天然消浪滩，涨潮时苗木浸泡时间过长，根系来不及固定。",
  },
  {
    id: "mg-03",
    name: "深圳湾公园东段补植区",
    lng: 114.0044,
    lat: 22.5062,
    year: 2018,
    area: 2.1,
    planted: 4300,
    survival: 74,
    condition: "长势中等，游人干扰较多",
    risks: ["人为踩踏", "宠物进入滩涂"],
    risk: "中",
    summary: "紧邻步道的修复地块，人为干扰是它最大的变量。",
    what: "靠步道一侧的幼苗常被踩踏，靠水侧长势明显更好。",
    why: "公园人流量大，缺少物理隔离与清晰的引导标识。",
  },
  {
    id: "mg-04",
    name: "新洲河口试验苗圃",
    lng: 114.0128,
    lat: 22.5178,
    year: 2019,
    area: 1.4,
    planted: 2600,
    survival: 91,
    condition: "苗木健壮，作为其他地块的种源",
    risks: ["淡水径流突增"],
    risk: "低",
    summary: "本地育苗、本地移栽，验证了“乡土苗”策略。",
    what: "使用深圳湾本地母树采种育苗，移栽后适应期显著缩短。",
    why: "乡土苗的耐盐性与本地潮汐节律匹配，移植胁迫更小。",
  },
  {
    id: "mg-05",
    name: "大沙河入海口西滩",
    lng: 113.9702,
    lat: 22.5063,
    year: 2020,
    area: 4.5,
    planted: 9100,
    survival: 57,
    condition: "局部退化，需二次补植",
    risks: ["互花米草竞争", "沉积物变化"],
    risk: "高",
    summary: "互花米草与红树幼苗抢地盘，是这里成活率偏低的主因。",
    what: "种植后第二年，互花米草迅速覆盖滩面，压制了幼苗生长。",
    why: "入侵植物繁殖速度快，若不在种植前彻底清除，红树幼苗几乎没有竞争力。",
  },
  {
    id: "mg-06",
    name: "红树林湿地南堤修复段",
    lng: 114.0281,
    lat: 22.5203,
    year: 2021,
    area: 2.8,
    planted: 5400,
    survival: 79,
    condition: "整体稳定，边缘有缺株",
    risks: ["台风", "潮沟改道"],
    risk: "中",
    summary: "堤岸型修复，靠潮沟位置决定了长势差异。",
    what: "靠近潮沟的植株长势明显优于内侧板结区域。",
    why: "潮沟带来更稳定的水交换与养分输入，内侧滩面板结导致根系缺氧。",
  },
  {
    id: "mg-07",
    name: "华侨城湿地北侧修复点",
    lng: 113.9885,
    lat: 22.5147,
    year: 2022,
    area: 1.9,
    planted: 3700,
    survival: 83,
    condition: "长势良好，鸟类利用率上升",
    risks: ["水位调控依赖人工"],
    risk: "低",
    summary: "封闭式管理湿地，人为干扰少，但依赖人工调水。",
    what: "种植三年后，滩涂鸟类停歇记录明显增加。",
    why: "封闭管理减少了踩踏与垃圾，人工水位调控让幼苗避开长时间淹水。",
  },
  {
    id: "mg-08",
    name: "湾厦河口滩涂修复地",
    lng: 113.9615,
    lat: 22.5024,
    year: 2023,
    area: 2.4,
    planted: 4800,
    survival: 68,
    condition: "幼林期，需持续抚育",
    risks: ["城市面源污染", "海漂垃圾"],
    risk: "中",
    summary: "最新一批修复地，正处在最脆弱的前三年。",
    what: "雨季后常见塑料垃圾缠绕幼苗基部。",
    why: "上游雨水管网携带的面源垃圾在此淤积，缠绕会导致幼苗枯死。",
  },
];

const mangroveLocations: EcoLocation[] = mangroveSeeds.map((m, i) => ({
  id: m.id,
  name: m.name,
  type: "mangrove",
  longitude: m.lng,
  latitude: m.lat,
  summary: m.summary,
  category: "红树林修复地",
  image: "mangrove",
  restorationYear: m.year,
  restorationArea: m.area,
  plantedCount: m.planted,
  survivalRate: m.survival,
  condition: m.condition,
  risks: m.risks,
  riskLevel: m.risk,
  indicators: [
    { label: "修复面积", value: `${m.area} 公顷` },
    { label: "种植株数", value: `${m.planted.toLocaleString("zh-CN")} 株` },
    { label: "当前成活率", value: `${m.survival}%` },
  ],
  annualData: buildAnnual(101 + i * 7, {
    baseQuality: 48 + i,
    endQuality: 78 + (m.survival - 60) / 4,
    baseCoverage: Math.max(4, m.survival - 45),
    endCoverage: Math.min(92, m.survival + 6),
    baseSurvival: Math.max(20, m.survival - 25),
    endSurvival: m.survival,
    events: {
      [m.year]: `${m.name}启动修复种植（示例项目数据）`,
      2018: i % 3 === 0 ? "台风“山竹”过境，部分幼苗倒伏" : undefined,
      2021: i % 2 === 0 ? "开展第一次系统化补植与抚育" : undefined,
      2025: "完成第 10 年长期监测样方复查",
    },
  }),
  story: {
    what: m.what,
    why: m.why,
    matter:
      "红树林是深圳湾的“天然堤坝”和育幼场：它固碳、消浪、净化水质，也为候鸟提供食物。成活率的差异，直接决定了这片滩涂十年后是林还是泥。",
    action:
      "参与定点拍摄记录幼苗长势、不进入滩涂踩踏、发现缠绕垃圾时拍照上报，都能让修复团队更早发现问题。",
  },
}));

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
      { label: "水质原始数据", value: "待数据负责人补充" },
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

const learningLocations: EcoLocation[] = [
  {
    id: "tp-01",
    name: "深圳湾观鸟点（西）",
    type: "learning",
    longitude: 113.9926,
    latitude: 22.5031,
    category: "生物多样性学习点",
    image: "bird",
    summary: "冬季候鸟停歇高峰观察点，适合家庭与学校活动。",
    riskLevel: "低",
    indicators: [{ label: "最佳时段", value: "退潮前后 1 小时" }],
    annualData: YEARS.map((year) => ({ year })),
    story: {
      what: "退潮后滩涂裸露，鹭类、鸻鹬类集中觅食。",
      why: "滩涂底栖生物恢复，为候鸟提供了稳定食物来源。",
      matter: "鸟类是湿地健康最直观的指示物种之一。",
      action: "保持 30 米以上距离、不使用闪光灯、不投喂，记录你看到的种类与数量。",
    },
  },
  {
    id: "tp-02",
    name: "红树林步道岸线观察点",
    type: "learning",
    longitude: 114.0155,
    latitude: 22.5099,
    category: "岸线环境学习点",
    image: "coast",
    summary: "通过岸线垃圾的类型与分布，理解潮汐、城市活动和滨海生态之间的联系。",
    riskLevel: "中",
    indicators: [{ label: "建议时长", value: "40 分钟" }],
    annualData: YEARS.map((year) => ({ year })),
    story: {
      what: "每次大潮后，塑料瓶、泡沫与渔网碎片会缠绕在红树幼苗基部。",
      why: "上游雨水管网与海面漂浮物在潮汐作用下集中沉积于此。",
      matter: "缠绕会导致幼苗窒息死亡，也会被鸟类误食。",
      action: "拍照记录垃圾类型与数量，参与有组织的净滩，不要独自进入软泥滩。",
    },
  },
];

export const locations: EcoLocation[] = [
  ...mangroveLocations,
  ...outfallLocations,
  ...learningLocations,
];

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
