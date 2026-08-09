import { locations } from "./locations";

export interface LearningSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  useFor: string;
  kind?: "绿源官方资料" | "政府与专业资料";
  publishedAt?: string;
}

export interface LearningQuiz {
  skill: string;
  difficulty: "基础" | "进阶" | "挑战" | "综合";
  question: string;
  options: string[];
  answerIndex: number;
  hint: string;
  explanation: string;
}

export interface ObservationField {
  id: string;
  label: string;
  kind: "choice" | "number" | "text";
  options?: string[];
  placeholder?: string;
  unit?: string;
}

export interface ObservationActivity {
  title: string;
  mode: "现场" | "室内 / 现场";
  duration: string;
  objective: string;
  steps: string[];
  fields: ObservationField[];
  safety: string;
}

export interface LearningModule {
  objective: string;
  knowledge: {
    title: string;
    fact: string;
    think: string;
    sourceIds: string[];
  };
  quiz: LearningQuiz;
  activity: ObservationActivity;
}

export interface FinalQuestion extends LearningQuiz {
  id: string;
}

export interface ChapterQuizQuestion extends LearningQuiz {
  id: string;
  sourceIds: string[];
}

export interface CourseChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  sourceIds: string[];
  goals: string[];
  facts: { title: string; text: string }[];
  fieldTask: {
    title: string;
    prompt: string;
    steps: string[];
  };
  quiz: ChapterQuizQuestion[];
}

export const TOTAL_LEARNING_POINTS = locations.length;
export const FINAL_PASS_SCORE = 6;

export const learningSources: LearningSource[] = [
  {
    id: "forestry-ecosystem",
    title: "红树林生态系统有多重要？",
    publisher: "国家林业和草原局",
    url: "https://www.forestry.gov.cn/c/www/sd/556199.jhtml",
    useFor: "红树林生态功能、潮汐联系与生物多样性",
    kind: "政府与专业资料",
  },
  {
    id: "mangrove-manual",
    title: "《红树林生态修复手册》解读",
    publisher: "国家林业和草原局",
    url: "https://www.forestry.gov.cn/c/www/gkzcjd/43663.jhtml",
    useFor: "修复原则、退化诊断、跟踪监测与适应性管理",
    kind: "政府与专业资料",
  },
  {
    id: "mee-monitoring",
    title: "地表水环境质量监测技术规范 HJ 91.2—2022",
    publisher: "中华人民共和国生态环境部",
    url: "https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202205/t20220506_977066.shtml",
    useFor: "监测布点、采样、原始记录与质量控制",
    kind: "政府与专业资料",
  },
  {
    id: "mee-indicators",
    title: "国家地表水“9+X”监测与“5+X”评价说明",
    publisher: "中华人民共和国生态环境部",
    url: "https://www.mee.gov.cn/xxgk2018/xxgk/xxgk15/202012/t20201228_815116.html",
    useFor: "水温、pH、浊度、溶解氧、氨氮等指标的含义与限制",
    kind: "政府与专业资料",
  },
  {
    id: "noaa-debris",
    title: "Marine Debris Monitoring Toolkit for Educators",
    publisher: "NOAA Marine Debris Program",
    url: "https://marinedebris.noaa.gov/curricula/marine-debris-monitoring-toolkit-educators",
    useFor: "面向学生的标准化岸线垃圾调查、分类、记录与分析",
    kind: "政府与专业资料",
  },
  {
    id: "wetland-birds",
    title: "Hong Kong Wetland Park School Education Programme",
    publisher: "香港湿地公园",
    url: "https://www.wetlandpark.gov.hk/filemanager/files/public/education/Outline_SB_ENG_2020.pdf",
    useFor: "鸟类生态调查、栖息地比较与户外学习",
    kind: "政府与专业资料",
  },
  {
    id: "inat-quality",
    title: "iNaturalist 教育者指南与观察数据质量说明",
    publisher: "iNaturalist",
    url: "https://help.inaturalist.org/en/support/solutions/articles/151000170805-inaturalist-educator-s-guide",
    useFor: "日期、位置、影像证据、隐私与生物观察质量",
    kind: "政府与专业资料",
  },
  {
    id: "outfall-source",
    title: "深圳湾排水口调查公开资料",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/5383.html",
    useFor: "深圳湾地理、2015 年排水口调查方法、历史现场描述与 11 个公开 GPS 坐标",
    kind: "绿源官方资料",
    publishedAt: "2015-06-06",
  },
  {
    id: "sengo-wetland",
    title: "滨海湿地生态保护",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/project/wetland",
    useFor: "绿源红树林巡护、生态修复、公众参与与累计项目成果",
    kind: "绿源官方资料",
  },
  {
    id: "sengo-water",
    title: "碧水流深",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/project/water",
    useFor: "流域监督员、实地调研、科学数据与环境信息公开",
    kind: "绿源官方资料",
  },
  {
    id: "sengo-2023-observation",
    title: "碧水流深｜2023年度民间微观察",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://mp.weixin.qq.com/s/6e_1tieqb8zGIk2zBL4Hhg",
    useFor: "2023 年民间河长行动规模、巡护问题分类、珠江流域 38 个点位快速检测与生物多样性调查",
    kind: "绿源官方资料",
    publishedAt: "2024-01-24",
  },
  {
    id: "sengo-patrol-2025-01",
    title: "红树林巡护员：播撒文明生态种子，守护湿地水天一色",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/22402.html",
    useFor: "2025 年首场专业培训、巡护队发展与实践活动",
    kind: "绿源官方资料",
    publishedAt: "2025-08-18",
  },
  {
    id: "sengo-patrol-2025-04",
    title: "红树林巡护员 202504 期培训回顾",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/22514.html",
    useFor: "西湾红树林物种辨认、外来物种防治、候鸟与海岸垃圾治理",
    kind: "绿源官方资料",
    publishedAt: "2025-10-29",
  },
  {
    id: "sengo-patrol-2025-05",
    title: "红树林巡护队 202505 期培训回顾",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/22528.html",
    useFor: "福田红树林实地巡护与从理论走向实践的培训路径",
    kind: "绿源官方资料",
    publishedAt: "2025-11-15",
  },
  {
    id: "sengo-2024-q3",
    title: "绿源环协 2024 年第三季度工作简报",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/21883.html",
    useFor: "守护白沙湾活动场次、志愿者与公众参与记录",
    kind: "绿源官方资料",
    publishedAt: "2024",
  },
];

export const learningChapters: CourseChapter[] = [
  {
    id: "bay-evidence",
    number: 1,
    title: "第一章 · 认识深圳湾",
    subtitle: "先建立地理尺度，再判断证据能说明什么",
    description: "从绿源 2015 年公开调查出发，认识半封闭感潮海湾、流域与排水口之间的关系。",
    duration: "约 12 分钟",
    sourceIds: ["outfall-source"],
    goals: ["读懂深圳湾的空间尺度", "区分坐标、观察与检测结论", "识别历史资料的时间边界"],
    facts: [
      {
        title: "半封闭、浅水、受潮汐影响",
        text: "绿源公开资料记载，深圳湾长约 14 千米、面积约 80 平方千米、平均水深约 3 米；内湾退潮时会露出大面积潮间带泥滩。",
      },
      {
        title: "海湾问题要放回流域理解",
        text: "资料记载深圳湾流域面积约 607 平方千米，深圳河、元朗河、大沙河、凤塘河和新洲河等直接入湾。陆地活动可沿河流和排水系统影响海湾。",
      },
      {
        title: "2015 年调查是一份历史快照",
        text: "项目组沿约 15 千米滨海休闲带开展实地调查，共发现 30 个排洪口，其中至少 6 个当时经常有污水排出。该结论描述 2015 年调查期，不等于今天的现状。",
      },
    ],
    fieldTask: {
      title: "历史资料边界卡",
      prompt: "任选地图中的一个排口，用一句话分别写出“已知”“未知”“需要怎样复查”。",
      steps: ["记录调查年份与地点", "只摘录资料明确写出的观察", "列出判断当前状态还缺少的证据"],
    },
    quiz: [
      {
        id: "bay-scale",
        skill: "信息提取",
        difficulty: "基础",
        question: "哪一组数据与绿源 2015 年公开资料对深圳湾的描述一致？",
        options: [
          "长约 14 千米、面积约 80 平方千米、平均水深约 3 米",
          "长约 80 千米、面积约 14 平方千米、平均水深约 30 米",
          "面积约 607 平方千米、平均水深约 16 米",
          "只有涨潮时才与河流相连",
        ],
        answerIndex: 0,
        hint: "不要把海湾面积、流域面积和最深处深度混在一起。",
        explanation: "14 千米、80 平方千米和平均约 3 米分别对应海湾长度、面积和平均水深。",
        sourceIds: ["outfall-source"],
      },
      {
        id: "bay-watershed",
        skill: "系统思维",
        difficulty: "进阶",
        question: "为什么研究深圳湾污染不能只观察海面？",
        options: [
          "因为海面颜色永远无法记录",
          "因为入湾河流和城市排水系统会把流域内的物质带入海湾",
          "因为所有污染都来自远洋",
          "因为潮汐会让污染自动消失",
        ],
        answerIndex: 1,
        hint: "思考流域、河流、排水系统与海湾之间的连接。",
        explanation: "海湾接收多条河流与排水系统来水，因此需要从流域尺度追踪来源和路径。",
        sourceIds: ["outfall-source", "sengo-water"],
      },
      {
        id: "survey-count",
        skill: "精确阅读",
        difficulty: "进阶",
        question: "关于绿源 2015 年沿岸排水口调查，哪项表述最准确？",
        options: [
          "发现 6 个排洪口，全部有精密仪器数据",
          "发现 30 个排洪口，其中至少 6 个在调查期经常有污水排出",
          "调查了 607 个排洪口",
          "证明今天仍有相同数量排口排污",
        ],
        answerIndex: 1,
        hint: "区分“发现总数”“经常排污数”和“今天的状态”。",
        explanation: "资料记录的是 2015 年调查期的 30 个排洪口及至少 6 个经常排污的历史观察。",
        sourceIds: ["outfall-source"],
      },
      {
        id: "coordinate-limit",
        skill: "证据边界",
        difficulty: "挑战",
        question: "只知道某排口的 GPS 坐标，能够直接得出什么结论？",
        options: ["排口位置", "当前水质等级", "污染物来源", "未来治理效果"],
        answerIndex: 0,
        hint: "坐标回答“在哪里”，不回答“水怎么样”。",
        explanation: "坐标能定位排口；当前水质需要有日期、采样条件、指标、方法与判定标准。",
        sourceIds: ["outfall-source", "mee-monitoring"],
      },
    ],
  },
  {
    id: "outfall-investigation",
    number: 2,
    title: "第二章 · 读懂排口调查",
    subtitle: "把历史现场描述、快速检测与科学结论分开",
    description: "沿着 B1—B4、D1 与北岸排口的公开记录，学习如何阅读调查方法、误差与时空对照。",
    duration: "约 15 分钟",
    sourceIds: ["outfall-source", "mee-monitoring", "sengo-water", "sengo-2023-observation"],
    goals: ["还原调查步骤", "识别快速检测的限制", "用谨慎语言描述历史证据"],
    facts: [
      {
        title: "四次进入保护区，三轮快速检测",
        text: "绿源资料记载，项目组第一次进入红树林保护区用于寻找、编号、定位和影像记录；之后三次使用便携试剂检测 B1—B4，每个排口共测试三次。",
      },
      {
        title: "快速试剂只支持初步判断",
        text: "原文明确提醒便携检测试剂误差较大，精确数据需要精密仪器进一步检测。重复测试可以增加信息，但不会自动消除方法局限。",
      },
      {
        title: "历史描述不能改写成当前状态",
        text: "2015 年记录中，B2、B3、B4 的现场污染迹象较明显；D1 与 4-1 当时排水较清、无臭。网站将这些内容标为历史观察，不作当前水质评分。",
      },
      {
        title: "38 个点位表是采样时的快速检测",
        text: "《2023年度民间微观察》展示了珠江流域 38 个 eDNA 采样点的现场快速检测表，指标包括 pH、总磷、COD 和氨氮。它是有时间、地点与方法边界的历史记录，不是深圳湾实时水质等级。",
      },
    ],
    fieldTask: {
      title: "排口观察句改写",
      prompt: "把“这个排口污染很严重”改写成一条可复核的观察记录。",
      steps: ["加入日期与地点", "描述看到或闻到的现象", "把原因判断留给后续检测与对照"],
    },
    quiz: [
      {
        id: "outfall-sequence",
        skill: "方法还原",
        difficulty: "进阶",
        question: "绿源对保护区 B1—B4 的调查顺序是什么？",
        options: [
          "先给出水质等级，再寻找排口",
          "第一次寻找、编号、定位和拍摄，之后三次进行便携试剂检测",
          "只在一次访问中拍照",
          "先用精密仪器连续监测十年",
        ],
        answerIndex: 1,
        hint: "原文把第一次进入与后续三次进入的任务分开描述。",
        explanation: "第一次建立地点档案，后续三次进行快速检测，构成可追溯的调查步骤。",
        sourceIds: ["outfall-source"],
      },
      {
        id: "portable-limit",
        skill: "质量控制",
        difficulty: "挑战",
        question: "便携试剂连续三次得到相近结果后，最稳妥的表述是什么？",
        options: [
          "已经等同于精密仪器结论",
          "可作为初步线索，但仍需规范采样和精密检测确认",
          "重复三次就没有误差",
          "可以直接代表全年水质",
        ],
        answerIndex: 1,
        hint: "重复性与准确性不是同一个概念。",
        explanation: "相近结果说明重复性较好，但便携方法本身的误差与采样代表性仍然存在。",
        sourceIds: ["outfall-source", "mee-monitoring"],
      },
      {
        id: "rapid-table-boundary",
        skill: "数据解释",
        difficulty: "挑战",
        question: "网站应怎样呈现《2023年度民间微观察》中的 38 个点位快速检测表？",
        options: [
          "直接改写成今天的深圳湾水质排名",
          "保留采样年份、点位、指标和快速检测口径，并说明不能替代当前规范监测",
          "只展示被标色的格子，不保留表头和地点",
          "把未测项目自动填成 0",
        ],
        answerIndex: 1,
        hint: "先问数据何时、何地、用什么方法获得。",
        explanation:
          "该表来自 2023 年 eDNA 采样时的现场快速检测。保留元数据与方法局限，才能避免把历史筛查误读为实时等级。",
        sourceIds: ["sengo-2023-observation", "mee-monitoring"],
      },
      {
        id: "comparison-design",
        skill: "对照设计",
        difficulty: "综合",
        question: "若要判断雨后某排口是否影响邻近水域，哪种设计最合理？",
        options: [
          "只在排口旁拍一张照片",
          "比较雨前雨后、近口与参考点，并记录潮位和统一指标",
          "只询问路人感受",
          "把缺失值记作 0",
        ],
        answerIndex: 1,
        hint: "需要时间对照、空间对照和背景条件。",
        explanation: "时空对照与统一方法能减少潮汐、天气和地点差异带来的混淆。",
        sourceIds: ["mee-monitoring", "sengo-water"],
      },
    ],
  },
  {
    id: "mangrove-ecosystem",
    number: 3,
    title: "第三章 · 红树林是一个生态系统",
    subtitle: "从“种了多少棵”走向水文、生境与生物多样性",
    description:
      "用绿源滨海湿地项目资料理解红树林的生态功能、巡护记录与长期修复为什么需要持续管理。",
    duration: "约 14 分钟",
    sourceIds: ["sengo-wetland", "sengo-patrol-2025-04", "forestry-ecosystem"],
    goals: ["解释红树林的多重功能", "理解长期巡护价值", "避免用单一种植数量代替生态恢复"],
    facts: [
      {
        title: "红树林不只是树",
        text: "绿源项目页介绍，红树林具有防风消浪、促淤保滩、固岸护堤及净化海水和空气等功能，并支撑滩涂生物与鸟类栖息。",
      },
      {
        title: "长期巡护形成连续记录",
        text: "绿源自 2012 年起关注深圳红树林湿地，项目页记录已培养 136 名巡护员，按中、西、东部开展巡护，每年物种巡护记录超过 50 期。",
      },
      {
        title: "公开累计成果需要按原口径引用",
        text: "绿源项目页列出的累计成果包括人工复种红树林 2000 多平方米、种植红树 20000 多棵、培育银叶树苗 3000 余株。它们是项目累计值，不是深圳湾单一地点的实时数据。",
      },
    ],
    fieldTask: {
      title: "五分钟生境分层观察",
      prompt: "从安全步道观察树冠、滩涂和水面三层，各记录一条可见证据。",
      steps: ["固定观察位置和时长", "分别记录三类生境", "注明潮位、遮挡或距离造成的不确定性"],
    },
    quiz: [
      {
        id: "mangrove-functions",
        skill: "概念整合",
        difficulty: "基础",
        question: "哪一项最完整地概括绿源资料中的红树林生态功能？",
        options: [
          "只提供城市绿化景观",
          "防风消浪、促淤保滩、固岸护堤，并支持净化与生物栖息",
          "只在涨潮时有价值",
          "主要作用是方便游客赶海",
        ],
        answerIndex: 1,
        hint: "答案应同时包含海岸防护、环境调节和生态生境。",
        explanation: "红树林的价值来自多种相互关联的生态功能，而不是单一景观效果。",
        sourceIds: ["sengo-wetland", "forestry-ecosystem"],
      },
      {
        id: "patrol-records",
        skill: "长期监测",
        difficulty: "进阶",
        question: "哪组信息最能体现绿源红树林巡护的连续性？",
        options: [
          "只举办过一次讲座",
          "自 2012 年起关注湿地、培养 136 名巡护员、每年物种记录超过 50 期",
          "只在台风后拍照",
          "只统计种树数量",
        ],
        answerIndex: 1,
        hint: "寻找同时包含时间跨度、队伍和重复记录的信息。",
        explanation: "长期、分区、重复的巡护记录比一次活动更能支持变化判断。",
        sourceIds: ["sengo-wetland"],
      },
      {
        id: "cumulative-results",
        skill: "口径辨认",
        difficulty: "挑战",
        question: "如何正确使用“20000 多棵红树”这项公开数据？",
        options: [
          "写成福田某一点当前存活 20000 多棵",
          "写成绿源项目页公布的累计种植成果，并注明不是单点实时存活数",
          "据此推算深圳湾全部红树林面积",
          "把它当作 2025 年单年种植量",
        ],
        answerIndex: 1,
        hint: "区分累计种植、地点存量、单年数量和存活数量。",
        explanation: "按原始资料口径引用，才能避免把累计行动量误读成单点生态状态。",
        sourceIds: ["sengo-wetland"],
      },
      {
        id: "ecosystem-recovery",
        skill: "证据评价",
        difficulty: "综合",
        question: "判断红树林生态恢复，哪组证据比“种了多少棵”更完整？",
        options: [
          "种植当天的合影",
          "多年植株存活、生长、水文条件、底栖动物与鸟类记录",
          "苗木采购数量",
          "游客点赞数",
        ],
        answerIndex: 1,
        hint: "生态系统包括植被、水文和其他生物。",
        explanation: "跨年份、多指标的证据才能判断生态结构与功能是否逐步恢复。",
        sourceIds: ["sengo-wetland", "mangrove-manual"],
      },
    ],
  },
  {
    id: "citizen-action",
    number: 4,
    title: "第四章 · 从学习到守护",
    subtitle: "把热情变成安全、规范、可复核的公众行动",
    description:
      "参考绿源 2023—2025 年巡护与公众活动记录，学习物种观察、海岸垃圾记录和环境信息反馈。",
    duration: "约 13 分钟",
    sourceIds: [
      "sengo-patrol-2025-01",
      "sengo-patrol-2025-04",
      "sengo-patrol-2025-05",
      "sengo-2024-q3",
      "sengo-2023-observation",
      "inat-quality",
    ],
    goals: ["认识真实公众参与路径", "制作可复核观察记录", "遵守湿地观察安全与伦理"],
    facts: [
      {
        title: "巡护队是长期能力建设",
        text: "绿源 2025 年首场专业培训文章记录，协会自 2013 年起组建红树林巡护队；该场培训吸引 130 名环保爱好者参与。",
      },
      {
        title: "培训从物种认知走向保护技能",
        text: "2025 年西湾培训涵盖秋茄呼吸根、白骨壤盐分适应、外来物种防治、候鸟栖息地保护和海岸垃圾治理等内容。",
      },
      {
        title: "公众活动也需要可追溯记录",
        text: "绿源 2024 年第三季度简报记录 9 期“守护白沙湾”活动，由 100 多名志愿者带领超过 1000 名公众参与。数字反映该季度活动规模，不代表全年或所有项目。",
      },
      {
        title: "行动规模不等于生态成效",
        text: "《2023年度民间微观察》记录全年 40 场次民间水环境巡护及调查，为 1177 人次提供环境志愿服务，累计 5172 小时，涉水行程 33,312 公里。这些是项目行动量，不能单独证明水质已经改善。",
      },
    ],
    fieldTask: {
      title: "一条合格的公众观察",
      prompt: "在安全位置记录一条生物或岸线现象，并写清它不能证明什么。",
      steps: [
        "记录日期、位置、时长和观察范围",
        "写原始数量或可见特征",
        "注明不确定性，不触碰生物或不明废物",
      ],
    },
    quiz: [
      {
        id: "patrol-history",
        skill: "事实辨认",
        difficulty: "基础",
        question: "绿源 2025 年首场红树林巡护员专业培训文章记录了什么？",
        options: [
          "巡护队 2025 年才首次成立",
          "协会自 2013 年起组建巡护队，该场培训有 130 名参与者",
          "活动只面向专业研究员",
          "所有参与者都进入核心保护区采样",
        ],
        answerIndex: 1,
        hint: "区分巡护队起始年份与文章发布年份。",
        explanation: "文章将 2013 年以来的队伍建设与 2025 年这场 130 人培训联系起来。",
        sourceIds: ["sengo-patrol-2025-01"],
      },
      {
        id: "training-scope",
        skill: "知识迁移",
        difficulty: "进阶",
        question: "哪项最符合西湾巡护培训的学习范围？",
        options: [
          "只学习拍风景照",
          "物种辨认、外来物种防治、候鸟生境保护与海岸垃圾治理",
          "进入滩涂追逐动物",
          "不记录地点和时间",
        ],
        answerIndex: 1,
        hint: "巡护结合生态认知与可操作的保护技能。",
        explanation: "官方回顾把物种识别、生态威胁和治理行动放在同一培训路径中。",
        sourceIds: ["sengo-patrol-2025-04"],
      },
      {
        id: "annual-action-scale",
        skill: "数据口径",
        difficulty: "挑战",
        question: "如何准确解读《2023年度民间微观察》的年度行动数据？",
        options: [
          "1177 人次等于 1177 名从未重复参与的个人",
          "40 场次、1177 人次、5172 小时和 33,312 公里反映年度项目行动规模，不直接等于水质改善",
          "33,312 公里是一条河流的长度",
          "17 次属地处理证明只发现了 17 个环境问题",
        ],
        answerIndex: 1,
        hint: "注意“人次”与“人数”、“行动量”与“生态结果”的区别。",
        explanation:
          "报告中的场次、人次、时长和行程用于描述 2023 年项目规模；生态变化还需要规范监测与长期对照。",
        sourceIds: ["sengo-2023-observation"],
      },
      {
        id: "quality-record",
        skill: "公民科学",
        difficulty: "综合",
        question: "哪条学生记录最适合进入班级长期观察库？",
        options: [
          "“今天这里很差”",
          "有日期、位置、固定范围、方法、原始数量和不确定性说明的记录",
          "一张没有来源的网络图片",
          "根据一次观察直接断言污染来源",
        ],
        answerIndex: 1,
        hint: "可靠记录需要让别人理解、复核和重复。",
        explanation: "完整元数据、原始结果和局限说明共同构成可追溯的公众观察。",
        sourceIds: ["inat-quality", "sengo-patrol-2025-05"],
      },
    ],
  },
];

export const TOTAL_CHAPTERS = learningChapters.length;

const commonSafety =
  "只在开放步道或安全区域活动，不进入滩涂、不触碰水体或不明物，不惊扰动物；未成年人须由教师或监护人带领。";

const modules: Record<string, LearningModule> = {
  "mg-01": {
    objective: "区分“树活着”和“生态系统恢复”两种证据层级。",
    knowledge: {
      title: "成活率不是修复的全部答案",
      fact: "红树林修复评估除了植株成活，还应关注潮汐交换、生境结构、底栖动物和鸟类等变化。单一年份或单张照片只能提供局部线索。",
      think: "如果成活率很高，但潮沟堵塞、底栖动物减少，还能说生态系统已经恢复吗？",
      sourceIds: ["forestry-ecosystem", "mangrove-manual"],
    },
    quiz: {
      skill: "证据层级",
      difficulty: "挑战",
      question: "要判断这个长期修复点是否实现了“生态系统恢复”，哪组证据最有说服力？",
      options: [
        "今年拍摄的一张绿化照片",
        "某一年的单次成活率记录",
        "多年成活率、潮汐条件与底栖动物或鸟类记录",
        "最初种植的苗木总数",
      ],
      answerIndex: 2,
      hint: "想一想：生态系统包含植物以外的哪些组成部分？",
      explanation: "长期、重复且覆盖植被、水文和生物的证据，才能较完整地支持生态系统恢复判断。",
    },
    activity: {
      title: "固定机位生态速写",
      mode: "室内 / 现场",
      duration: "8 分钟",
      objective: "练习制作未来可以重复比较的观察记录。",
      steps: ["选择一个安全观察位置", "记录视线方向与可见生境", "写下下次复拍必须保持一致的条件"],
      fields: [
        {
          id: "habitats",
          label: "你看到的三类生态线索",
          kind: "text",
          placeholder: "例如：树冠、裸露滩涂、鸟类",
        },
        {
          id: "constant",
          label: "复拍时最需要保持一致的是",
          kind: "choice",
          options: ["位置、方向和高度", "照片滤镜", "拍摄者姓名", "手机品牌"],
        },
      ],
      safety: commonSafety,
    },
  },
  "mg-02": {
    objective: "用空间对照判断浪蚀是否影响幼苗。",
    knowledge: {
      title: "水动力会改变幼苗的生存机会",
      fact: "修复选址需要考虑潮位、波浪、滩涂高程和水交换。若只比较不同地点的成活率，很难把差异归因于单一因素。",
      think: "怎样设计观察，才能把“浪大”与苗木差异联系起来？",
      sourceIds: ["mangrove-manual"],
    },
    quiz: {
      skill: "对照设计",
      difficulty: "挑战",
      question: "要检验“外缘浪蚀导致幼苗受损”，最合理的观察设计是什么？",
      options: [
        "只记录受损最严重的一株",
        "同一天比较外缘与内侧等长样段的折断率，并重复观察",
        "询问游客觉得哪边浪大",
        "把这里与十公里外任意地点比较一次",
      ],
      answerIndex: 1,
      hint: "好的对照应尽量只改变一个主要条件。",
      explanation:
        "在同一地点、相近时间和相同样段长度下比较外缘与内侧，并重复观察，能减少其他变量的干扰。",
    },
    activity: {
      title: "浪蚀线索对照",
      mode: "现场",
      duration: "6 分钟",
      objective: "比较临水侧与内侧可见的受浪线索。",
      steps: ["站在步道安全位置", "分别观察临水侧与内侧", "记录倒伏、漂浮物线或裸露根等线索"],
      fields: [
        { id: "edge_clues", label: "临水侧可见线索数量", kind: "number", unit: "项" },
        { id: "inside_clues", label: "内侧可见线索数量", kind: "number", unit: "项" },
        {
          id: "inference",
          label: "你的谨慎结论",
          kind: "text",
          placeholder: "写“支持/不支持/证据不足”，并说明原因",
        },
      ],
      safety: commonSafety,
    },
  },
  "mg-03": {
    objective: "把人类活动的印象转化为可计数证据。",
    knowledge: {
      title: "干扰需要被定义和计数",
      fact: "踩踏、宠物进入、噪声和近距离接触可能影响滨海生境。科学观察需要先规定计数范围和时间，避免只凭“今天人很多”的印象。",
      think: "两组同学在不同时长内计数，结果可以直接比较吗？",
      sourceIds: ["mangrove-manual", "inat-quality"],
    },
    quiz: {
      skill: "变量控制",
      difficulty: "进阶",
      question: "甲组观察 5 分钟记录 8 次越界，乙组观察 20 分钟记录 16 次。怎样比较更合理？",
      options: [
        "直接说乙组干扰更严重",
        "比较每 5 分钟的越界次数",
        "只保留较大的数字",
        "两组数据都不能使用",
      ],
      answerIndex: 1,
      hint: "先把观察时长转换到相同尺度。",
      explanation: "标准化为相同时间单位后，甲组为每 5 分钟 8 次，乙组为每 5 分钟 4 次。",
    },
    activity: {
      title: "五分钟干扰计数",
      mode: "现场",
      duration: "5 分钟",
      objective: "用固定时长记录人类活动，而不是凭印象判断。",
      steps: ["确定一个固定观察范围", "连续观察 5 分钟", "分别记录越界、宠物进入或大声干扰"],
      fields: [
        { id: "people", label: "进入观察范围的人数", kind: "number", unit: "人" },
        { id: "disturbance", label: "明显干扰事件", kind: "number", unit: "次" },
        {
          id: "limit",
          label: "这次记录的局限",
          kind: "text",
          placeholder: "例如：只观察了 5 分钟",
        },
      ],
      safety: commonSafety,
    },
  },
  "mg-04": {
    objective: "理解乡土种源假设仍需要公平比较。",
    knowledge: {
      title: "“本地来源”是合理假设，不是免检结论",
      fact: "乡土红树植物可能更适应当地盐度和潮汐，但仍需在相近生境、相同管理条件下比较成活与生长，才能评价种源效果。",
      think: "如果本地苗种在较好的地块，外地苗种在较差的地块，成活率差异说明什么？",
      sourceIds: ["mangrove-manual"],
    },
    quiz: {
      skill: "公平比较",
      difficulty: "挑战",
      question: "哪项结果最能支持“本地种源提高了适应性”？",
      options: [
        "本地苗种得更多",
        "游客更喜欢本地苗",
        "在相近潮位和相同管护下，本地苗多批次成活率更高",
        "本地苗所在区域更靠近步道",
      ],
      answerIndex: 2,
      hint: "需要排除生境和管护差异。",
      explanation: "只有在主要环境与管理条件相近时，多批次结果差异才更能支持种源效应。",
    },
    activity: {
      title: "幼苗特征观察卡",
      mode: "室内 / 现场",
      duration: "7 分钟",
      objective: "用可描述特征代替笼统的“长得好”。",
      steps: ["选择一株远距离可见幼苗或示意图", "记录叶色、直立度和新叶", "注明无法判断的部分"],
      fields: [
        {
          id: "posture",
          label: "植株直立状态",
          kind: "choice",
          options: ["直立", "倾斜", "倒伏", "无法判断"],
        },
        {
          id: "leaf",
          label: "叶片或新叶线索",
          kind: "text",
          placeholder: "只描述看到的，不推测原因",
        },
      ],
      safety: commonSafety,
    },
  },
  "mg-05": {
    objective: "理解外来植物竞争与持续管理。",
    knowledge: {
      title: "入侵植物影响的是空间和资源",
      fact: "互花米草等入侵植物可能快速占据滩面，与红树幼苗竞争空间和光照。修复需要调查分布、选择措施并持续跟踪，而不是一次清除就结束。",
      think: "为什么学生不应该自行进入滩涂拔除植物？",
      sourceIds: ["mangrove-manual"],
    },
    quiz: {
      skill: "管理决策",
      difficulty: "进阶",
      question: "学生发现疑似入侵植物扩展时，最有价值且安全的做法是？",
      options: [
        "立即进入滩涂全部拔除",
        "只拍一张特写不记位置",
        "记录边界位置与日期，拍摄全景并交给专业人员判断",
        "根据叶色直接确定物种",
      ],
      answerIndex: 2,
      hint: "既要保留可复核证据，也要避免破坏生境。",
      explanation: "带日期、位置和尺度的边界记录可用于复查；物种确认和治理应由专业人员完成。",
    },
    activity: {
      title: "竞争边界草图",
      mode: "现场",
      duration: "8 分钟",
      objective: "记录两类植被交界，而不进行物种臆测。",
      steps: ["从步道选择一个植被交界", "画出大致边界形状", "记录边界附近裸地和幼苗线索"],
      fields: [
        {
          id: "shape",
          label: "边界形状",
          kind: "choice",
          options: ["连续带状", "零散斑块", "混合分布", "无法判断"],
        },
        {
          id: "evidence",
          label: "边界附近的可见证据",
          kind: "text",
          placeholder: "例如：幼苗较少、存在裸地；不要直接写原因",
        },
      ],
      safety: commonSafety,
    },
  },
  "mg-06": {
    objective: "理解潮沟、水交换与根区条件的联系。",
    knowledge: {
      title: "修复红树林之前，先修复水文条件",
      fact: "潮沟连接海水交换并影响淹水时长、沉积物和根区条件。种植数量很多，也不能弥补长期不合适的潮位与水文。",
      think: "只观察一次水位，能判断潮沟是否长期畅通吗？",
      sourceIds: ["forestry-ecosystem", "mangrove-manual"],
    },
    quiz: {
      skill: "时间序列",
      difficulty: "进阶",
      question: "哪种记录最适合判断潮沟是否稳定参与水交换？",
      options: [
        "退潮时拍一张照片",
        "在多个潮周期记录水位与流向",
        "记录附近树木数量",
        "询问一位游客",
      ],
      answerIndex: 1,
      hint: "潮汐是周期变化过程。",
      explanation: "多个潮周期的水位和流向记录，才能反映潮沟是否持续交换，而非某一瞬间状态。",
    },
    activity: {
      title: "潮沟流向线索",
      mode: "现场",
      duration: "6 分钟",
      objective: "用漂浮叶片或水面纹理远距离判断流向，不接触水体。",
      steps: ["找到安全可见的潮沟", "连续观察水面 60 秒", "记录流向及判断依据"],
      fields: [
        {
          id: "direction",
          label: "观察到的流向",
          kind: "choice",
          options: ["向海", "向岸", "近乎静止", "无法判断"],
        },
        { id: "clue", label: "判断依据", kind: "text", placeholder: "例如：漂浮叶片移动方向" },
      ],
      safety: commonSafety,
    },
  },
  "mg-07": {
    objective: "识别人工调水这一隐藏变量。",
    knowledge: {
      title: "管理措施也会改变观测结果",
      fact: "封闭湿地中的水位调控可能改变裸露滩涂、植被和鸟类利用。评价生态变化时，应把闸门操作、水位和天气等管理背景一起记录。",
      think: "鸟数增加一定说明水质变好吗？还有哪些解释？",
      sourceIds: ["mangrove-manual", "wetland-birds"],
    },
    quiz: {
      skill: "混杂变量",
      difficulty: "挑战",
      question: "调水后第二天鸟类数量增加，最严谨的解释是？",
      options: [
        "调水一定改善了水质",
        "鸟类增长与调水同时出现，但还需结合潮位、食物和重复记录",
        "湿地已经完全恢复",
        "鸟数与水位绝无关系",
      ],
      answerIndex: 1,
      hint: "同时发生不等于已经证明因果。",
      explanation: "调水是可能因素，但潮位、食物、天气和迁徙节律也会影响鸟数，需要重复和对照。",
    },
    activity: {
      title: "管理线索清单",
      mode: "室内 / 现场",
      duration: "6 分钟",
      objective: "识别自然过程和人工管理留下的不同线索。",
      steps: ["观察水体与岸线", "寻找闸门、人工岸线或水位刻度", "写出一个可能影响观察的管理变量"],
      fields: [
        {
          id: "management",
          label: "可见的管理设施或线索",
          kind: "text",
          placeholder: "没有看到也可以写“未发现”",
        },
        {
          id: "variable",
          label: "它可能改变什么",
          kind: "choice",
          options: ["水位或裸滩面积", "经纬度", "日期", "物种名称拼写"],
        },
      ],
      safety: commonSafety,
    },
  },
  "mg-08": {
    objective: "从垃圾分布提出可检验的来源假设。",
    knowledge: {
      title: "雨后垃圾带是线索，不是来源判决",
      fact: "降雨、地表径流、潮汐和风都可能搬运垃圾。要判断主要来源，需要记录垃圾类型、位置、天气和潮位，并在多个日期重复。",
      think: "发现很多饮料瓶，能直接断定都是现场游客丢弃的吗？",
      sourceIds: ["noaa-debris", "mangrove-manual"],
    },
    quiz: {
      skill: "多重假设",
      difficulty: "挑战",
      question: "雨后幼苗周围垃圾增多，下一步怎样最能帮助判断来源？",
      options: [
        "立即认定来自上游",
        "只统计垃圾总数",
        "按类型和位置记录，并比较雨前雨后及不同潮位",
        "选择最显眼的垃圾拍照",
      ],
      answerIndex: 2,
      hint: "来源判断需要能区分降雨、潮汐和现场活动。",
      explanation: "分类、空间位置和多时段比较能检验不同搬运路径，单次总数无法确定来源。",
    },
    activity: {
      title: "垃圾路径推理",
      mode: "现场",
      duration: "8 分钟",
      objective: "根据垃圾停留位置提出两个竞争性解释。",
      steps: ["不触碰地记录一个垃圾聚集位置", "观察附近排水方向与高潮线", "写出至少两个可能来源"],
      fields: [
        {
          id: "zone",
          label: "垃圾主要位于",
          kind: "choice",
          options: ["高潮线", "步道边", "潮沟口", "分布不集中"],
        },
        {
          id: "hypotheses",
          label: "两个可能来源或搬运过程",
          kind: "text",
          placeholder: "例如：地表径流；潮汐回带",
        },
      ],
      safety: commonSafety,
    },
  },
  "of-01": {
    objective: "理解坐标能证明什么、不能证明什么。",
    knowledge: {
      title: "GPS 是重访地址，不是水质结论",
      fact: "准确坐标让不同人员回到同一位置，并把记录关联起来；坐标本身不包含水质、流量或污染来源信息。",
      think: "同一坐标在不同日期的水质一定相同吗？",
      sourceIds: ["outfall-source", "mee-monitoring"],
    },
    quiz: {
      skill: "字段含义",
      difficulty: "基础",
      question: "B1 的公开 GPS 坐标最直接支持哪项工作？",
      options: ["判断水质是否达标", "让调查者重访同一位置", "确定污染物种类", "计算年排放总量"],
      answerIndex: 1,
      hint: "坐标回答的是“在哪里”。",
      explanation: "坐标用于定位和重访；水质判断还需要日期、采样、检测方法和评价标准。",
    },
    activity: {
      title: "坐标重访核对",
      mode: "室内 / 现场",
      duration: "5 分钟",
      objective: "练习核对地图标记与公开坐标。",
      steps: ["读取页面坐标", "在地图上确认标记", "记录坐标可支持和不可支持的各一项结论"],
      fields: [
        { id: "can", label: "坐标可以支持", kind: "text", placeholder: "例如：重访同一位置" },
        { id: "cannot", label: "坐标不能单独支持", kind: "text", placeholder: "例如：水质达标" },
      ],
      safety: commonSafety,
    },
  },
  "of-02": {
    objective: "认识一次可解释采样需要的元数据。",
    knowledge: {
      title: "没有采样背景，数字很难比较",
      fact: "规范监测会记录采样点、日期时间、天气、水文条件、采样方法和原始记录。相同数值在不同条件下可能含义不同。",
      think: "只写“今天浑浊”，下个月的人能重复你的观察吗？",
      sourceIds: ["mee-monitoring"],
    },
    quiz: {
      skill: "监测元数据",
      difficulty: "进阶",
      question: "下列哪份记录最适合与下个月的数据比较？",
      options: [
        "B2：水有点浑",
        "B2，14:30，退潮，雨后 2 小时，固定位置观察，附照片",
        "深圳湾：情况一般",
        "排口附近，今天，颜色较深",
      ],
      answerIndex: 1,
      hint: "别人需要知道何时、何地、什么条件、怎么记录。",
      explanation: "完整的时间、潮汐、天气、固定位置与影像证据提高了可重复性。",
    },
    activity: {
      title: "一分钟元数据单",
      mode: "室内 / 现场",
      duration: "4 分钟",
      objective: "补齐一条观察记录的时间和环境背景。",
      steps: ["确认地点编号", "记录当前日期时间和天气", "注明是现场还是网页观察"],
      fields: [
        {
          id: "weather",
          label: "天气背景",
          kind: "choice",
          options: ["晴", "阴", "小雨", "雨后", "未知"],
        },
        {
          id: "method",
          label: "观察方式",
          kind: "choice",
          options: ["现场固定点", "网页资料", "他人转述", "未知"],
        },
      ],
      safety: commonSafety,
    },
  },
  "of-03": {
    objective: "正确区分零值、未测和未公开。",
    knowledge: {
      title: "空白不等于 0",
      fact: "“0”表示按规定方法测量后得到零值或低于记录精度；“未测”“缺失”“未公开”表示没有可用结果。把缺失填成 0 会人为改变平均值和趋势。",
      think: "三个样点为 2、4、缺失，平均值能直接按 (2+4+0)/3 算吗？",
      sourceIds: ["mee-monitoring"],
    },
    quiz: {
      skill: "缺失数据",
      difficulty: "进阶",
      question: "B3 的水质原始指标尚未获得，数据库中最合适的记录是？",
      options: ["填 0", "复制 B2 的数值", "标记“待补充/不可用”，并保留来源说明", "根据水色估算"],
      answerIndex: 2,
      hint: "缺失是一种数据状态，不是一个测量值。",
      explanation: "明确标记缺失并保留来源，能避免把未知错误解释成零污染或零浓度。",
    },
    activity: {
      title: "数据缺口审计",
      mode: "室内 / 现场",
      duration: "5 分钟",
      objective: "判断页面字段属于事实、缺失还是解释。",
      steps: ["找出编号和坐标", "找出未提供字段", "写明缺失数据会限制哪种结论"],
      fields: [
        { id: "known", label: "当前已知字段", kind: "text", placeholder: "例如：编号、坐标" },
        {
          id: "limit",
          label: "缺失数据限制了什么判断",
          kind: "text",
          placeholder: "例如：无法判断水质等级",
        },
      ],
      safety: commonSafety,
    },
  },
  "of-04": {
    objective: "理解唯一编号如何连接不同批次资料。",
    knowledge: {
      title: "编号是数据链条的主键",
      fact: "稳定的地点编号与坐标可以把照片、采样记录和检测结果关联到同一对象；只写“红树林附近排口”容易混淆多个地点。",
      think: "地点搬迁或坐标修正时，编号和版本说明应怎样保留？",
      sourceIds: ["outfall-source", "mee-monitoring"],
    },
    quiz: {
      skill: "数据关联",
      difficulty: "进阶",
      question: "整理 B4 多年资料时，哪种文件命名最有利于追溯？",
      options: [
        "照片1.jpg",
        "排口最新最终版.jpg",
        "B4_2026-08-08_1430_退潮_观察.jpg",
        "深圳湾好照片.jpg",
      ],
      answerIndex: 2,
      hint: "文件名应包含稳定地点、时间和关键背景。",
      explanation: "地点编号、标准日期时间与潮汐背景能让记录被排序、查找和复核。",
    },
    activity: {
      title: "证据链命名挑战",
      mode: "室内 / 现场",
      duration: "4 分钟",
      objective: "为一条观察生成可追溯文件名。",
      steps: ["使用 B4 作为地点主键", "加入日期与观察类型", "避免使用“最新”“最终”等模糊词"],
      fields: [
        {
          id: "filename",
          label: "你的标准文件名",
          kind: "text",
          placeholder: "B4_YYYY-MM-DD_观察类型",
        },
        {
          id: "reason",
          label: "其中哪个字段用于跨年份关联",
          kind: "choice",
          options: ["B4", "最新", "照片", "文件扩展名"],
        },
      ],
      safety: commonSafety,
    },
  },
  "of-05": {
    objective: "用上下游与参考点设计来源调查。",
    knowledge: {
      title: "河口需要空间对照",
      fact: "河口同时受上游来水、潮汐和邻近排水影响。为了定位变化来源，应在相近时间比较上游、排口附近、下游或参考点。",
      think: "如果潮水正在倒灌，“上游”和“下游”的简单假设会发生什么变化？",
      sourceIds: ["mee-monitoring"],
    },
    quiz: {
      skill: "空间采样",
      difficulty: "挑战",
      question: "要判断 D1 附近的变化是否可能来自该排口，哪种布点更合理？",
      options: [
        "只测排口正前方一次",
        "同一潮段比较排口上游、近口、下游和参考点",
        "只选择颜色最深处",
        "在四个不同月份各选一个随机地点",
      ],
      answerIndex: 1,
      hint: "空间对照需要尽量处于相近时间和水文条件。",
      explanation: "同一潮段的梯度布点与参考点更有助于区分背景变化和局地信号。",
    },
    activity: {
      title: "纸上布点设计",
      mode: "室内 / 现场",
      duration: "7 分钟",
      objective: "在地图上设计四个功能不同的观察点。",
      steps: ["找到河口与 D1", "设想当前水流方向", "安排背景、近口与两个对照位置"],
      fields: [
        { id: "reference", label: "参考点应避开什么", kind: "text", placeholder: "例如：紧贴排口" },
        {
          id: "timing",
          label: "四个点最好怎样观测",
          kind: "choice",
          options: ["同一潮段尽快完成", "任意四个月", "只在最方便时", "分别由不同方法完成"],
        },
      ],
      safety: commonSafety,
    },
  },
  "of-06": {
    objective: "区分感官线索与实验室指标。",
    knowledge: {
      title: "看起来清澈，不等于所有指标安全",
      fact: "水色、漂浮物和气味可作为现场观察线索，但不能替代 pH、溶解氧、氨氮等规范检测；部分污染物无法靠肉眼识别。",
      think: "为什么“没有异味”仍不能证明水质达标？",
      sourceIds: ["mee-indicators", "mee-monitoring"],
    },
    quiz: {
      skill: "证据边界",
      difficulty: "基础",
      question: "4-1 水面清澈且无明显漂浮物，最合适的表述是？",
      options: [
        "水质全部达标",
        "现场未见明显视觉异常，但仍需规范检测判断水质",
        "排口没有任何排放",
        "所有污染物浓度为零",
      ],
      answerIndex: 1,
      hint: "视觉观察只覆盖可以被看到的现象。",
      explanation: "清澈是现场线索，不代表溶解性物质、营养盐或微生物等指标达标。",
    },
    activity: {
      title: "安全感官观察",
      mode: "现场",
      duration: "5 分钟",
      objective: "只记录远距离可见现象，并标注证据边界。",
      steps: ["从步道远距离观察", "记录水色、漂浮物和水流", "写一句不能由肉眼判断的内容"],
      fields: [
        {
          id: "visible",
          label: "可见现象",
          kind: "text",
          placeholder: "例如：水色、泡沫、漂浮物；没有也要记录",
        },
        {
          id: "not_visible",
          label: "肉眼不能判断的指标",
          kind: "choice",
          options: ["溶解氧或氨氮", "水面是否有瓶子", "位置", "日期"],
        },
      ],
      safety: "不要靠近排口、俯身探水、触摸水体或凑近闻气味；只做远距离观察。",
    },
  },
  "of-07": {
    objective: "设计可以重复的观察协议。",
    knowledge: {
      title: "可重复性来自一致的方法",
      fact: "比较不同日期时，应尽量保持地点、观察范围、时长、潮段和记录分类一致，并把无法控制的天气等条件记录下来。",
      think: "每次都换观察范围，即使总数不同，还能说明趋势吗？",
      sourceIds: ["mee-monitoring", "noaa-debris"],
    },
    quiz: {
      skill: "可重复性",
      difficulty: "进阶",
      question: "哪项改动最可能破坏 4-2 月度观察的可比性？",
      options: [
        "记录当天天气",
        "每次使用不同长度的观察岸段却直接比较总数",
        "保留相同地点编号",
        "使用相同分类表",
      ],
      answerIndex: 1,
      hint: "总量会随调查范围变化。",
      explanation: "观察范围变化会直接改变发现数量；若必须变化，应换算为单位长度或单位面积。",
    },
    activity: {
      title: "三条协议挑战",
      mode: "室内 / 现场",
      duration: "5 分钟",
      objective: "为下一组同学留下可执行的重复观察规则。",
      steps: ["选择观察对象", "规定范围与时长", "规定必须记录的背景变量"],
      fields: [
        {
          id: "protocol",
          label: "你的固定范围与时长",
          kind: "text",
          placeholder: "例如：栏杆 A-B，连续 5 分钟",
        },
        {
          id: "context",
          label: "必须记录的背景变量",
          kind: "choice",
          options: ["天气和潮段", "鞋子颜色", "手机型号", "学生座号"],
        },
      ],
      safety: commonSafety,
    },
  },
  "of-08": {
    objective: "区分浓度、流量和污染负荷。",
    knowledge: {
      title: "浓度高不一定代表总量最大",
      fact: "浓度描述单位体积中的含量；估计单位时间通过的总量，还需要流量信息。只比较浓度，不能完整判断不同排口的总负荷。",
      think: "低浓度大流量与高浓度小流量，哪一个总量更大？还缺什么？",
      sourceIds: ["mee-monitoring", "mee-indicators"],
    },
    quiz: {
      skill: "数量关系",
      difficulty: "挑战",
      question:
        "甲排口浓度较低但流量很大，乙排口浓度较高但流量很小。要比较单位时间污染物总量，还需要怎样做？",
      options: [
        "只选浓度更高的乙",
        "只选流量更大的甲",
        "结合浓度与同期流量计算，且保证单位一致",
        "比较水色深浅",
      ],
      answerIndex: 2,
      hint: "单位时间总量同时受“每升多少”和“每秒多少升”影响。",
      explanation: "负荷估计需要浓度与流量的同期数据，并进行正确的单位换算。",
    },
    activity: {
      title: "浓度 × 流量纸上实验",
      mode: "室内 / 现场",
      duration: "6 分钟",
      objective: "用两个假设情景理解负荷，而不把练习数值当成本站数据。",
      steps: ["设想两杯不同浓度液体", "改变每分钟流过的体积", "说明为什么现实监测需要同期流量"],
      fields: [
        {
          id: "factor",
          label: "估计单位时间总量需要",
          kind: "choice",
          options: ["浓度与流量", "坐标与照片", "水色与气味", "编号与名称"],
        },
        {
          id: "caution",
          label: "练习数值为什么不能写回地图数据库",
          kind: "text",
          placeholder: "因为它们是教学假设，不是现场测量",
        },
      ],
      safety: commonSafety,
    },
  },
  "of-09": {
    objective: "认识质量控制与原始记录。",
    knowledge: {
      title: "可靠数据要能回到原始记录",
      fact: "监测质量控制包括仪器状态、采样方法、空白或平行样、原始记录和异常说明。只保留最终评分会丢失复核路径。",
      think: "两次结果差异很大时，第一步应该删掉哪个，还是检查过程？",
      sourceIds: ["mee-monitoring"],
    },
    quiz: {
      skill: "质量控制",
      difficulty: "挑战",
      question: "4-4 的两次检测结果差异很大，最先应检查什么？",
      options: [
        "删除较不喜欢的结果",
        "原始记录、采样条件、方法和仪器质控信息",
        "取两个数中较小值",
        "改用水色判断",
      ],
      answerIndex: 1,
      hint: "异常值可能是真变化，也可能来自过程差异。",
      explanation: "先检查完整证据链，才能判断差异来自环境变化、采样误差还是检测问题。",
    },
    activity: {
      title: "记录质量检查员",
      mode: "室内 / 现场",
      duration: "5 分钟",
      objective: "为一条观察检查完整性，而不是判断好坏。",
      steps: ["确认地点和日期", "确认方法与环境背景", "寻找异常或缺失说明"],
      fields: [
        {
          id: "missing",
          label: "最容易遗漏的字段",
          kind: "text",
          placeholder: "例如：潮段、照片方向、方法",
        },
        {
          id: "decision",
          label: "发现异常值时先做什么",
          kind: "choice",
          options: ["检查原始记录", "立即删除", "改成平均值", "隐藏异常"],
        },
      ],
      safety: commonSafety,
    },
  },
  "of-10": {
    objective: "避免把雨后相关性误写成确定来源。",
    knowledge: {
      title: "同时出现不等于已经证明因果",
      fact: "雨后浑浊可能与地表径流、潮汐扰动、施工或排水有关。来源判断需要雨前雨后、多个位置和相关指标的证据。",
      think: "如果多个没有排口的参考点也同时变浑，原来的来源假设会怎样？",
      sourceIds: ["mee-monitoring"],
    },
    quiz: {
      skill: "因果推断",
      difficulty: "挑战",
      question: "雨后 4-5 附近水色变深，哪一句最科学？",
      options: [
        "4-5 一定排放了污染物",
        "雨后出现变化，需与雨前、参考点和检测数据比较后判断来源",
        "所有雨水都有毒",
        "水色能够确定污染物名称",
      ],
      answerIndex: 1,
      hint: "先描述观察，再列出需要验证的解释。",
      explanation: "谨慎表述保留了多种可能机制，并指出验证来源所需的对照证据。",
    },
    activity: {
      title: "竞争性解释卡",
      mode: "室内 / 现场",
      duration: "6 分钟",
      objective: "为同一现象提出至少两个可检验解释。",
      steps: ["描述现象而不写原因", "提出两个可能机制", "为每个机制写一个需要的新证据"],
      fields: [
        {
          id: "explanations",
          label: "两个可能解释",
          kind: "text",
          placeholder: "例如：径流输入；潮汐搅动",
        },
        {
          id: "test",
          label: "最需要补充的比较",
          kind: "choice",
          options: ["雨前雨后与参考点", "两张不同滤镜照片", "游客投票", "只看一次"],
        },
      ],
      safety: commonSafety,
    },
  },
  "of-11": {
    objective: "区分单点数值和时间趋势。",
    knowledge: {
      title: "趋势至少需要可比的重复记录",
      fact: "单个日期只能描述当时状态。判断上升、下降或季节变化，需要在一致方法下积累多个日期，并检查缺失值和异常背景。",
      think: "连续三个月下降，能代表多年趋势吗？季节会不会影响？",
      sourceIds: ["mee-monitoring"],
    },
    quiz: {
      skill: "趋势判断",
      difficulty: "进阶",
      question: "下列哪项最适合支持“4-6 的某指标持续下降”？",
      options: [
        "今天一次测量较低",
        "多年同季节、相近潮段和一致方法的重复数据",
        "一位同学觉得更清澈",
        "另一个排口的结果",
      ],
      answerIndex: 1,
      hint: "趋势要求时间序列具有可比性。",
      explanation: "多年、同季节和一致方法能减少季节及方法变化造成的假趋势。",
    },
    activity: {
      title: "监测日历设计",
      mode: "室内 / 现场",
      duration: "5 分钟",
      objective: "设计三次可比较的未来观察，而不是填写虚构数值。",
      steps: ["选择固定观察时段", "安排至少三个日期", "规定每次保持一致的条件"],
      fields: [
        {
          id: "schedule",
          label: "你的三次观察安排",
          kind: "text",
          placeholder: "例如：每月第一个周五 16:00",
        },
        {
          id: "constant",
          label: "每次必须一致",
          kind: "choice",
          options: ["地点、范围和方法", "天气必须相同", "观察者必须同一人", "照片颜色必须相同"],
        },
      ],
      safety: commonSafety,
    },
  },
  "tp-01": {
    objective: "用固定时段计数并理解鸟类可探测性。",
    knowledge: {
      title: "鸟数变化也可能来自“更容易被看见”",
      fact: "鸟类调查应记录时长、范围、潮位、天气和干扰。退潮后滩涂裸露、鸟类集中觅食，可能提高观察到的数量，但一次计数不能代表全部种群。",
      think: "同一批鸟分散和聚集时，哪次更容易数到？",
      sourceIds: ["wetland-birds", "inat-quality"],
    },
    quiz: {
      skill: "可探测性",
      difficulty: "挑战",
      question: "退潮时记录到的鸟比高潮时多，最合理的解释是？",
      options: [
        "鸟类种群一定在一小时内增长了",
        "滩涂裸露改变了鸟的分布和可见性，需要在相似潮位重复比较",
        "高潮时所有鸟都离开深圳",
        "只保留数字较大的记录",
      ],
      answerIndex: 1,
      hint: "观察到的数量同时受真实数量和可见性影响。",
      explanation: "潮位会改变觅食地和聚集程度；标准化潮位、范围与时长后才更适合比较。",
    },
    activity: {
      title: "三分钟定点鸟类计数",
      mode: "现场",
      duration: "3 分钟",
      objective: "练习固定范围、固定时长的安静计数。",
      steps: ["选定不移动的观察点", "安静观察 3 分钟", "按水面、滩涂、树上记录鸟只并注明不确定性"],
      fields: [
        { id: "count", label: "观察到的鸟只总数", kind: "number", unit: "只" },
        {
          id: "zone",
          label: "鸟最集中在",
          kind: "choice",
          options: ["水面", "裸露滩涂", "树上", "空中", "未观察到"],
        },
        {
          id: "uncertainty",
          label: "本次计数的不确定因素",
          kind: "text",
          placeholder: "例如：距离远、鸟群移动、被树遮挡",
        },
      ],
      safety:
        "保持安静和距离，不播放鸟鸣、不投喂、不追逐鸟群；不拍摄同学正脸或公开未成年人个人信息。",
    },
  },
  "tp-02": {
    objective: "用标准样带与分类数据比较岸线垃圾。",
    knowledge: {
      title: "垃圾调查要比较“单位长度”和类型",
      fact: "标准化岸线调查会固定样带长度、调查时间和分类规则。只有这样，不同日期或地点的数量才可比较，并能帮助推断来源和预防重点。",
      think: "20 米岸段发现 10 件、100 米岸段发现 30 件，哪里密度更高？",
      sourceIds: ["noaa-debris"],
    },
    quiz: {
      skill: "标准化数据",
      difficulty: "挑战",
      question:
        "甲组调查 10 米记录 12 件垃圾，乙组调查 30 米记录 24 件。按单位长度比较，哪组密度更高？",
      options: ["甲组：1.2 件/米", "乙组：2.4 件/米", "两组相同", "无法使用单位长度比较"],
      answerIndex: 0,
      hint: "分别用垃圾件数除以样带长度。",
      explanation: "甲组为 12÷10=1.2 件/米，乙组为 24÷30=0.8 件/米，因此甲组更高。",
    },
    activity: {
      title: "五米岸线垃圾审计",
      mode: "现场",
      duration: "8 分钟",
      objective: "在不触碰垃圾的情况下完成标准化分类计数。",
      steps: [
        "沿开放步道确定约 5 米观察段",
        "只目视统计塑料、纸、金属和其他类别",
        "计算总数并记录最常见类别",
      ],
      fields: [
        { id: "plastic", label: "塑料类", kind: "number", unit: "件" },
        { id: "other", label: "其他类别合计", kind: "number", unit: "件" },
        {
          id: "source_limit",
          label: "为什么不能只凭一件垃圾确定来源",
          kind: "text",
          placeholder: "考虑潮汐、风和地表径流",
        },
      ],
      safety:
        "只目视记录，不触碰碎玻璃、针具、化学容器或不明物；发现危险废物应远离并告知教师或管理人员。",
    },
  },
};

export function getLearningModule(locationId: string) {
  const module = modules[locationId];
  if (!module) throw new Error(`缺少地点 ${locationId} 的学习模块`);
  return module;
}

export function getLearningSources(sourceIds: string[]) {
  return sourceIds
    .map((sourceId) => learningSources.find((source) => source.id === sourceId))
    .filter((source): source is LearningSource => Boolean(source));
}

export function getLocationQuiz(location: { id: string }) {
  return getLearningModule(location.id).quiz;
}

export const finalQuestions: FinalQuestion[] = [
  {
    id: "restoration-evidence",
    skill: "综合证据",
    difficulty: "综合",
    question: "某修复点成活率上升，但潮沟堵塞、底栖动物记录减少。最合理的结论是？",
    options: [
      "修复已完全成功",
      "成活率没有价值",
      "植被指标改善，但生态系统恢复证据仍不完整",
      "潮沟与生态系统无关",
    ],
    answerIndex: 2,
    hint: "综合不同证据，而不是只选一个指标。",
    explanation: "植被改善是积极线索，但水文和生物组成仍提示系统功能可能未充分恢复。",
  },
  {
    id: "rainfall-causality",
    skill: "因果推断",
    difficulty: "综合",
    question: "雨后某排口附近水色变深。哪项后续设计最能检验是否为局地排口影响？",
    options: [
      "只拍颜色最深的一处",
      "比较雨前雨后、近口与参考点，并记录潮位和检测指标",
      "询问路人",
      "直接把原因写成排污",
    ],
    answerIndex: 1,
    hint: "需要时间对照、空间对照和背景变量。",
    explanation: "时空对照加上潮位和指标检测，才能逐步排除径流、潮汐等其他解释。",
  },
  {
    id: "missing-zero",
    skill: "数据质量",
    difficulty: "综合",
    question: "三个样点结果为 2、4、未测。为什么不能按 2、4、0 计算平均值？",
    options: [
      "0 不能参加任何运算",
      "样点数量必须是偶数",
      "平均值只能由实验室计算",
      "未测表示未知，不表示测量结果为 0",
    ],
    answerIndex: 3,
    hint: "区分数值和数据状态。",
    explanation: "把未知填成 0 会人为降低平均值，并制造不存在的测量结果。",
  },
  {
    id: "bird-detectability",
    skill: "生态调查",
    difficulty: "综合",
    question: "两次鸟类计数分别在退潮和高潮进行，数量差异很大。首先应怎样处理？",
    options: [
      "承认潮位影响可探测性，并在相似潮位重复调查",
      "只保留数量较多的一次",
      "直接认定种群减少",
      "把两次数值相加",
    ],
    answerIndex: 0,
    hint: "调查条件本身会改变鸟类的分布和可见性。",
    explanation: "在相似潮位、范围与时长下重复，才能更公平地比较真实变化。",
  },
  {
    id: "debris-density",
    skill: "数据标准化",
    difficulty: "综合",
    question: "A 点 20 米岸段有 24 件垃圾，B 点 10 米岸段有 15 件。哪项判断正确？",
    options: [
      "A 点密度更高",
      "两点相同",
      "B 点密度更高，应比较 1.5 与 1.2 件/米",
      "只看总数无法进行任何计算",
    ],
    answerIndex: 2,
    hint: "先换算为单位长度。",
    explanation: "A 为 1.2 件/米，B 为 1.5 件/米；标准化后 B 更高。",
  },
  {
    id: "load",
    skill: "数量推理",
    difficulty: "综合",
    question: "两个排口浓度不同。要比较单位时间通过的污染物总量，最关键还需哪项数据？",
    options: ["排口名称长度", "与浓度同期的流量", "照片亮度", "观察者人数"],
    answerIndex: 1,
    hint: "总量同时与单位体积含量和通过体积有关。",
    explanation: "在单位一致的前提下，浓度与同期流量共同决定单位时间负荷。",
  },
  {
    id: "strongest-record",
    skill: "证据评价",
    difficulty: "综合",
    question: "以下哪条学生观察最适合进入班级长期数据库？",
    options: [
      "这里今天很脏",
      "一张无日期的网络图片",
      "朋友说上周有很多鸟",
      "有地点、日期、固定范围、方法、原始计数和不确定性说明的记录",
    ],
    answerIndex: 3,
    hint: "可靠记录应让别人能够理解、复核和重复。",
    explanation: "完整元数据、标准方法、原始结果与局限说明共同构成可追溯记录。",
  },
];
