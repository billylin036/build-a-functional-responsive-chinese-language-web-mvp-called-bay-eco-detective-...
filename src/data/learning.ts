import { locations } from "./locations";
import type { EcoLocation, LocationType } from "./types";

export interface LearningQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface FinalQuestion extends LearningQuiz {
  id: string;
}

export const TOTAL_LEARNING_POINTS = locations.length;
export const FINAL_PASS_SCORE = 4;

const typeOrder: Record<LocationType, number> = {
  mangrove: 0,
  outfall: 1,
  learning: 2,
};

export const learningChapters = [
  {
    id: "mangrove",
    title: "第一章 · 红树林修复",
    description: "比较修复年份、面积、成活率与风险因素。",
    locations: locations.filter((location) => location.type === "mangrove"),
  },
  {
    id: "outfall",
    title: "第二章 · 入湾排口与数据判断",
    description: "认识公开坐标，并学习区分位置事实与水质结论。",
    locations: locations.filter((location) => location.type === "outfall"),
  },
  {
    id: "learning",
    title: "第三章 · 生物多样性与岸线环境",
    description: "理解鸟类、潮汐、垃圾与湿地健康之间的联系。",
    locations: locations.filter((location) => location.type === "learning"),
  },
] as const;

function hash(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function makeOptions(correct: string, candidates: string[], seed: string) {
  const unique = [correct, ...candidates.filter((candidate) => candidate !== correct)].filter(
    (value, index, values) => values.indexOf(value) === index,
  );
  const options = unique.slice(0, 4);
  const answerIndex = hash(seed) % options.length;
  const [answer] = options.splice(0, 1);
  options.splice(answerIndex, 0, answer!);
  return { options, answerIndex };
}

function indicator(location: EcoLocation, label: string) {
  return location.indicators?.find((item) => item.label === label)?.value;
}

export function getLocationQuiz(location: EcoLocation): LearningQuiz {
  if (location.type === "mangrove") {
    const correct = `${location.restorationYear} 年`;
    const candidates = locations
      .filter((item) => item.type === "mangrove" && item.restorationYear)
      .sort((a, b) => typeOrder[a.type] - typeOrder[b.type])
      .map((item) => `${item.restorationYear} 年`);
    const { options, answerIndex } = makeOptions(correct, candidates, location.id);
    return {
      question: `根据地点资料，${location.name}从哪一年开始修复？`,
      options,
      answerIndex,
      explanation: `地点资料记录的修复起始时间是 ${correct}。比较不同修复年份，有助于理解维护年限与当前状态之间的关系。`,
    };
  }

  if (location.type === "outfall") {
    const correct =
      indicator(location, "调查编号") ?? location.name.split(" ").at(-1) ?? location.id;
    const candidates = locations
      .filter((item) => item.type === "outfall")
      .map((item) => indicator(item, "调查编号") ?? item.id.toUpperCase());
    const { options, answerIndex } = makeOptions(correct, candidates, location.id);
    return {
      question: `${location.name}在公开调查中的编号是什么？`,
      options,
      answerIndex,
      explanation: `公开调查编号为 ${correct}。当前可以确认的是排口编号与 GPS 坐标；水质原始指标仍待数据负责人补充。`,
    };
  }

  const isBirdPoint = location.id === "tp-01";
  const correct = isBirdPoint
    ? (indicator(location, "最佳时段") ?? "退潮前后 1 小时")
    : "潮汐会搬运并集中海漂垃圾";
  const candidates = isBirdPoint
    ? ["正午高潮时", "夜间涨潮时", "任何时段都相同"]
    : ["垃圾只来自现场游客", "红树林会主动制造塑料", "垃圾分布与潮汐无关"];
  const { options, answerIndex } = makeOptions(correct, candidates, location.id);
  return {
    question: isBirdPoint
      ? "根据地点资料，观察滩涂鸟类的推荐时段是什么？"
      : "为什么海漂垃圾容易在这段岸线集中？",
    options,
    answerIndex,
    explanation: isBirdPoint
      ? "退潮前后滩涂逐渐裸露，鸟类会集中觅食，因此更容易观察。"
      : "潮汐会搬运海面漂浮物，并在岸线和红树林边缘形成集中沉积。",
  };
}

export const finalQuestions: FinalQuestion[] = [
  {
    id: "evidence",
    question: "看到一个排口的 GPS 坐标后，可以直接得出什么结论？",
    options: [
      "只能确认其公开位置，不能据此判断水质",
      "水质一定达标",
      "排口一定正在排污",
      "生态已经恢复",
    ],
    answerIndex: 0,
    explanation: "位置数据回答“在哪里”，水质结论还需要采样日期、检测指标、方法和标准。",
  },
  {
    id: "mangrove",
    question: "比较红树林修复点时，为什么需要同时看修复年份和成活率？",
    options: [
      "用于判断维护时间与修复结果的关系",
      "年份越早就一定越好",
      "只为了给地点排序",
      "两项数据没有关系",
    ],
    answerIndex: 0,
    explanation: "修复经历的时间、潮位条件和长期管护都会影响当前成活情况。",
  },
  {
    id: "missing-data",
    question: "网站缺少某个地点的原始水质指标时，正确做法是什么？",
    options: ["标注待补充，不自行生成结论", "填入附近地点的平均值", "用0分代替", "根据照片估算"],
    answerIndex: 0,
    explanation: "缺失数据应明确标注，不能用估算值冒充监测结果。",
  },
  {
    id: "birds",
    question: "为什么鸟类可以帮助我们理解湿地健康？",
    options: [
      "它们会响应食物、滩涂和干扰条件的变化",
      "鸟越多水质一定越好",
      "所有鸟类需求完全相同",
      "鸟类可以替代全部监测",
    ],
    answerIndex: 0,
    explanation: "鸟类是生态线索之一，但仍需与水质、植被和其他调查结合判断。",
  },
  {
    id: "map-reading",
    question: "使用这张学习地图时，最可靠的学习顺序是什么？",
    options: [
      "查看来源与字段，再比较变化并作答",
      "只看颜色判断好坏",
      "只记住最高分",
      "跳过说明直接下结论",
    ],
    answerIndex: 0,
    explanation: "先理解数据来源、含义和限制，再比较地点与时间，才能形成有依据的判断。",
  },
];
