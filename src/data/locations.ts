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
  relatedTasks: [i % 2 === 0 ? "task-mangrove-photo" : "task-waste", "task-quiz"],
}));

/**
 * 绿源 2015 年深圳湾排水口调查正文中公开了 11 个 GPS 坐标。
 * 原报告采用度和十进制分格式，这里转换为 WGS84 十进制度，直接与 OSM 对齐。
 * 调查共记录 30 个排水口；未公开坐标的点不再用随机位置代替。
 */
const outfallSeeds = [
  { code: "B1", name: "红树林保护区排口 B1", lng: 113.9970167, lat: 22.5287 },
  { code: "B2", name: "红树林保护区排口 B2", lng: 114.0037333, lat: 22.52915 },
  { code: "B3", name: "红树林保护区排口 B3", lng: 114.0170667, lat: 22.5266333 },
  { code: "B4", name: "红树林保护区排口 B4", lng: 114.0241833, lat: 22.5221167 },
  { code: "D1", name: "大沙河入海口旁排口 D1", lng: 113.95085, lat: 22.5227 },
  { code: "4-1", name: "深圳湾北岸排口 4-1", lng: 113.9591167, lat: 22.5212833 },
  { code: "4-2", name: "深圳湾北岸排口 4-2", lng: 113.96245, lat: 22.5220333 },
  { code: "4-3", name: "深圳湾北岸排口 4-3", lng: 113.9699, lat: 22.52205 },
  { code: "4-4", name: "深圳湾北岸排口 4-4", lng: 113.9786167, lat: 22.5216667 },
  { code: "4-5", name: "深圳湾北岸排口 4-5", lng: 113.9893667, lat: 22.5237 },
  { code: "4-6", name: "深圳湾北岸排口 4-6", lng: 113.99465, lat: 22.5233833 },
] as const;

const outfallLocations: EcoLocation[] = outfallSeeds.map((site, i) => {
  const dry = i % 3 === 0 ? 2021 + (i % 3) : undefined;
  const risk: RiskLevel = i % 7 === 0 ? "高" : i % 3 === 0 ? "中" : "低";
  const end = risk === "高" ? 68 : risk === "中" ? 82 : 93;
  const annual = buildAnnual(500 + i * 11, {
    baseQuality: 34 + (i % 9),
    endQuality: end,
    baseCoverage: 8,
    endCoverage: 20,
    baseSurvival: 0,
    endSurvival: 0,
    dryFrom: dry,
    events: {
      2016: "纳入 30 个入湾排口常态化监测网络（示例项目数据）",
      2019: i % 4 === 0 ? "上游雨污分流改造完成" : undefined,
      2022: dry ? "巡查记录首次出现“无水/微流”状态" : undefined,
      2024: "水质达标率提升至 96.7%（示例项目数据）",
    },
  });
  const last = annual[annual.length - 1]!;
  return {
    id: `of-${String(i + 1).padStart(2, "0")}`,
    name: site.name,
    type: "outfall",
    longitude: site.lng,
    latitude: site.lat,
    category: "入湾排口",
    image: "outfall",
    summary:
      last.waterFlow === "干涸"
        ? "水质指标达标，但巡查时长期无水——这正是需要追问的地方。"
        : "常态化监测排口，近十年水质指标持续改善。",
    riskLevel: risk,
    waterStatus: last.waterFlow,
    indicators: [
      { label: "调查编号", value: site.code },
      { label: "公开坐标", value: `${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}` },
      { label: "最新水质评分", value: `${last.waterQuality} 分` },
      { label: "过水状态", value: last.waterFlow },
      { label: "风险等级", value: risk },
    ],
    annualData: annual,
    story: {
      what:
        last.waterFlow === "干涸"
          ? "2015 年这里还是黑臭水体，如今取样指标达标，但巡查时经常“无水可取”。"
          : "从 2015 年到 2025 年，这个排口的水质评分持续上升，异味与黑臭现象基本消失。",
      why: "雨污分流、截污管网与河道整治让污水不再直排；但截流同时也把原本汇入湾区的径流带走了，部分排口因此长期干涸。",
      matter:
        "示例项目数据显示：水质达标率从 53.3% 提升到 96.7%，然而不少排口被记录为干涸。指标变好，不等于生态水文过程恢复——淡水输入减少会改变滩涂盐度，影响红树林和底栖生物。",
      action:
        "路过时拍一张排口照片、记录当天是否有水与水色，就能帮助长期比对“达标”背后的真实水情。",
    },
    relatedTasks: ["task-water-color", "task-outfall"],
  };
});

const taskLocations: EcoLocation[] = [
  {
    id: "tp-01",
    name: "深圳湾观鸟点（西）",
    type: "task",
    longitude: 113.9926,
    latitude: 22.5031,
    category: "公众观察点",
    image: "bird",
    summary: "冬季候鸟停歇高峰观察点，适合家庭与学校活动。",
    riskLevel: "低",
    indicators: [{ label: "最佳时段", value: "退潮前后 1 小时" }],
    annualData: buildAnnual(77, {
      baseQuality: 55,
      endQuality: 88,
      baseCoverage: 20,
      endCoverage: 40,
      baseSurvival: 0,
      endSurvival: 0,
      events: { 2020: "黑脸琵鹭稳定记录数创新高（示例项目数据）" },
    }),
    story: {
      what: "退潮后滩涂裸露，鹭类、鸻鹬类集中觅食。",
      why: "滩涂底栖生物恢复，为候鸟提供了稳定食物来源。",
      matter: "鸟类是湿地健康最直观的指示物种之一。",
      action: "保持 30 米以上距离、不使用闪光灯、不投喂，记录你看到的种类与数量。",
    },
    relatedTasks: ["task-bird"],
  },
  {
    id: "tp-02",
    name: "红树林步道垃圾巡查段",
    type: "task",
    longitude: 114.0155,
    latitude: 22.5099,
    category: "公众观察点",
    image: "coast",
    summary: "潮汐带来的海漂垃圾在此堆积，适合开展岸线记录任务。",
    riskLevel: "中",
    indicators: [{ label: "建议时长", value: "40 分钟" }],
    annualData: buildAnnual(78, {
      baseQuality: 50,
      endQuality: 80,
      baseCoverage: 15,
      endCoverage: 28,
      baseSurvival: 0,
      endSurvival: 0,
      events: { 2023: "累计开展 120 场公众净滩与记录活动（示例项目数据）" },
    }),
    story: {
      what: "每次大潮后，塑料瓶、泡沫与渔网碎片会缠绕在红树幼苗基部。",
      why: "上游雨水管网与海面漂浮物在潮汐作用下集中沉积于此。",
      matter: "缠绕会导致幼苗窒息死亡，也会被鸟类误食。",
      action: "拍照记录垃圾类型与数量，参与有组织的净滩，不要独自进入软泥滩。",
    },
    relatedTasks: ["task-waste"],
  },
];

export const locations: EcoLocation[] = [
  ...mangroveLocations,
  ...outfallLocations,
  ...taskLocations,
];

export const getLocation = (id: string) => locations.find((l) => l.id === id);

export const getAnnual = (loc: EcoLocation, year: number) =>
  loc.annualData.find((a) => a.year === year) ?? loc.annualData[loc.annualData.length - 1]!;

export const SHENZHEN_BAY_CENTER: [number, number] = [22.512, 113.995];
