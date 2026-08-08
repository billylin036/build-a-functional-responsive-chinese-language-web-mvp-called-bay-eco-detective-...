import type { EcoTask } from "./types";

export const tasks: EcoTask[] = [
  {
    id: "task-mangrove-photo",
    title: "定点拍摄红树林长势",
    locationId: "mg-01",
    category: "红树林",
    difficulty: "入门",
    duration: "约 20 分钟",
    description: "在同一位置、同一角度定期拍照，形成可比对的长势记录。",
    instructions: [
      "站在观景平台标记点，镜头对准滩涂中部林带",
      "横幅拍摄一张全景 + 一张幼苗特写",
      "记录当天日期、天气与潮位（涨潮/退潮）",
      "上传时选择对应地点，便于与往年照片比对",
    ],
    safetyNotes: "请勿进入滩涂软泥区，全程在步道与观景平台内活动。",
    badge: "红树林守护者",
  },
  {
    id: "task-water-color",
    title: "记录排口水色与气味",
    locationId: "of-01",
    category: "水环境",
    difficulty: "入门",
    duration: "约 15 分钟",
    description: "用统一标准描述排口出水的颜色、浊度与是否有异味。",
    instructions: [
      "在安全距离外拍摄排口全景照片",
      "对照水色卡选择最接近的颜色（清澈/浅绿/灰黄/深黑）",
      "记录是否有明显异味、泡沫或油膜",
      "注明当天是否降雨",
    ],
    safetyNotes: "不要下到护岸以下，不要接触排口水体。",
    badge: "水环境侦探",
  },
  {
    id: "task-bird",
    title: "观察并记录滩涂鸟类",
    locationId: "tp-01",
    category: "生物多样性",
    difficulty: "进阶",
    duration: "约 45 分钟",
    description: "在退潮时段记录你看到的鸟类种类与大致数量。",
    instructions: [
      "选择退潮前后 1 小时到达观鸟点",
      "用望远镜观察，记录种类、数量与行为（觅食/休息/飞行）",
      "尽量拍摄可辨识的照片，不追逐、不惊飞",
    ],
    safetyNotes: "保持 30 米以上距离，禁止使用闪光灯与播放鸟鸣。",
    badge: "湾区观察员",
  },
  {
    id: "task-waste",
    title: "岸线垃圾类型记录",
    locationId: "tp-02",
    category: "岸线",
    difficulty: "入门",
    duration: "约 40 分钟",
    description: "记录一段 50 米岸线上的垃圾类型与数量分布。",
    instructions: [
      "选取 50 米岸线，从一端走到另一端",
      "按塑料瓶、泡沫、渔具、生活垃圾分类计数",
      "重点拍摄缠绕在红树幼苗上的垃圾",
    ],
    safetyNotes: "潮汐上涨时立即撤离，不要独自进入滩涂。",
    badge: "湾区观察员",
  },
  {
    id: "task-outfall",
    title: "上报异常排水",
    locationId: "of-04",
    category: "水环境",
    difficulty: "挑战",
    duration: "约 20 分钟",
    description: "发现异常颜色、异味或非降雨时段大量排水时进行记录上报。",
    instructions: [
      "拍摄排口照片与周边环境照片各一张",
      "记录时间、是否降雨、水色与气味",
      "在描述中写明异常现象，提交后由机构复核",
    ],
    safetyNotes: "只在公共区域观察记录，不要靠近陡坡与湿滑护岸。",
    badge: "水环境侦探",
  },
  {
    id: "task-quiz",
    title: "地点科普小问答",
    locationId: "mg-05",
    category: "科普",
    difficulty: "入门",
    duration: "约 5 分钟",
    description: "在地点故事面板中回答一道与现场证据相关的问题。",
    instructions: ["阅读该地点的故事面板", "回答问题并查看解析"],
    safetyNotes: "无特殊风险。",
    badge: "湾区观察员",
  },
];

export const getTask = (id: string) => tasks.find((t) => t.id === id);

export const BADGES = [
  {
    id: "湾区观察员",
    desc: "完成任意 1 项公众观察任务",
    rule: (completed: string[]) => completed.length >= 1,
  },
  {
    id: "水环境侦探",
    desc: "完成 1 项水环境相关任务或路线水质站点",
    rule: (completed: string[]) =>
      completed.some((id) => ["task-water-color", "task-outfall"].includes(id)),
  },
  {
    id: "红树林守护者",
    desc: "完成红树林拍摄任务并走完侦探路线",
    rule: (completed: string[], routeDone: boolean) =>
      completed.includes("task-mangrove-photo") && routeDone,
  },
] as const;
