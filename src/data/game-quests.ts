export interface BilingualText {
  zh: string;
  en: string;
}

export interface GameQuestion {
  prompt: BilingualText;
  options: { zh: string; en: string }[];
  answerIndex: number;
  explanation: BilingualText;
}

export interface BonusMilestone {
  id: string;
  stationCount: number;
  reward: BilingualText;
  teaser: BilingualText;
  sourceIds: string[];
  question: GameQuestion;
}

export interface LibrarySideQuest {
  id: string;
  unlockAt: number;
  title: BilingualText;
  mission: BilingualText;
  reward: BilingualText;
  facts: BilingualText[];
  sourceIds: string[];
  question: GameQuestion;
}

export const bonusMilestones: BonusMilestone[] = [
  {
    id: "evidence-lens",
    stationCount: 5,
    reward: { zh: "证据放大镜", en: "Evidence Lens" },
    teaser: { zh: "第一份神秘调查装备", en: "Your first mystery investigation tool" },
    sourceIds: ["sengo-2023-observation"],
    question: {
      prompt: {
        zh: "一个点位只有一次现场快速检测记录，最稳妥的用途是什么？",
        en: "A station has only one rapid field-test record. What is its strongest use?",
      },
      options: [
        { zh: "直接判定长期水质等级", en: "Assign a long-term water-quality class" },
        {
          zh: "作为提出问题和后续复测的线索",
          en: "Use it as a clue for questions and repeat testing",
        },
        { zh: "证明污染来自最近的排口", en: "Prove pollution came from the nearest outfall" },
      ],
      answerIndex: 1,
      explanation: {
        zh: "一次快速检测是有时间与方法边界的快照，适合产生可检验的问题。",
        en: "A rapid test is a time- and method-bounded snapshot that can generate testable questions.",
      },
    },
  },
  {
    id: "source-key",
    stationCount: 10,
    reward: { zh: "来源追踪钥匙", en: "Source-tracing Key" },
    teaser: { zh: "完成第一幕后出现的隐藏钥匙", en: "A hidden key revealed after Act I" },
    sourceIds: ["sengo-2023-observation", "mee-monitoring"],
    question: {
      prompt: {
        zh: "报告表格没有标明检测单位时，网站最科学的做法是什么？",
        en: "A report table does not show measurement units. What should the website do?",
      },
      options: [
        { zh: "按常见单位自行补上", en: "Add the most common unit" },
        { zh: "把数值换算成水质等级", en: "Convert values into a water-quality class" },
        {
          zh: "保留原值并明确注明单位未公开",
          en: "Keep the original value and state that the unit is unpublished",
        },
      ],
      answerIndex: 2,
      explanation: {
        zh: "未知信息不能靠猜测补齐；清楚标注缺失项本身就是科学记录。",
        en: "Missing information should not be guessed; documenting the gap is part of scientific reporting.",
      },
    },
  },
  {
    id: "confluence-compass",
    stationCount: 16,
    reward: { zh: "汇流罗盘", en: "Confluence Compass" },
    teaser: { zh: "追踪不同来水的方向工具", en: "A tool for tracing different incoming waters" },
    sourceIds: ["mee-monitoring"],
    question: {
      prompt: {
        zh: "要判断交汇口的变化可能来自哪一支流，哪种布点最有信息量？",
        en: "Which sampling layout best identifies which tributary may drive a confluence change?",
      },
      options: [
        { zh: "只测交汇后的一个点", en: "One station below the confluence" },
        {
          zh: "两支流交汇前各一点，交汇后再一点",
          en: "One station on each tributary and one downstream",
        },
        { zh: "选择三个距离最远的点", en: "Choose the three most distant stations" },
      ],
      answerIndex: 1,
      explanation: {
        zh: "交汇前两侧与交汇后成组布点，才能比较不同来水及混合后的变化。",
        en: "Paired upstream stations plus a downstream station allow comparison before and after mixing.",
      },
    },
  },
  {
    id: "variable-shield",
    stationCount: 22,
    reward: { zh: "控变量护盾", en: "Variable-control Shield" },
    teaser: { zh: "抵挡错误因果判断的防具", en: "Protection against false causal claims" },
    sourceIds: ["mee-monitoring"],
    question: {
      prompt: {
        zh: "比较雨前与雨后两个点位时，最需要同时记录哪组条件？",
        en: "When comparing stations before and after rain, which conditions matter most?",
      },
      options: [
        { zh: "天气、时间、水位与检测方法", en: "Weather, time, water level and test method" },
        { zh: "拍照设备的品牌", en: "Camera brand" },
        { zh: "调查员最喜欢的地点", en: "The investigator's preferred location" },
      ],
      answerIndex: 0,
      explanation: {
        zh: "这些条件都会影响可比性，记录它们可以帮助排除混杂因素。",
        en: "These conditions affect comparability and help investigators identify confounding factors.",
      },
    },
  },
  {
    id: "data-decoder",
    stationCount: 28,
    reward: { zh: "指标解码器", en: "Indicator Decoder" },
    teaser: { zh: "读取指标但不越界下结论", en: "Read indicators without overclaiming" },
    sourceIds: ["mee-indicators", "sengo-2023-observation"],
    question: {
      prompt: {
        zh: "只知道一个点的 pH，可以得出哪项结论？",
        en: "What can be concluded from a station's pH alone?",
      },
      options: [
        { zh: "该水体的完整水质等级", en: "The complete water-quality class" },
        { zh: "污染物的具体来源", en: "The exact pollution source" },
        { zh: "采样时的酸碱条件线索", en: "A clue about acidity or alkalinity at sampling time" },
      ],
      answerIndex: 2,
      explanation: {
        zh: "pH 只描述酸碱条件，不能单独代表营养盐、有机物或完整水质状态。",
        en: "pH describes acidity or alkalinity, not nutrients, organic matter or overall water quality by itself.",
      },
    },
  },
  {
    id: "tide-clock",
    stationCount: 33,
    reward: { zh: "潮汐时钟", en: "Tide Clock" },
    teaser: { zh: "河海口调查的时间装备", en: "Timing equipment for estuary investigations" },
    sourceIds: ["forestry-ecosystem", "mee-monitoring"],
    question: {
      prompt: {
        zh: "同一河口退潮与高潮时观察结果不同，首先应该怎样处理？",
        en: "Results differ between low and high tide at one estuary. What should happen first?",
      },
      options: [
        { zh: "直接认定生态突然恶化", en: "Declare sudden ecological decline" },
        {
          zh: "记录潮位并在可比潮段重复观察",
          en: "Record tide stage and repeat at comparable tides",
        },
        { zh: "删除差异较大的那次记录", en: "Delete the record with the larger difference" },
      ],
      answerIndex: 1,
      explanation: {
        zh: "潮位会改变水深、流速、裸露泥滩与生物活动，必须纳入比较条件。",
        en: "Tide stage changes depth, flow, exposed mudflat and biological activity, so it belongs in the comparison.",
      },
    },
  },
  {
    id: "evidence-master",
    stationCount: 38,
    reward: { zh: "珠江流域证据大师奖章", en: "Pearl River Evidence Master Medal" },
    teaser: {
      zh: "全部主线完成后的传奇大奖",
      en: "The legendary reward for completing the main quest",
    },
    sourceIds: ["mee-monitoring", "sengo-2023-observation"],
    question: {
      prompt: {
        zh: "最终调查方案怎样才最容易被另一组学生复核？",
        en: "Which final investigation plan is easiest for another student team to verify?",
      },
      options: [
        { zh: "只保存最终结论", en: "Save only the final conclusion" },
        { zh: "每次自由改变方法", en: "Change the method on every visit" },
        {
          zh: "保存坐标、时间、方法、原始值、天气水位与重复记录",
          en: "Save coordinates, time, method, raw values, conditions and repeat records",
        },
      ],
      answerIndex: 2,
      explanation: {
        zh: "可复核调查需要完整原始记录与一致方法，也要诚实保留缺失和不确定性。",
        en: "A verifiable investigation needs complete raw records, consistent methods and transparent uncertainty.",
      },
    },
  },
];

export const librarySideQuests: LibrarySideQuest[] = [
  {
    id: "outfall-archive",
    unlockAt: 5,
    title: { zh: "支线一 · 历史排口档案室", en: "Side Quest I · Historical Outfall Archive" },
    mission: {
      zh: "阅读 2015 年深圳湾排水口公开调查，判断历史记录今天还能说明什么。",
      en: "Read the published 2015 outfall survey and decide what a historical record can support today.",
    },
    reward: { zh: "历史边界徽章", en: "Historical-boundary Badge" },
    facts: [
      {
        zh: "公开页面记录的是 2015 年历史调查。",
        en: "The public page documents a 2015 historical survey.",
      },
      {
        zh: "11 个排口有公开 GPS 坐标，可用于定位历史观察点。",
        en: "Eleven outfalls have published GPS coordinates that locate historical observations.",
      },
      {
        zh: "历史描述不能替代该点当前的现场复测。",
        en: "Historical descriptions cannot replace a current field revisit.",
      },
    ],
    sourceIds: ["outfall-source"],
    question: {
      prompt: {
        zh: "2015 年某排口记录今天最适合怎样使用？",
        en: "How should a 2015 outfall record be used today?",
      },
      options: [
        { zh: "当作该点当前状态", en: "As the station's current condition" },
        {
          zh: "作为历史基线，并设计当前复测",
          en: "As a historical baseline followed by a current revisit",
        },
        { zh: "推算所有排口的情况", en: "To infer conditions at every outfall" },
      ],
      answerIndex: 1,
      explanation: {
        zh: "历史资料能提供基线和问题，但当前判断需要新的可比证据。",
        en: "Historical material provides a baseline and questions; current claims require new comparable evidence.",
      },
    },
  },
  {
    id: "mangrove-guardian",
    unlockAt: 10,
    title: { zh: "支线二 · 红树林守护者", en: "Side Quest II · Mangrove Guardian" },
    mission: {
      zh: "利用红树林生态与修复资料，破解“种活树就等于生态恢复吗”。",
      en: "Use mangrove ecology and restoration sources to test whether surviving trees alone equal recovery.",
    },
    reward: { zh: "红树林系统思维徽章", en: "Mangrove Systems-thinking Badge" },
    facts: [
      {
        zh: "红树林与潮汐水文、沉积物和生物多样性相互联系。",
        en: "Mangroves connect tidal hydrology, sediment and biodiversity.",
      },
      {
        zh: "修复前要诊断退化原因，修复后仍需跟踪监测。",
        en: "Restoration begins with degradation diagnosis and continues with monitoring.",
      },
      {
        zh: "树苗存活率只是恢复证据的一部分。",
        en: "Seedling survival is only one part of recovery evidence.",
      },
    ],
    sourceIds: ["forestry-ecosystem", "mangrove-manual", "sengo-wetland"],
    question: {
      prompt: {
        zh: "哪组证据最能支持红树林生态系统正在恢复？",
        en: "Which evidence best supports mangrove ecosystem recovery?",
      },
      options: [
        { zh: "只记录种植数量", en: "Planted-tree count only" },
        {
          zh: "树苗存活、水文、生境与生物记录的长期变化",
          en: "Long-term changes in survival, hydrology, habitat and biodiversity",
        },
        { zh: "一次游客满意度调查", en: "One visitor-satisfaction survey" },
      ],
      answerIndex: 1,
      explanation: {
        zh: "生态系统恢复要看结构、过程和功能，而不仅是树木数量。",
        en: "Ecosystem recovery concerns structure, processes and functions—not tree count alone.",
      },
    },
  },
  {
    id: "patrol-casebook",
    unlockAt: 20,
    title: { zh: "支线三 · 民间河长案件簿", en: "Side Quest III · Citizen River-patrol Casebook" },
    mission: {
      zh: "从《2023年度民间微观察》读取行动规模和巡护照片，区分现象线索与污染源鉴定。",
      en: "Read the 2023 citizen-observation report and separate visible clues from source attribution.",
    },
    reward: { zh: "现场线索徽章", en: "Field-clue Badge" },
    facts: [
      {
        zh: "“1177 人次”是参与人次，不是不重复人数。",
        en: "“1,177 participations” is not 1,177 unique people.",
      },
      {
        zh: "“33,312 公里”是年度涉水行程，不是河流长度。",
        en: "“33,312 km” is annual water-related travel, not river length.",
      },
      {
        zh: "巡护照片能记录位置与现象，原因仍需核查和规范检测。",
        en: "Patrol photos record locations and phenomena; causes require verification and proper testing.",
      },
    ],
    sourceIds: ["sengo-2023-observation", "sengo-water"],
    question: {
      prompt: {
        zh: "巡护照片显示水面有泡沫，最负责任的记录是什么？",
        en: "A patrol photo shows foam on the water. What is the most responsible record?",
      },
      options: [
        {
          zh: "记录时间、位置、天气和泡沫范围，建议复核",
          en: "Record time, location, weather and extent, then recommend verification",
        },
        { zh: "立即写明附近工厂违法排污", en: "Immediately accuse a nearby factory" },
        { zh: "没有仪器就删除照片", en: "Delete the photo because no instrument was used" },
      ],
      answerIndex: 0,
      explanation: {
        zh: "照片是重要线索，但具体原因需要更多证据，不能从外观直接鉴定污染源。",
        en: "A photo is valuable evidence of an observation, but appearance alone cannot identify a pollution source.",
      },
    },
  },
  {
    id: "field-method-lab",
    unlockAt: 28,
    title: { zh: "支线四 · 学生调查方法实验室", en: "Side Quest IV · Student Field-method Lab" },
    mission: {
      zh: "组合监测规范和学生观察指南，设计一份安全、可比较、可复核的班级调查表。",
      en: "Combine monitoring guidance and student-observation practice into a safe, comparable class survey.",
    },
    reward: { zh: "可复核调查徽章", en: "Verifiable-investigation Badge" },
    facts: [
      {
        zh: "比较记录必须尽量统一时间、范围、方法和环境条件。",
        en: "Comparable records should align time, area, method and environmental conditions.",
      },
      {
        zh: "原始记录要保留日期、地点、方法与未测项。",
        en: "Raw records should retain date, place, method and unmeasured fields.",
      },
      {
        zh: "学生安全优先于接近未知排放、深水或危险废物。",
        en: "Student safety takes priority over approaching unknown discharge, deep water or hazardous waste.",
      },
    ],
    sourceIds: ["mee-monitoring", "noaa-debris", "inat-quality"],
    question: {
      prompt: {
        zh: "哪份记录最适合进入班级长期观察库？",
        en: "Which record best belongs in a long-term class observation database?",
      },
      options: [
        { zh: "今天水很差", en: "The water was bad today" },
        { zh: "有照片但没有日期和地点", en: "A photo without date or location" },
        {
          zh: "含日期、坐标、范围、方法、原始观察与现场条件",
          en: "Date, coordinates, area, method, raw observations and field conditions",
        },
      ],
      answerIndex: 2,
      explanation: {
        zh: "结构化原始记录让后来的学生可以复查、重复和比较。",
        en: "Structured raw records allow future students to review, repeat and compare the observation.",
      },
    },
  },
];

export function milestoneAt(count: number) {
  return bonusMilestones.find((milestone) => milestone.stationCount === count);
}
