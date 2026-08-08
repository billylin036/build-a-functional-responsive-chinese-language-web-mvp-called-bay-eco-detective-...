export type LocationType = "mangrove" | "outfall" | "task";

export type RiskLevel = "低" | "中" | "高";

export interface AnnualData {
  year: number;
  /** 水质综合评分 0-100 */
  waterQuality: number;
  /** 排口过水情况：有水 / 微流 / 干涸 */
  waterFlow: "有水" | "微流" | "干涸";
  /** 红树林覆盖度 % */
  mangroveCoverage: number;
  /** 成活率 % */
  survivalRate: number;
  /** 当年公众观察记录数 */
  observationCount: number;
  event?: string;
}

export interface EcoLocation {
  id: string;
  name: string;
  type: LocationType;
  longitude: number;
  latitude: number;
  summary: string;
  story: {
    what: string;
    why: string;
    matter: string;
    action: string;
  };
  image: string;
  category: string;
  restorationYear?: number;
  /** 公顷 */
  restorationArea?: number;
  plantedCount?: number;
  survivalRate?: number;
  condition?: string;
  risks?: string[];
  waterStatus?: string;
  indicators?: { label: string; value: string }[];
  riskLevel: RiskLevel;
  annualData: AnnualData[];
  relatedTasks: string[];
}

export interface EcoTask {
  id: string;
  title: string;
  locationId: string;
  category: string;
  difficulty: "入门" | "进阶" | "挑战";
  duration: string;
  description: string;
  instructions: string[];
  safetyNotes: string;
  badge: string;
}

export interface RouteStop {
  locationId: string;
  question: string;
  hint: string;
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explain: string;
  };
}
