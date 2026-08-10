import type { Language } from "@/lib/language";
import type { EcoLocation } from "@/data/types";

type Bilingual = { zh: string; en: string };

interface StationLesson {
  skill: Bilingual;
  difficulty: "进阶" | "挑战" | "综合";
  scenario: Bilingual;
  question: Bilingual;
  correct: Bilingual;
  distractors: [Bilingual, Bilingual, Bilingual];
  hint: Bilingual;
  explanation: Bilingual;
}

export interface PersonalizedStationQuiz {
  skill: string;
  difficulty: string;
  question: string;
  options: string[];
  answerIndex: number;
  hint: string;
  explanation: string;
  versionLabel: string;
  variantKey: string;
}

const b = (zh: string, en: string): Bilingual => ({ zh, en });

/**
 * The 38 lessons intentionally cover different scientific-literacy skills.
 * They interpret the published rapid-test table without inventing new field results.
 */
const STATION_LESSONS: StationLesson[] = [
  {
    skill: b("观察与推断", "Observation vs inference"),
    difficulty: "进阶",
    scenario: b(
      "你看到了本站的四项快速检测表值，但没有连续监测记录。",
      "You can see four rapid-test entries for this station, but no continuous monitoring record.",
    ),
    question: b(
      "哪一句把“观察到的结果”和“对原因的推断”分得最清楚？",
      "Which statement best separates an observation from an inference about its cause?",
    ),
    correct: b(
      "先原样记录表值；把污染来源写成待验证假设",
      "Record the table values as observed; treat any source explanation as a hypothesis to test",
    ),
    distractors: [
      b("表值一出现就能确定污染企业", "The values immediately identify a polluting company"),
      b("只记录自己的感觉，不保存原值", "Record only your impression and discard the values"),
      b("把一次结果写成长期趋势", "Describe one result as a long-term trend"),
    ],
    hint: b(
      "事实可以直接核对，原因需要额外证据。",
      "A fact can be checked directly; a cause needs additional evidence.",
    ),
    explanation: b(
      "科学记录先保留可核对的观察，再提出可检验的解释，避免把线索写成结论。",
      "Scientific records preserve checkable observations first, then frame testable explanations instead of turning clues into verdicts.",
    ),
  },
  {
    skill: b("pH 对数尺度", "The logarithmic pH scale"),
    difficulty: "挑战",
    scenario: b(
      "本站表中含有 pH 记录。pH 每相差 1 个单位，氢离子活度约相差 10 倍。",
      "This station has a pH entry. A one-unit pH difference represents about a tenfold difference in hydrogen-ion activity.",
    ),
    question: b(
      "比较两个站点的 pH 时，哪种理解正确？",
      "Which interpretation is correct when comparing pH between two stations?",
    ),
    correct: b(
      "pH 不是普通的线性刻度，差 1 不能解释成“只差一点”",
      "pH is not an ordinary linear scale; a one-unit difference is not merely a tiny change",
    ),
    distractors: [
      b("pH 数字翻倍代表酸度翻倍", "Doubling the pH number doubles acidity"),
      b("pH 可以直接告诉我们 COD 数值", "pH directly tells us the COD value"),
      b("一次 pH 就能代表所有季节", "One pH reading represents every season"),
    ],
    hint: b(
      "想想“每 1 个单位约 10 倍”意味着什么。",
      "Think about what ‘about tenfold per unit’ means.",
    ),
    explanation: b(
      "pH 是对数尺度；比较时还应记录温度、时间和方法，不能用它替代其他指标。",
      "pH is logarithmic. Comparisons should also document temperature, time and method, and pH cannot replace other indicators.",
    ),
  },
  {
    skill: b("单位与元数据", "Units and metadata"),
    difficulty: "进阶",
    scenario: b(
      "报告截图保留了范围值，但表头中的单位或方法说明可能不完整。",
      "The report image preserves value ranges, while unit or method details may be incomplete in the visible table.",
    ),
    question: b(
      "把本站数据录入学校数据库时，最负责任的做法是什么？",
      "What is the most responsible way to enter this station into a school database?",
    ),
    correct: b(
      "保留原始字符串，并把缺失单位标为“待核实”",
      "Preserve the original text and mark a missing unit as ‘to be verified’",
    ),
    distractors: [
      b("猜一个常见单位直接填上", "Guess a common unit and enter it as fact"),
      b("把范围全部改成平均数", "Replace every range with its midpoint"),
      b("单位缺失就把数值写成 0", "Write the value as zero when the unit is missing"),
    ],
    hint: b(
      "未知信息不等于零，也不应靠猜测补齐。",
      "Unknown information is not zero and should not be filled by guessing.",
    ),
    explanation: b(
      "保留原文和缺失标记能维持可追溯性，等找到完整方法说明后再更新。",
      "Keeping the source text and a missing-data flag preserves traceability until the full method note is found.",
    ),
  },
  {
    skill: b("读取范围值", "Reading value ranges"),
    difficulty: "进阶",
    scenario: b(
      "本站的部分指标以区间而不是单个数字记录。",
      "Some indicators at this station are recorded as ranges rather than single numbers.",
    ),
    question: b(
      "区间“5–10”最准确的读取方式是什么？",
      "What is the most accurate way to read a range such as ‘5–10’?",
    ),
    correct: b(
      "报告记录落在该区间；不能假装知道精确值",
      "The reported result falls within that interval; the exact value is not known",
    ),
    distractors: [
      b("精确值一定是 7.5", "The exact value must be 7.5"),
      b("代表先测到 5，后来变成 10", "It means the value changed from 5 to 10"),
      b("区间可以当作缺失数据删除", "A range can be deleted as missing data"),
    ],
    hint: b(
      "区间表达的是分辨率或分级，不是一个精确小数。",
      "A range expresses resolution or a band, not an exact decimal.",
    ),
    explanation: b(
      "快速检测常以色阶或档位给出范围；分析时应保留范围，避免制造虚假精度。",
      "Rapid tests often return colour bands or categories. Keeping the range avoids false precision.",
    ),
  },
  {
    skill: b("检出限", "Detection limits"),
    difficulty: "挑战",
    scenario: b(
      "课堂练习中，某指标被记录为“低于检出限”。",
      "In a classroom scenario, an indicator is reported as ‘below the detection limit’.",
    ),
    question: b("这句话能支持哪项结论？", "Which conclusion does that statement support?"),
    correct: b(
      "本方法未能在其检出能力以上测到该物质",
      "The method did not detect the substance above its detection capability",
    ),
    distractors: [
      b("水中绝对没有该物质", "The substance is absolutely absent"),
      b("浓度等于零且无需复测", "The concentration is zero and needs no retest"),
      b("仪器一定发生故障", "The instrument must have failed"),
    ],
    hint: b(
      "“测不到”和“不存在”不是同一件事。",
      "‘Not detected’ and ‘not present’ are not the same.",
    ),
    explanation: b(
      "检出限描述方法能力；需要更灵敏方法时，原来的“未检出”不能改写为绝对零。",
      "A detection limit describes method capability. ‘Not detected’ should not be rewritten as absolute zero.",
    ),
  },
  {
    skill: b("水库停留时间", "Reservoir residence time"),
    difficulty: "挑战",
    scenario: b(
      "本站位于具有蓄水或缓流特征的水体附近。",
      "This station is near water with storage or slow-flow characteristics.",
    ),
    question: b(
      "为什么同一天的一次取样可能不足以描述这里？",
      "Why might one sample on one day be insufficient here?",
    ),
    correct: b(
      "水体停留、分层和放水过程都可能让不同时间或深度的结果不同",
      "Residence, stratification and release operations can produce differences across time or depth",
    ),
    distractors: [
      b("水库里的水永远完全均匀", "Reservoir water is always perfectly uniform"),
      b("站名已经说明全部水质", "The station name already describes all water quality"),
      b("只需在岸上最方便处测一次", "One reading at the easiest shoreline spot is enough"),
    ],
    hint: b(
      "考虑水在这里移动得快不快、混合得均不均。",
      "Consider how fast water moves and how evenly it mixes.",
    ),
    explanation: b(
      "缓流或蓄水环境可能出现时间和垂向差异，因此重复时刻、深度和运行信息都很重要。",
      "Slow-flow or stored waters may vary over time and depth, so repeat timing, depth and operational context matter.",
    ),
  },
  {
    skill: b("上游参考点", "Upstream reference sites"),
    difficulty: "进阶",
    scenario: b(
      "本站可作为河段调查中的上游参考位置。",
      "This station can serve as an upstream reference in a river-reach investigation.",
    ),
    question: b(
      "上游参考点的主要作用是什么？",
      "What is the main purpose of an upstream reference site?",
    ),
    correct: b(
      "提供进入目标河段前的背景条件，用于与下游作可比对照",
      "Provide background conditions before the target reach for a comparable downstream contrast",
    ),
    distractors: [
      b("保证上游一定完全没有人类影响", "Guarantee the upstream site has no human influence"),
      b("替代所有下游采样", "Replace all downstream sampling"),
      b(
        "直接证明下游差异来自某个排口",
        "Directly prove a downstream difference comes from one outfall",
      ),
    ],
    hint: b(
      "参考点是比较基线，不是“绝对纯净”的承诺。",
      "A reference site is a comparison baseline, not a promise of absolute purity.",
    ),
    explanation: b(
      "好的参考点应在方法、时间和水文条件上尽量可比，同时诚实说明其自身也可能受影响。",
      "A useful reference site is comparable in method, timing and hydrology, while acknowledging it may also be influenced.",
    ),
  },
  {
    skill: b("汇流前后对照", "Before–after confluence controls"),
    difficulty: "挑战",
    scenario: b(
      "本站靠近支流与干流交汇区域。",
      "This station is near a tributary–mainstem confluence.",
    ),
    question: b(
      "哪种布点最能判断支流是否与下游变化有关？",
      "Which site layout best tests whether the tributary is associated with a downstream change?",
    ),
    correct: b(
      "支流汇入口上游、支流本身、混合充分后的下游各设可比点",
      "Use comparable sites upstream on the mainstem, in the tributary, and downstream after mixing",
    ),
    distractors: [
      b("只在下游最显眼的位置测一次", "Sample once only at the most visible downstream spot"),
      b("只比较两张不同季节的照片", "Compare only two photographs from different seasons"),
      b("在三个点使用三种不同方法", "Use a different method at each of three sites"),
    ],
    hint: b(
      "需要同时知道进入前、支流输入和混合后的情况。",
      "You need conditions before entry, in the tributary, and after mixing.",
    ),
    explanation: b(
      "三点对照能建立空间链条，但仍需重复采样才能排除短时波动。",
      "A three-site contrast builds a spatial chain, though repeats are still needed to address short-term variation.",
    ),
  },
  {
    skill: b("空间独立性", "Spatial independence"),
    difficulty: "挑战",
    scenario: b(
      "地图上两个点看起来很近，而且可能位于同一段水体。",
      "Two markers appear close and may lie in the same water reach.",
    ),
    question: b(
      "把它们当作两个独立证据前，应先检查什么？",
      "What should be checked before treating them as two independent pieces of evidence?",
    ),
    correct: b(
      "水流连通、点间距离以及一个点是否会直接影响另一个点",
      "Flow connectivity, distance, and whether one site directly influences the other",
    ),
    distractors: [
      b("图标颜色是否一样", "Whether the marker colours match"),
      b("哪一个名称更长", "Which name is longer"),
      b("两点都在同一屏幕就一定独立", "Being on one screen guarantees independence"),
    ],
    hint: b(
      "地图上的两个图标不一定代表两个独立过程。",
      "Two icons on a map do not necessarily represent independent processes.",
    ),
    explanation: b(
      "相邻点可能具有空间自相关；解释样本量时应考虑连通性，而不只是数点。",
      "Nearby sites may be spatially autocorrelated, so connectivity matters when interpreting sample size.",
    ),
  },
  {
    skill: b("重复与伪重复", "Replication vs pseudoreplication"),
    difficulty: "挑战",
    scenario: b(
      "课堂练习中，一杯水被同一试纸连续读了三次。",
      "In a classroom scenario, one cup of water is read three times with the same test strip.",
    ),
    question: b("这能算三个独立水样吗？", "Does this count as three independent water samples?"),
    correct: b(
      "不能；它主要是对同一样本的重复读数，不代表三个独立采样位置或时刻",
      "No; these are repeated readings of one sample, not three independent sites or times",
    ),
    distractors: [
      b("能，因为记录表上有三行", "Yes, because the log has three rows"),
      b("能，只要三个数字不同", "Yes, as long as the three numbers differ"),
      b("不能，所以重复读数完全没有价值", "No, so repeated readings have no value"),
    ],
    hint: b(
      "先区分“测量重复”和“独立采样”。",
      "Distinguish repeated measurement from independent sampling.",
    ),
    explanation: b(
      "技术重复可检查读数稳定性；独立重复则用于描述地点或时间变异，两者回答不同问题。",
      "Technical replicates check reading consistency; independent replicates describe site or time variation.",
    ),
  },
  {
    skill: b("营养盐路径", "Nutrient pathways"),
    difficulty: "进阶",
    scenario: b(
      "本站记录包含总磷（TP）和氨氮（NH₃-N）线索。",
      "This station includes total phosphorus (TP) and ammonia-nitrogen (NH₃-N) clues.",
    ),
    question: b(
      "看到营养盐相关指标后，最合理的下一步是什么？",
      "What is the most reasonable next step after seeing nutrient-related indicators?",
    ),
    correct: b(
      "结合降雨、土地利用和上下游对照，检验多种可能输入路径",
      "Combine rainfall, land use and upstream–downstream controls to test multiple possible input pathways",
    ),
    distractors: [
      b("只凭一个指标锁定唯一来源", "Use one indicator to identify a unique source"),
      b("把 TP 与 pH 当成同一个量", "Treat TP and pH as the same quantity"),
      b("忽略采样时间，因为营养盐不会变化", "Ignore timing because nutrients never change"),
    ],
    hint: b(
      "同一种物质可能通过多条路径进入水体。",
      "The same substance can enter water through multiple pathways.",
    ),
    explanation: b(
      "营养盐线索可来自地表径流、生活排水或沉积物过程等；来源判断需要组合证据。",
      "Nutrient clues may involve runoff, wastewater or sediment processes; source attribution needs combined evidence.",
    ),
  },
  {
    skill: b("COD 的含义", "Interpreting COD"),
    difficulty: "进阶",
    scenario: b(
      "本站表中记录了化学需氧量（COD）范围。",
      "The table records a chemical oxygen demand (COD) range for this station.",
    ),
    question: b("哪项对 COD 的解释最准确？", "Which interpretation of COD is most accurate?"),
    correct: b(
      "它反映样品中可被化学氧化物质的耗氧需求线索，不等于溶解氧读数",
      "It indicates oxygen demand from chemically oxidisable material; it is not a dissolved-oxygen reading",
    ),
    distractors: [
      b("COD 就是水中现有氧气含量", "COD is the oxygen currently present in water"),
      b("COD 能直接给出细菌种类", "COD directly identifies bacterial species"),
      b("COD 与方法和单位无关", "COD is independent of method and units"),
    ],
    hint: b(
      "“需氧量”和“已有多少氧”是两个概念。",
      "‘Oxygen demand’ and ‘oxygen present’ are different concepts.",
    ),
    explanation: b(
      "COD 与有机物等可氧化物质有关；判断生态影响还需溶解氧、流量、温度等信息。",
      "COD relates to oxidisable material. Ecological interpretation also needs dissolved oxygen, flow, temperature and other context.",
    ),
  },
  {
    skill: b("混合区布点", "Sampling a mixing zone"),
    difficulty: "挑战",
    scenario: b(
      "本站位于两股水体可能尚未完全混合的区域。",
      "This station may lie where two water masses are not yet fully mixed.",
    ),
    question: b(
      "如何避免把局部水团误当成整个河宽的情况？",
      "How can a local water patch be avoided as a false representation of the whole channel?",
    ),
    correct: b(
      "记录横断面位置，并在安全条件下设置多个可比横向点",
      "Record cross-channel position and use multiple comparable lateral sites where safely possible",
    ),
    distractors: [
      b("只取颜色最深的一小团水", "Sample only the darkest-looking patch"),
      b("每次随意换到不同岸边", "Switch randomly between banks each visit"),
      b("隐藏具体取样位置", "Hide the exact sampling position"),
    ],
    hint: b(
      "混合区可能在河道横向也不均匀。",
      "A mixing zone can vary across the channel as well as downstream.",
    ),
    explanation: b(
      "横断面位置是关键元数据；多个可比点有助于描述混合，而不是过度概括单个水团。",
      "Cross-channel position is key metadata; comparable lateral sites describe mixing better than one patch.",
    ),
  },
  {
    skill: b("跨界证据协作", "Cross-boundary evidence"),
    difficulty: "综合",
    scenario: b(
      "河流可能跨越不同行政区域，而水体不会在边界处停止流动。",
      "A river may cross administrative areas, while water does not stop at a boundary.",
    ),
    question: b(
      "学校联合调查最应该统一什么？",
      "What should schools standardise in a joint investigation?",
    ),
    correct: b(
      "采样协议、字段名称、时间窗口和质量控制记录",
      "Sampling protocol, field names, time window and quality-control records",
    ),
    distractors: [
      b("只统一地图图标颜色", "Only standardise marker colours"),
      b("各校随意使用不同单位再直接合并", "Let each school use different units and merge directly"),
      b("只保留结果最高的学校", "Keep only the school with the highest result"),
    ],
    hint: b(
      "跨区域比较首先需要数据能互相理解和复核。",
      "Cross-region comparison first requires interoperable, checkable data.",
    ),
    explanation: b(
      "共同协议让不同团队的记录可以比较；行政边界信息可保留，但不能替代水文联系。",
      "A shared protocol makes teams comparable; administrative boundaries remain context, not a substitute for hydrological links.",
    ),
  },
  {
    skill: b("降雨初期冲刷", "First-flush effects"),
    difficulty: "挑战",
    scenario: b(
      "课堂练习比较久旱后的第一场雨与连续降雨后的河水。",
      "A classroom scenario compares the first rain after a dry spell with water after sustained rain.",
    ),
    question: b(
      "为什么必须记录“距离降雨开始多久”？",
      "Why record how long it has been since rainfall began?",
    ),
    correct: b(
      "地表累积物可能在降雨初期集中进入水体，使结果随雨程变化",
      "Accumulated surface material may enter water early, so results can vary through the storm",
    ),
    distractors: [
      b("降雨只改变照片亮度", "Rainfall only changes photo brightness"),
      b("所有雨天结果都应完全相同", "All rainy-day results should be identical"),
      b("有降雨记录就不必记录采样时刻", "A rainfall note makes sampling time unnecessary"),
    ],
    hint: b("同一场雨的前段和后段可能不同。", "Early and late parts of the same storm may differ."),
    explanation: b(
      "采样相对雨程的位置有助于解释径流输入，适合设计雨前、雨中和雨后序列。",
      "Position within a storm helps interpret runoff inputs and supports before–during–after sampling.",
    ),
  },
  {
    skill: b("时间变异", "Temporal variability"),
    difficulty: "进阶",
    scenario: b(
      "本站只有一个日期的快速检测记录。",
      "This station currently has a rapid-test record from one date.",
    ),
    question: b(
      "想了解季节变化，哪种计划最合适？",
      "Which plan is best for learning about seasonal change?",
    ),
    correct: b(
      "在预先设定的多个季节窗口用同一方法重复，并记录水文条件",
      "Repeat with the same method in predefined seasonal windows and record hydrological conditions",
    ),
    distractors: [
      b("把同一天测四次叫作四季", "Call four tests on one day four seasons"),
      b("只在发现异常时才去", "Visit only after finding something unusual"),
      b("每季换一种方法以增加趣味", "Change method each season for variety"),
    ],
    hint: b(
      "季节比较需要跨时间、可重复、条件有记录。",
      "Seasonal comparison needs planned repetition over time with documented conditions.",
    ),
    explanation: b(
      "固定窗口和一致方法减少比较中的混杂；水位、降雨等记录帮助解释真正的季节差异。",
      "Fixed windows and consistent methods reduce confounding; rainfall and water level help explain seasonal patterns.",
    ),
  },
  {
    skill: b("水源地证据边界", "Evidence at a water source"),
    difficulty: "综合",
    scenario: b(
      "本站名称涉及水源或供水设施，因此结论可能受到更高关注。",
      "The station name relates to a water source or supply facility, so claims may receive extra attention.",
    ),
    question: b(
      "学生快速检测结果应该怎样发布？",
      "How should a student rapid-test result be communicated?",
    ),
    correct: b(
      "明确写出学生观察、日期、方法和局限，并建议由有资质监测进一步核实",
      "State that it is a student observation, with date, method and limits, and recommend verification by qualified monitoring",
    ),
    distractors: [
      b("直接宣布饮用水安全或不安全", "Directly declare drinking water safe or unsafe"),
      b("为避免争议删除原始记录", "Delete the raw record to avoid debate"),
      b("只转发没有出处的截图", "Share only an unsourced screenshot"),
    ],
    hint: b(
      "关注度越高，越要清楚说明证据等级。",
      "The higher the stakes, the clearer the evidence level must be.",
    ),
    explanation: b(
      "学生观察可提出线索和问题，但不能替代法定水质评价或供水安全结论。",
      "Student observations can raise clues and questions but do not replace statutory assessment or drinking-water safety decisions.",
    ),
  },
  {
    skill: b("枯水期与丰水期", "Dry and wet seasons"),
    difficulty: "挑战",
    scenario: b(
      "同一河段在枯水期和丰水期的流量、稀释和输入过程可能不同。",
      "The same reach may differ in flow, dilution and inputs between dry and wet seasons.",
    ),
    question: b(
      "比较两季数据前最重要的原则是什么？",
      "What is the most important principle before comparing the two seasons?",
    ),
    correct: b(
      "把季节和流量当作解释变量记录，而不是把差异自动归因于单一污染源",
      "Record season and flow as explanatory variables rather than assigning every difference to one source",
    ),
    distractors: [
      b("丰水期数值一定更低", "Wet-season values are always lower"),
      b("枯水期数值一定更高", "Dry-season values are always higher"),
      b("两季不能进行任何比较", "The seasons can never be compared"),
    ],
    hint: b(
      "稀释和冲刷可能同时发生，方向不一定固定。",
      "Dilution and wash-off can occur together, so direction is not fixed.",
    ),
    explanation: b(
      "季节影响并非简单增减；设计成配对站点、重复年份并记录流量会更有解释力。",
      "Seasonal effects are not a simple increase or decrease; paired sites, repeated years and flow records strengthen interpretation.",
    ),
  },
  {
    skill: b("采样深度", "Sampling depth"),
    difficulty: "进阶",
    scenario: b(
      "课堂练习中，一组取表层水，另一组在更深处取样。",
      "In a classroom scenario, one team samples surface water and another samples deeper water.",
    ),
    question: b("合并两组结果前应该怎么做？", "What should be done before combining the results?"),
    correct: b(
      "先把采样深度作为元数据保留，并判断水体是否可能分层",
      "Retain sampling depth as metadata and assess whether the water may be stratified",
    ),
    distractors: [
      b("直接平均，因为深度从不影响结果", "Average immediately because depth never matters"),
      b("只保留数值较高的一组", "Keep only the group with higher values"),
      b("把深度写成站点名称", "Use depth as the station name"),
    ],
    hint: b(
      "表层和深层不一定处于相同温度、光照或混合状态。",
      "Surface and deeper water may differ in temperature, light and mixing.",
    ),
    explanation: b(
      "采样深度影响可比性；若目标是纵向剖面，应按深度分层报告而不是随意合并。",
      "Depth affects comparability. A vertical profile should report depth layers rather than merge them casually.",
    ),
  },
  {
    skill: b("现场空白与平行样", "Field blanks and duplicates"),
    difficulty: "挑战",
    scenario: b(
      "学生想知道异常是否来自水体，还是来自容器、试剂或操作。",
      "Students want to know whether an anomaly comes from the water or from containers, reagents or handling.",
    ),
    question: b("哪组质量控制最有帮助？", "Which quality-control pair is most useful?"),
    correct: b(
      "加入现场空白检查污染，并设置平行样检查重复性",
      "Use a field blank to check contamination and a duplicate to check repeatability",
    ),
    distractors: [
      b("只多拍几张照片", "Only take more photographs"),
      b("结果异常就手动改成邻站数值", "Replace an anomaly with the neighbouring value"),
      b("不记录试剂批次", "Do not record reagent batch information"),
    ],
    hint: b(
      "一种检查“有没有被带入”，另一种检查“重做是否接近”。",
      "One checks what was introduced; the other checks whether repeating gives a similar result.",
    ),
    explanation: b(
      "空白和重复样回答不同的质量问题，能让异常更容易追踪，而不是直接删除。",
      "Blanks and duplicates address different quality questions and make anomalies traceable instead of simply deleting them.",
    ),
  },
  {
    skill: b("仪器校准", "Instrument calibration"),
    difficulty: "进阶",
    scenario: b(
      "课堂练习中，两台仪器在同一标准液中给出不同读数。",
      "In a classroom scenario, two instruments give different readings in the same standard solution.",
    ),
    question: b(
      "正式比较站点前首先要做什么？",
      "What should be done first before comparing stations?",
    ),
    correct: b(
      "按说明校准并记录校准结果，确认仪器是否在可接受范围内",
      "Calibrate according to instructions and record whether each instrument is within acceptance limits",
    ),
    distractors: [
      b("选读数更好看的仪器", "Choose the instrument with the nicer-looking result"),
      b("把两个读数直接相加", "Add the two readings together"),
      b("忽略差异，因为仪器不会漂移", "Ignore the difference because instruments never drift"),
    ],
    hint: b(
      "先验证测量工具，再解释环境差异。",
      "Validate the measuring tool before interpreting environmental differences.",
    ),
    explanation: b(
      "校准记录是数据质量的一部分；无法通过校准的仪器不应继续产生可比较数据。",
      "Calibration records are part of data quality; an instrument that fails calibration should not generate comparable data.",
    ),
  },
  {
    skill: b("样品标签与交接", "Sample labels and chain of custody"),
    difficulty: "进阶",
    scenario: b(
      "三个小组同时从不同位置采样，瓶子外观完全相同。",
      "Three teams sample different locations at the same time using identical bottles.",
    ),
    question: b(
      "怎样防止回校后无法对应站点？",
      "How can the samples remain linked to their stations after returning to school?",
    ),
    correct: b(
      "现场立即使用唯一编号，并记录地点、时间、采样人和交接过程",
      "Assign a unique ID in the field and log location, time, sampler and handover",
    ),
    distractors: [
      b("靠瓶子摆放顺序记忆", "Rely on bottle order from memory"),
      b("回校后根据颜色猜地点", "Guess the site later from water colour"),
      b("所有瓶子都写“河水”", "Label every bottle ‘river water’"),
    ],
    hint: b("标签要能唯一、及时、可追踪。", "Labels must be unique, timely and traceable."),
    explanation: b(
      "唯一编号和交接记录维持样品身份；一旦身份丢失，精确检测也无法对应真实地点。",
      "Unique IDs and custody records preserve sample identity; precise analysis is useless if the site link is lost.",
    ),
  },
  {
    skill: b("缺失值与零", "Missing values vs zero"),
    difficulty: "进阶",
    scenario: b(
      "本站某一字段没有记录，而另一个字段明确记录为 0。",
      "One field at this station is blank while another is explicitly recorded as zero.",
    ),
    question: b("数据库应如何处理？", "How should the database handle them?"),
    correct: b(
      "缺失值保留为空并注明原因；只有真实测得为零时才记录 0",
      "Keep missing data null with a reason; record zero only when zero was actually measured",
    ),
    distractors: [
      b("所有空白自动填 0", "Automatically fill every blank with zero"),
      b("所有 0 都改为空白", "Turn every zero into a blank"),
      b("删除整条站点记录", "Delete the entire station record"),
    ],
    hint: b(
      "“不知道”与“测得没有”会导致不同分析结果。",
      "‘Unknown’ and ‘measured none’ lead to different analyses.",
    ),
    explanation: b(
      "区分缺失与零能避免低估指标，也让后续补录和质量审查更清楚。",
      "Distinguishing missing from zero prevents underestimation and supports later data completion and quality review.",
    ),
  },
  {
    skill: b("平均数、中位数与异常值", "Mean, median and outliers"),
    difficulty: "挑战",
    scenario: b(
      "课堂练习得到五次读数：4、5、5、6、30。",
      "A classroom exercise produces five readings: 4, 5, 5, 6 and 30.",
    ),
    question: b("最科学的处理方式是什么？", "What is the most scientific way to handle them?"),
    correct: b(
      "同时查看中位数和平均数，核查 30 的现场与质控记录后再决定如何报告",
      "Inspect both median and mean, then review field and QC records for 30 before deciding how to report it",
    ),
    distractors: [
      b("自动删除 30", "Automatically delete 30"),
      b("只报告 30 以吸引注意", "Report only 30 for attention"),
      b("把五个数都改成 5", "Change all five values to 5"),
    ],
    hint: b(
      "异常值可能是错误，也可能是真实事件；先追溯。",
      "An outlier may be an error or a real event; investigate first.",
    ),
    explanation: b(
      "中位数对极端值更稳健，但异常值不应无理由删除；原始记录和质控决定解释。",
      "The median is robust to extremes, but outliers should not be removed without cause; raw records and QC guide interpretation.",
    ),
  },
  {
    skill: b("单位换算与可比性", "Unit conversion and comparability"),
    difficulty: "挑战",
    scenario: b(
      "课堂练习中，一份数据用 mg/L，另一份用 μg/L。",
      "In a classroom scenario, one dataset uses mg/L and another uses μg/L.",
    ),
    question: b("比较前必须做什么？", "What must be done before comparison?"),
    correct: b(
      "核对物质和方法相同，再把单位按 1 mg/L = 1000 μg/L 统一",
      "Confirm substance and method match, then standardise units using 1 mg/L = 1000 μg/L",
    ),
    distractors: [
      b("只比较数字大小", "Compare only the numerical digits"),
      b("把两个单位当作相同", "Treat the units as identical"),
      b("删除数值较小的一份", "Delete the dataset with smaller numbers"),
    ],
    hint: b(
      "相同浓度换单位后数字可相差 1000 倍。",
      "The same concentration can differ numerically by a factor of 1000 after unit conversion.",
    ),
    explanation: b(
      "单位统一是比较的前提，但检测对象、方法和采样条件也必须可比。",
      "Standard units are necessary, while analyte, method and sampling conditions must also be comparable.",
    ),
  },
  {
    skill: b("未测指标的边界", "Limits of unmeasured indicators"),
    difficulty: "进阶",
    scenario: b(
      "本站表中列出 pH、TP、COD 和氨氮，但没有溶解氧（DO）。",
      "The station table lists pH, TP, COD and ammonia nitrogen, but not dissolved oxygen (DO).",
    ),
    question: b(
      "能否据此写出本站 DO 的高低？",
      "Can the station’s DO level be stated from this table?",
    ),
    correct: b(
      "不能；可以提出测 DO 的后续问题，但不能由其他四项直接编出数值",
      "No; DO can be proposed for follow-up, but a value cannot be invented from the other four fields",
    ),
    distractors: [
      b("能，COD 与 DO 永远完全相反", "Yes, COD and DO are always exact opposites"),
      b("能，只要看水色", "Yes, water colour is sufficient"),
      b("能，用 pH 乘以 TP 即可", "Yes, multiply pH by TP"),
    ],
    hint: b(
      "相关线索不等于可以计算出未测数值。",
      "A related clue does not let you calculate an unmeasured value.",
    ),
    explanation: b(
      "不同指标回答不同问题；对未测项目最诚实的状态是“无数据”，再设计测量。",
      "Indicators answer different questions. ‘No data’ is the honest status for an unmeasured variable, followed by a measurement plan.",
    ),
  },
  {
    skill: b("温度影响", "Temperature effects"),
    difficulty: "挑战",
    scenario: b(
      "两个小组在清晨和午后测同一水段，但都未记录水温。",
      "Two teams test the same reach in early morning and afternoon without recording water temperature.",
    ),
    question: b("为什么这会限制解释？", "Why does this limit interpretation?"),
    correct: b(
      "温度会影响化学反应、气体溶解和部分传感器响应，时间差可能混入结果",
      "Temperature affects reactions, gas solubility and some sensor responses, so time-of-day differences may be confounded",
    ),
    distractors: [
      b("温度只影响人的舒适度", "Temperature affects only human comfort"),
      b("午后数据一定错误", "Afternoon data are always wrong"),
      b("只要站点相同就无需环境记录", "The same station needs no environmental metadata"),
    ],
    hint: b(
      "测量对象和测量工具都可能受温度影响。",
      "Both the water and measuring tools can respond to temperature.",
    ),
    explanation: b(
      "记录水温与时刻能提高可比性；若条件不同，应把它们作为解释限制而不是忽略。",
      "Recording temperature and time improves comparability; differing conditions should be reported as limitations.",
    ),
  },
  {
    skill: b("坐标不确定性", "Coordinate uncertainty"),
    difficulty: "挑战",
    scenario: b(
      "报告给出站名，但精确坐标来自后续地名匹配而非原始 GPS。",
      "The report gives a station name, while an exact coordinate was later matched from place names rather than original GPS.",
    ),
    question: b("地图应怎样表达？", "How should the map represent this?"),
    correct: b(
      "保留点位并标注坐标来源与精度限制，避免声称是原始 GPS 点",
      "Keep the marker but state the coordinate source and precision limit rather than claiming original GPS",
    ),
    distractors: [
      b("随意移动到看起来合适的位置", "Move it wherever looks suitable"),
      b("把小数位写得越多就越准确", "More decimal places automatically make it accurate"),
      b("隐藏站名只显示坐标", "Hide the station name and show only coordinates"),
    ],
    hint: b("显示精度不等于来源精度。", "Display precision is not the same as source accuracy."),
    explanation: b(
      "位置元数据也有证据等级；透明说明匹配方法能防止地图制造虚假确定性。",
      "Location metadata also has an evidence level. Disclosing the matching method prevents false certainty.",
    ),
  },
  {
    skill: b("潮汐相位", "Tidal phase"),
    difficulty: "挑战",
    scenario: b(
      "本站接近河口，涨潮与退潮可能改变流向、盐度和稀释。",
      "This station is near an estuary, where flood and ebb tides may alter flow, salinity and dilution.",
    ),
    question: b(
      "重复调查时应增加哪项记录？",
      "Which record should be added during repeat surveys?",
    ),
    correct: b(
      "采样时刻对应的潮汐阶段，并尽量在可比潮相复测",
      "The tidal phase at sampling, with repeats at comparable phases where possible",
    ),
    distractors: [
      b("只记录星期几", "Record only the day of the week"),
      b("假设潮汐每天同一时刻完全相同", "Assume tides are identical at the same clock time daily"),
      b("涨潮时删除所有数据", "Delete all data collected on a flood tide"),
    ],
    hint: b(
      "河口水体会随潮周期往复移动。",
      "Estuarine water moves back and forth through the tidal cycle.",
    ),
    explanation: b(
      "潮相是河口比较的重要背景；不同潮相的数据可研究变化，但不应无条件直接对比。",
      "Tidal phase is key estuarine context. Different phases can be studied, but should not be compared without qualification.",
    ),
  },
  {
    skill: b("盐淡水混合", "Freshwater–saltwater mixing"),
    difficulty: "进阶",
    scenario: b(
      "本站处于淡水与海水相互影响的区域。",
      "This station lies where freshwater and seawater influence each other.",
    ),
    question: b(
      "哪项指标能帮助描述混合背景？",
      "Which indicator can help describe the mixing context?",
    ),
    correct: b(
      "盐度或电导率，并与潮相、流量一起记录",
      "Salinity or conductivity, recorded together with tide and flow",
    ),
    distractors: [
      b("只记录水面反光颜色", "Record only surface glare colour"),
      b("只数地图图标", "Count map markers only"),
      b("用站名猜盐度精确值", "Guess an exact salinity from the station name"),
    ],
    hint: b("需要一个能反映溶解盐分的量。", "Look for a measure related to dissolved salts."),
    explanation: b(
      "盐度或电导率可作为混合线索；结合潮汐和淡水流量才能解释空间变化。",
      "Salinity or conductivity can trace mixing; tide and freshwater flow are needed to interpret spatial change.",
    ),
  },
  {
    skill: b("河口分层", "Estuarine stratification"),
    difficulty: "挑战",
    scenario: b(
      "较轻的淡水可能位于较咸、较密的水体上方。",
      "Lighter freshwater may overlie denser, saltier water.",
    ),
    question: b("只取表层样本可能遗漏什么？", "What might a surface-only sample miss?"),
    correct: b(
      "垂向盐度、温度或溶解氧差异，以及底层水团的状况",
      "Vertical differences in salinity, temperature or dissolved oxygen and conditions in bottom water",
    ),
    distractors: [
      b("河口从不出现垂向差异", "Estuaries never have vertical differences"),
      b("表层一定代表底层", "Surface water always represents bottom water"),
      b("分层只能通过照片确定", "Stratification can be determined from a photograph alone"),
    ],
    hint: b("想象密度不同的水层叠在一起。", "Imagine water layers of different density."),
    explanation: b(
      "河口可能形成盐跃层或温度分层；安全的分层测量能揭示表层样本看不到的过程。",
      "Estuaries may form salinity or temperature stratification; safe depth profiles reveal processes hidden from surface samples.",
    ),
  },
  {
    skill: b("红树林沉积物过程", "Mangrove sediment processes"),
    difficulty: "综合",
    scenario: b(
      "本站靠近红树林或潮滩，水体与沉积物会交换物质。",
      "This station is near mangroves or tidal flats, where water and sediment exchange material.",
    ),
    question: b(
      "为什么只测水体可能不足以解释变化？",
      "Why might water-only sampling be insufficient?",
    ),
    correct: b(
      "潮汐、沉积与再悬浮会在水和底泥之间转移物质，需要结合水文与沉积线索",
      "Tides, deposition and resuspension move material between water and sediment, so hydrological and sediment clues are needed",
    ),
    distractors: [
      b("红树林会让所有指标永久不变", "Mangroves make all indicators permanently constant"),
      b("底泥与上覆水完全隔离", "Sediment is completely isolated from overlying water"),
      b("只需统计树的数量就能得到水质", "Counting trees alone gives water quality"),
    ],
    hint: b(
      "潮水和颗粒会把物质带入、沉降或重新卷起。",
      "Tides and particles can transport, settle and resuspend material.",
    ),
    explanation: b(
      "红树林是动态界面；水样、潮相、浑浊度和沉积观察组合起来更有解释力。",
      "Mangroves are dynamic interfaces. Water samples, tidal phase, turbidity and sediment observations provide a fuller picture.",
    ),
  },
  {
    skill: b("来源归因", "Source attribution"),
    difficulty: "挑战",
    scenario: b(
      "课堂练习中，某点出现异常气味，同时附近有道路、居民区和支流。",
      "In a classroom scenario, an unusual odour occurs near roads, housing and a tributary.",
    ),
    question: b(
      "如何避免“看见谁就怪谁”？",
      "How can the investigation avoid blaming the nearest visible source?",
    ),
    correct: b(
      "列出多个假设，用上下游、雨前雨后和特征指标逐一检验",
      "List multiple hypotheses and test them with upstream–downstream, before–after-rain and diagnostic evidence",
    ),
    distractors: [
      b("选择距离最近的设施作为答案", "Choose the nearest facility as the answer"),
      b("把气味当作唯一化学鉴定", "Use odour as the only chemical identification"),
      b("在社交媒体先公布责任方", "Name a responsible party on social media first"),
    ],
    hint: b("空间接近不等于因果关系。", "Spatial proximity is not causation."),
    explanation: b(
      "来源归因需要排除替代解释；多假设和可证伪的对照能减少确认偏误。",
      "Source attribution must rule out alternatives. Multiple falsifiable hypotheses reduce confirmation bias.",
    ),
  },
  {
    skill: b("生物指标与化学快照", "Biological indicators and chemical snapshots"),
    difficulty: "综合",
    scenario: b(
      "快速化学检测提供某一时刻的快照，而生物群落可能整合更长时间的环境影响。",
      "A rapid chemical test is a momentary snapshot, while biological communities may integrate conditions over longer periods.",
    ),
    question: b("两类证据怎样组合最合理？", "How should the two evidence types be combined?"),
    correct: b(
      "把它们视为时间尺度不同的互补证据，并记录各自方法和限制",
      "Treat them as complementary evidence at different time scales and report each method’s limits",
    ),
    distractors: [
      b("二选一，另一类全部删除", "Choose one and delete the other"),
      b("一次快测能替代全部生物调查", "One rapid test replaces all biological surveys"),
      b("看到一种生物就确定所有污染物", "One organism identifies every pollutant"),
    ],
    hint: b(
      "不同工具可能回答不同时间尺度的问题。",
      "Different tools can answer questions at different time scales.",
    ),
    explanation: b(
      "化学和生物证据相互补充；一致与不一致都能产生新的调查问题。",
      "Chemical and biological evidence complement each other; agreement and disagreement both generate useful questions.",
    ),
  },
  {
    skill: b("可达性偏差", "Accessibility bias"),
    difficulty: "挑战",
    scenario: b(
      "学生只能从道路和开放步道安全观察，偏远河段很少被覆盖。",
      "Students can safely observe only from roads and open paths, leaving remote reaches underrepresented.",
    ),
    question: b("分析地图时应怎样说明？", "How should this be described in map analysis?"),
    correct: b(
      "承认样点偏向易到达位置，结论不自动代表整个流域",
      "Acknowledge that sites favour accessible locations and do not automatically represent the whole basin",
    ),
    distractors: [
      b("有 38 个点就一定完全代表流域", "Thirty-eight points guarantee full basin representation"),
      b("删除所有易到达点", "Delete every accessible site"),
      b("把没有采样的区域填上邻站数值", "Fill unsampled areas with neighbouring values"),
    ],
    hint: b(
      "样点数量多，不代表空间选择没有偏差。",
      "Many sites do not eliminate bias in site selection.",
    ),
    explanation: b(
      "安全优先，但报告应展示覆盖空白；未来可由专业团队补充，而不是插值成事实。",
      "Safety comes first, but coverage gaps should be visible and may guide professional follow-up rather than invented interpolation.",
    ),
  },
  {
    skill: b("重复摄影", "Repeat photography"),
    difficulty: "进阶",
    scenario: b(
      "你想用照片比较本站岸线随时间的变化。",
      "You want to use photographs to compare shoreline change at this station over time.",
    ),
    question: b("怎样提高照片的可比性？", "How can the photographs be made more comparable?"),
    correct: b(
      "固定观察位置、方向、视野和时间条件，并保留原图与拍摄元数据",
      "Fix viewpoint, direction, field of view and timing conditions, and retain originals with metadata",
    ),
    distractors: [
      b("每次选择最漂亮的角度", "Choose the prettiest angle each time"),
      b("只保留经过强滤镜的图片", "Keep only heavily filtered images"),
      b("不同潮位照片直接比较面积", "Compare area directly across different tide levels"),
    ],
    hint: b(
      "让未来的拍摄尽量重现今天的视角和条件。",
      "Make it possible to reproduce today’s viewpoint and conditions.",
    ),
    explanation: b(
      "标准化重复摄影可追踪岸线与植被线索；潮位、天气和镜头差异必须一同解释。",
      "Standardised repeat photography can track shoreline and vegetation clues, with tide, weather and lens differences documented.",
    ),
  },
  {
    skill: b("不确定性表达", "Communicating uncertainty"),
    difficulty: "综合",
    scenario: b(
      "本站只有快速检测范围、一次日期和有限现场信息。",
      "This station has rapid-test ranges, one date and limited field context.",
    ),
    question: b("哪种写法最符合证据？", "Which wording best matches the evidence?"),
    correct: b(
      "“本次快速检测显示……范围；需在可比条件下复测后判断是否持续”",
      "‘This rapid test showed the following range; comparable repeats are needed to determine persistence’",
    ),
    distractors: [
      b("“本站一直严重污染”", "‘This station is always heavily polluted’"),
      b("“结果完全没有任何不确定性”", "‘The result has no uncertainty’"),
      b("“只要不确定就不应记录”", "‘Uncertain evidence should never be recorded’"),
    ],
    hint: b(
      "既说明发现，也说明时间和方法的边界。",
      "State both the finding and its time and method limits.",
    ),
    explanation: b(
      "不确定性不是缺点，而是科学结论的一部分；清楚限定能让后续调查真正接得上。",
      "Uncertainty is part of scientific conclusions. Clear limits make follow-up investigation possible.",
    ),
  },
  {
    skill: b("综合调查设计", "Integrated investigation design"),
    difficulty: "综合",
    scenario: b(
      "你来到 38 站主线的终点，需要把前面学到的方法组合成一个可执行计划。",
      "You have reached the final station and must combine earlier methods into an executable plan.",
    ),
    question: b(
      "哪份方案最完整且仍符合学生安全边界？",
      "Which plan is most complete while staying within student safety limits?",
    ),
    correct: b(
      "由教师组织安全点位；统一方法与单位；记录时间、天气、潮位和质控；设置空间对照并重复；保留原始数据和不确定性",
      "Use teacher-supervised safe sites; standardise methods and units; log time, weather, tide and QC; use spatial controls and repeats; preserve raw data and uncertainty",
    ),
    distractors: [
      b(
        "独自进入河道取一次样并立即发布污染源",
        "Enter the channel alone, sample once and immediately name a source",
      ),
      b(
        "每个点换方法，只保留最高值",
        "Change methods at each site and retain only the highest value",
      ),
      b("用地图截图代替全部原始记录", "Replace all raw records with a map screenshot"),
    ],
    hint: b(
      "完整方案要同时包含安全、可比、质控、对照和透明表达。",
      "A complete plan includes safety, comparability, QC, controls and transparent reporting.",
    ),
    explanation: b(
      "终点不是给出一个夸张结论，而是能够设计可复核、可重复、对学生安全的下一轮调查。",
      "The goal is not a dramatic verdict but a reproducible, reviewable and student-safe next investigation.",
    ),
  },
];

const QUESTION_FRAMES = {
  zh: [
    (name: string, scenario: string, question: string) =>
      `【${name}·证据关】${scenario}${question}`,
    (name: string, scenario: string, question: string) =>
      `你的调查队正在复核${name}。${scenario}${question}`,
    (name: string, scenario: string, question: string) =>
      `同伴向你提交了${name}的记录：${scenario}${question}`,
    (name: string, scenario: string, question: string) =>
      `作为本组数据审查员，请判断${name}的下一步。${scenario}${question}`,
    (name: string, scenario: string, question: string) =>
      `课堂任务情境（不代表新增监测数据）：${scenario}在${name}，${question}`,
    (name: string, scenario: string, question: string) =>
      `要让另一班同学复核${name}，请先解决这个问题：${scenario}${question}`,
  ],
  en: [
    (name: string, scenario: string, question: string) =>
      `[${name} · Evidence checkpoint] ${scenario} ${question}`,
    (name: string, scenario: string, question: string) =>
      `Your investigation team is reviewing ${name}. ${scenario} ${question}`,
    (name: string, scenario: string, question: string) =>
      `A teammate submits a record for ${name}. ${scenario} ${question}`,
    (name: string, scenario: string, question: string) =>
      `As your team’s data reviewer, decide the next step at ${name}. ${scenario} ${question}`,
    (name: string, scenario: string, question: string) =>
      `Classroom scenario (not a new monitoring result): ${scenario} At ${name}, ${question}`,
    (name: string, scenario: string, question: string) =>
      `To make ${name} reviewable by another class, solve this first. ${scenario} ${question}`,
  ],
} as const;

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffledIndices(seed: number) {
  const indices = [0, 1, 2, 3];
  let state = seed || 1;
  for (let index = indices.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [indices[index], indices[swapIndex]] = [indices[swapIndex]!, indices[index]!];
  }
  return indices;
}

export function getPersonalizedStationQuiz(
  location: EcoLocation,
  language: Language,
  learnerSeed: string,
  displayName = location.name,
): PersonalizedStationQuiz | null {
  const sampleNumber = location.waterSample?.sampleNumber;
  if (!sampleNumber) return null;
  const lesson = STATION_LESSONS[sampleNumber - 1];
  if (!lesson) return null;

  const identity = learnerSeed || "local-learner";
  const versionHash = hashString(`${identity}:${location.id}:station-quiz-v2`);
  const frameIndex = versionHash % QUESTION_FRAMES[language].length;
  const frame = QUESTION_FRAMES[language][frameIndex]!;
  const sourceOptions = [lesson.correct, ...lesson.distractors];
  const order = shuffledIndices(hashString(`${identity}:${location.id}:option-order-v2`));
  const options = order.map((index) => sourceOptions[index]![language]);
  const answerIndex = order.indexOf(0);
  const versionNumber = String((versionHash % 997) + 1).padStart(3, "0");

  return {
    skill: lesson.skill[language],
    difficulty:
      language === "zh"
        ? lesson.difficulty
        : lesson.difficulty === "进阶"
          ? "Advanced"
          : lesson.difficulty === "挑战"
            ? "Challenge"
            : "Synthesis",
    question: frame(displayName, lesson.scenario[language], lesson.question[language]),
    options,
    answerIndex,
    hint: lesson.hint[language],
    explanation: lesson.explanation[language],
    versionLabel: language === "zh" ? `个人题本 ${versionNumber}` : `Personal set ${versionNumber}`,
    variantKey: `${location.id}-${frameIndex}-${order.join("")}`,
  };
}

export const STATION_LESSON_COUNT = STATION_LESSONS.length;
