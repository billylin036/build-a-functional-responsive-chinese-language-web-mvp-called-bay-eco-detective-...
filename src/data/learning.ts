import { locations } from "./locations";

export interface LearningSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  useFor: string;
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

export const TOTAL_LEARNING_POINTS = locations.length;
export const FINAL_PASS_SCORE = 6;

export const learningSources: LearningSource[] = [
  {
    id: "forestry-ecosystem",
    title: "红树林生态系统有多重要？",
    publisher: "国家林业和草原局",
    url: "https://www.forestry.gov.cn/c/www/sd/556199.jhtml",
    useFor: "红树林生态功能、潮汐联系与生物多样性",
  },
  {
    id: "mangrove-manual",
    title: "《红树林生态修复手册》解读",
    publisher: "国家林业和草原局",
    url: "https://www.forestry.gov.cn/c/www/gkzcjd/43663.jhtml",
    useFor: "修复原则、退化诊断、跟踪监测与适应性管理",
  },
  {
    id: "mee-monitoring",
    title: "地表水环境质量监测技术规范 HJ 91.2—2022",
    publisher: "中华人民共和国生态环境部",
    url: "https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202205/t20220506_977066.shtml",
    useFor: "监测布点、采样、原始记录与质量控制",
  },
  {
    id: "mee-indicators",
    title: "国家地表水“9+X”监测与“5+X”评价说明",
    publisher: "中华人民共和国生态环境部",
    url: "https://www.mee.gov.cn/xxgk2018/xxgk/xxgk15/202012/t20201228_815116.html",
    useFor: "水温、pH、浊度、溶解氧、氨氮等指标的含义与限制",
  },
  {
    id: "noaa-debris",
    title: "Marine Debris Monitoring Toolkit for Educators",
    publisher: "NOAA Marine Debris Program",
    url: "https://marinedebris.noaa.gov/curricula/marine-debris-monitoring-toolkit-educators",
    useFor: "面向学生的标准化岸线垃圾调查、分类、记录与分析",
  },
  {
    id: "wetland-birds",
    title: "Hong Kong Wetland Park School Education Programme",
    publisher: "香港湿地公园",
    url: "https://www.wetlandpark.gov.hk/filemanager/files/public/education/Outline_SB_ENG_2020.pdf",
    useFor: "鸟类生态调查、栖息地比较与户外学习",
  },
  {
    id: "inat-quality",
    title: "iNaturalist 教育者指南与观察数据质量说明",
    publisher: "iNaturalist",
    url: "https://help.inaturalist.org/en/support/solutions/articles/151000170805-inaturalist-educator-s-guide",
    useFor: "日期、位置、影像证据、隐私与生物观察质量",
  },
  {
    id: "outfall-source",
    title: "深圳湾排水口调查公开资料",
    publisher: "深圳市绿源环保志愿者协会",
    url: "https://www.szhb.org/5383.html",
    useFor: "地图中 11 个排口的公开编号与 GPS 坐标",
  },
];

export const learningChapters = [
  {
    id: "mangrove",
    title: "第一章 · 红树林修复推理",
    description: "从成活率走向生态系统判断：比较水动力、潮沟、人类干扰与长期监测。",
    locations: locations.filter((location) => location.type === "mangrove"),
  },
  {
    id: "outfall",
    title: "第二章 · 水环境证据侦探",
    description: "学习采样设计、缺失数据、质量控制、因果推断和趋势判断，而不是背编号。",
    locations: locations.filter((location) => location.type === "outfall"),
  },
  {
    id: "learning",
    title: "第三章 · 生物多样性与岸线调查",
    description: "用固定时段鸟类计数和标准样带垃圾调查，把观察变成可比较的数据。",
    locations: locations.filter((location) => location.type === "learning"),
  },
] as const;

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
        "当前 88% 的成活率",
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
