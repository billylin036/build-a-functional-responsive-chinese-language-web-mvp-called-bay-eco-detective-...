import { locations } from "./locations";

export interface SamplingQuestRegion {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  sampleIds: string[];
  badgeThreshold: number;
}

export interface SamplingStoryBeat {
  index: number;
  total: number;
  actNumber: number;
  actTitle: string;
  actGoal: string;
  title: string;
  narrative: string;
  learningGoal: string;
  transition: string;
  previousId?: string;
  nextId?: string;
}

export interface SamplingPointProfile {
  region: SamplingQuestRegion;
  missionCode: string;
  role: string;
  roleLesson: string;
  indicatorLesson: string;
  mission: string;
}

function sampleIds(from: number, to: number) {
  return Array.from(
    { length: to - from + 1 },
    (_, index) => `ws-${String(from + index).padStart(2, "0")}`,
  );
}

export const samplingQuestRegions: SamplingQuestRegion[] = [
  {
    id: "north-river-expedition",
    chapterNumber: 1,
    title: "北江源流远征",
    subtitle: "从源头、水库到交汇口",
    description:
      "沿北江流域的 10 个报告点位移动，比较源头、水库、支流交汇与供水地标所代表的不同调查情境。",
    badge: "北江源流侦察员",
    sampleIds: sampleIds(1, 10),
    badgeThreshold: 3,
  },
  {
    id: "east-river-expedition",
    chapterNumber: 2,
    title: "东江交汇追踪",
    subtitle: "在支流与交汇口寻找证据",
    description:
      "探索东江流域 6 个点位，学习为什么交汇口、上下游和跨界河段需要成组布点，而不能只看一次结果。",
    badge: "东江汇流分析员",
    sampleIds: sampleIds(11, 16),
    badgeThreshold: 3,
  },
  {
    id: "west-river-expedition",
    chapterNumber: 3,
    title: "西江城市水网任务",
    subtitle: "从大河支流进入城市河道",
    description:
      "穿越西江流域及深圳城市河道的 12 个点位，练习比较不同河段时控制时间、天气、水位与检测方法。",
    badge: "城市水网记录员",
    sampleIds: sampleIds(17, 28),
    badgeThreshold: 3,
  },
  {
    id: "estuary-expedition",
    chapterNumber: 4,
    title: "河海口潮汐终章",
    subtitle: "在河流与海洋相遇处完成终极调查",
    description:
      "探索 10 个河口、湿地与下游点位，理解潮位、盐淡水混合和采样时刻为什么会影响点位之间的比较。",
    badge: "河海口探索家",
    sampleIds: sampleIds(29, 38),
    badgeThreshold: 3,
  },
];

export const SAMPLING_QUEST_IDS = samplingQuestRegions.flatMap((region) => region.sampleIds);

const ACT_GOALS = [
  "先建立证据底线：读懂原始表值，区分现场记录、解释与结论。",
  "追踪空间变化：用上游、支流、交汇后点位组成可比较的调查设计。",
  "进入城市水网：识别降雨、时间、流量与人为活动等混杂因素。",
  "抵达河海口：把潮位、盐淡水混合和重复采样纳入最终调查方案。",
] as const;

const LEARNING_GOALS = [
  "只描述表格真正记录的内容，不把一次快速检测写成完整水质等级。",
  "比较点位前，先确认单位、方法、时间和环境条件是否一致。",
  "把观察到的差异当作线索，并提出还需要收集什么证据。",
  "设计一个包含重复时间、参考点和现场条件的可复核方案。",
] as const;

/**
 * 38 个点位按报告序号组成一条“证据探索线”。它是学习顺序，不声称这些
 * 跨流域点位在自然水系中首尾相接。
 */
export function getSamplingStoryBeat(locationId: string): SamplingStoryBeat | null {
  const index = SAMPLING_QUEST_IDS.indexOf(locationId);
  const location = locations.find((item) => item.id === locationId);
  const region = getSamplingQuestRegion(locationId);
  if (index < 0 || !location || !region) return null;

  const previousId = index > 0 ? SAMPLING_QUEST_IDS[index - 1] : undefined;
  const nextId = index < SAMPLING_QUEST_IDS.length - 1 ? SAMPLING_QUEST_IDS[index + 1] : undefined;
  const previous = previousId ? locations.find((item) => item.id === previousId) : undefined;
  const next = nextId ? locations.find((item) => item.id === nextId) : undefined;
  const isActOpening = region.sampleIds[0] === locationId;

  return {
    index: index + 1,
    total: SAMPLING_QUEST_IDS.length,
    actNumber: region.chapterNumber,
    actTitle: region.title,
    actGoal: ACT_GOALS[region.chapterNumber - 1]!,
    title: isActOpening
      ? `第 ${region.chapterNumber} 幕开启：${region.subtitle}`
      : `证据站 ${index + 1}：${location.name}`,
    narrative:
      index === 0
        ? `你加入珠江流域学生调查队，从 ${location.name} 开始建立第一份证据记录。此后每一站都会在上一站的方法上增加一个新的调查难题。`
        : isActOpening
          ? `完成“${previous?.name ?? "上一站"}”后，调查进入第 ${region.chapterNumber} 幕。来到 ${location.name}，你需要把前一幕学到的证据规则带进新的水文情境。`
          : `带着“${previous?.name ?? "上一站"}”留下的线索，调查队来到 ${location.name}。不要急着比较高低，先判断两站的采样条件是否真的可比。`,
    learningGoal: LEARNING_GOALS[index % LEARNING_GOALS.length]!,
    transition: next
      ? `完成本站挑战后，前往 ${next.name}，检验同一条证据规则在新地点是否仍然成立。`
      : "这是第 38 站。请把沿途学到的证据规则整理成一份可复核的流域调查方案。",
    ...(previousId ? { previousId } : {}),
    ...(nextId ? { nextId } : {}),
  };
}

export function getSamplingQuestRegion(locationId: string) {
  return samplingQuestRegions.find((region) => region.sampleIds.includes(locationId));
}

function getHydrologicalRole(name: string) {
  if (/水库|源/.test(name)) {
    return {
      role: "源头与蓄水节点",
      lesson:
        "源头或水库点适合思考上游背景与汇水范围，但一次快速检测仍不能代表整个水库、整个源区或长期状态。",
    };
  }
  if (/交汇|交界/.test(name)) {
    return {
      role: "河流交汇节点",
      lesson:
        "交汇口会混合不同来水。若要判断哪一支流带来变化，应同时设置交汇前两侧点位与交汇后的下游点位。",
    };
  }
  if (/水厂|取水口/.test(name)) {
    return {
      role: "供水相关地标",
      lesson:
        "供水相关地标能帮助讨论原水保护，但报告中的现场快速检测不能替代饮用水安全检测或供水单位的正式结论。",
    };
  }
  if (/河口|下游|渡口|水道/.test(name)) {
    return {
      role: "下游与河海口",
      lesson:
        "下游和河口可能受潮位、径流与盐淡水混合共同影响。跨点比较时应记录采样时刻、水位和天气条件。",
    };
  }
  if (/湿地|红树林/.test(name)) {
    return {
      role: "湿地缓冲带",
      lesson:
        "湿地连接水体、沉积物与生物栖息地。水化学只是其中一类证据，还应结合水文、生境和生物记录。",
    };
  }
  if (/上游/.test(name)) {
    return {
      role: "上游参照河段",
      lesson:
        "上游点可为下游比较提供参照，但前提是采样时间、方法和环境条件具有可比性，并记录支流或排放源的位置。",
    };
  }
  if (/支流|河|江|水/.test(name)) {
    return {
      role: "河流调查断面",
      lesson:
        "河流断面会随降雨、流量和时间变化。可靠调查需要重复采样，并把原始表值与原因解释分开记录。",
    };
  }
  return {
    role: "流域观察节点",
    lesson:
      "这个点位是流域证据链的一部分。单点结果适合提出问题，跨点、重复且方法一致的数据才更适合支持比较。",
  };
}

export function getSamplingPointProfile(locationId: string): SamplingPointProfile | null {
  const location = locations.find((item) => item.id === locationId);
  const sample = location?.waterSample;
  const region = getSamplingQuestRegion(locationId);
  if (!location || !sample || !region) return null;

  const role = getHydrologicalRole(location.name);
  const indicatorLessons = [
    `本点 pH 记录为 ${sample.pH}。pH 描述酸碱条件，不能单独代表营养盐、有机物或完整水质等级。`,
    `本点 TP 记录为 ${sample.totalPhosphorus}。总磷是营养盐线索；比较前必须确认单位、方法和采样条件一致。`,
    `本点 COD 记录为 ${sample.cod}。COD 提供可氧化物质线索，但快速检测范围不能直接改写成污染来源结论。`,
    `本点 NH₃-N 记录为 ${sample.ammoniaNitrogen}。氨氮是含氮物质线索，解释时还要考虑时间、水温与水文条件。`,
  ];
  const missions = [
    "读取四项原始表值，写出一句只描述证据、不越界判级的侦探结论。",
    "与同一流域另一点比较四项记录，找出一个相同点、一个不同点和一项仍缺失的信息。",
    "设计一个可复核方案：至少包含重复时间、参考点以及需要记录的天气或水位条件。",
    "找出最容易被过度解释的一项表值，并说明还需要什么证据才能继续判断。",
  ];

  return {
    region,
    missionCode: `SIDE QUEST ${String(sample.sampleNumber).padStart(2, "0")}`,
    role: role.role,
    roleLesson: role.lesson,
    indicatorLesson: indicatorLessons[(sample.sampleNumber - 1) % indicatorLessons.length]!,
    mission: missions[(sample.sampleNumber - 1) % missions.length]!,
  };
}
