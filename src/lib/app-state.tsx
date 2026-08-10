import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { samplingQuestRegions } from "@/data/exploration";
import { bonusMilestones, librarySideQuests } from "@/data/game-quests";
import { TOTAL_CHAPTERS } from "@/data/learning";
import { locations } from "@/data/locations";

const VALID_LOCATION_IDS = new Set(locations.map((location) => location.id));

export interface LearnerProfile {
  name: string;
  school: string;
  className: string;
}

export interface FinalAssessmentResult {
  score: number;
  total: number;
  completedAt: string;
  certificateId: string;
}

export interface LearningHistoryItem {
  id: string;
  type: "地点测验" | "章节测验" | "互动观察" | "综合测验" | "奖励解锁" | "支线任务";
  label: string;
  at: string;
}

export interface ActivityRecord {
  id: string;
  locationId: string;
  locationName: string;
  activityTitle: string;
  responses: Record<string, string>;
  completedAt: string;
}

interface AppState {
  completedLocationQuizzes: string[];
  quizAttempts: Record<string, number>;
  completedChapters: string[];
  chapterAttempts: Record<string, number>;
  finalAssessment: FinalAssessmentResult | null;
  learnerProfile: LearnerProfile;
  learningHistory: LearningHistoryItem[];
  activityRecords: ActivityRecord[];
  completedBonusQuestions: string[];
  bonusAttempts: Record<string, number>;
  completedSideQuests: string[];
  sideQuestAttempts: Record<string, number>;
}

const EMPTY: AppState = {
  completedLocationQuizzes: [],
  quizAttempts: {},
  completedChapters: [],
  chapterAttempts: {},
  finalAssessment: null,
  learnerProfile: { name: "", school: "", className: "" },
  learningHistory: [],
  activityRecords: [],
  completedBonusQuestions: [],
  bonusAttempts: {},
  completedSideQuests: [],
  sideQuestAttempts: {},
};

const KEY = "bay-eco-school-learning-v3";

interface Ctx extends AppState {
  hydrated: boolean;
  learningComplete: boolean;
  badges: { id: string; desc: string; earned: boolean }[];
  recordLocationAnswer: (locationId: string, locationName: string, correct: boolean) => void;
  completeChapter: (chapterId: string, chapterTitle: string, attempts: number) => void;
  saveActivityRecord: (
    locationId: string,
    locationName: string,
    activityTitle: string,
    responses: Record<string, string>,
  ) => void;
  completeFinalAssessment: (score: number, total: number) => void;
  recordBonusAnswer: (bonusId: string, rewardTitle: string, correct: boolean) => void;
  recordSideQuestAnswer: (questId: string, rewardTitle: string, correct: boolean) => void;
  updateLearnerProfile: (profile: LearnerProfile) => void;
  resetLearning: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as Partial<AppState>) });
    } catch {
      /* 忽略损坏的本地学习记录 */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* 存储不可用时静默降级 */
    }
  }, [state, hydrated]);

  const recordLocationAnswer = useCallback(
    (locationId: string, locationName: string, correct: boolean) => {
      setState((current) => {
        const attempts = (current.quizAttempts[locationId] ?? 0) + 1;
        const quizAttempts = { ...current.quizAttempts, [locationId]: attempts };
        if (!correct || current.completedLocationQuizzes.includes(locationId)) {
          return { ...current, quizAttempts };
        }
        const at = new Date().toISOString();
        return {
          ...current,
          quizAttempts,
          completedLocationQuizzes: [...current.completedLocationQuizzes, locationId],
          learningHistory: [
            {
              id: `location-${locationId}-${Date.now()}`,
              type: "地点测验" as const,
              label: `完成「${locationName}」学习测验`,
              at,
            },
            ...current.learningHistory,
          ].slice(0, 100),
        };
      });
    },
    [],
  );

  const completeChapter = useCallback(
    (chapterId: string, chapterTitle: string, attempts: number) => {
      setState((current) => {
        const chapterAttempts = {
          ...current.chapterAttempts,
          [chapterId]: Math.max(current.chapterAttempts[chapterId] ?? 0, attempts),
        };
        if (current.completedChapters.includes(chapterId)) {
          return { ...current, chapterAttempts };
        }
        const at = new Date().toISOString();
        return {
          ...current,
          chapterAttempts,
          completedChapters: [...current.completedChapters, chapterId],
          learningHistory: [
            {
              id: `chapter-${chapterId}-${Date.now()}`,
              type: "章节测验" as const,
              label: `完成「${chapterTitle}」连续测验`,
              at,
            },
            ...current.learningHistory,
          ].slice(0, 100),
        };
      });
    },
    [],
  );

  const completeFinalAssessment = useCallback((score: number, total: number) => {
    const completedAt = new Date().toISOString();
    const certificateId = `SZBE-${completedAt.slice(0, 10).replaceAll("-", "")}-${Date.now().toString().slice(-6)}`;
    setState((current) => ({
      ...current,
      finalAssessment: { score, total, completedAt, certificateId },
      learningHistory: [
        {
          id: `final-${Date.now()}`,
          type: "综合测验" as const,
          label: `通过深圳湾生态综合测验（${score}/${total}）`,
          at: completedAt,
        },
        ...current.learningHistory,
      ].slice(0, 100),
    }));
  }, []);

  const recordBonusAnswer = useCallback(
    (bonusId: string, rewardTitle: string, correct: boolean) => {
      setState((current) => {
        const attempts = (current.bonusAttempts[bonusId] ?? 0) + 1;
        const bonusAttempts = { ...current.bonusAttempts, [bonusId]: attempts };
        if (!correct || current.completedBonusQuestions.includes(bonusId)) {
          return { ...current, bonusAttempts };
        }
        const at = new Date().toISOString();
        return {
          ...current,
          bonusAttempts,
          completedBonusQuestions: [...current.completedBonusQuestions, bonusId],
          learningHistory: [
            {
              id: `bonus-${bonusId}-${Date.now()}`,
              type: "奖励解锁" as const,
              label: `答对 Bonus Question，获得「${rewardTitle}」`,
              at,
            },
            ...current.learningHistory,
          ].slice(0, 100),
        };
      });
    },
    [],
  );

  const recordSideQuestAnswer = useCallback(
    (questId: string, rewardTitle: string, correct: boolean) => {
      setState((current) => {
        const attempts = (current.sideQuestAttempts[questId] ?? 0) + 1;
        const sideQuestAttempts = { ...current.sideQuestAttempts, [questId]: attempts };
        if (!correct || current.completedSideQuests.includes(questId)) {
          return { ...current, sideQuestAttempts };
        }
        const at = new Date().toISOString();
        return {
          ...current,
          sideQuestAttempts,
          completedSideQuests: [...current.completedSideQuests, questId],
          learningHistory: [
            {
              id: `side-quest-${questId}-${Date.now()}`,
              type: "支线任务" as const,
              label: `完成资料库支线，获得「${rewardTitle}」`,
              at,
            },
            ...current.learningHistory,
          ].slice(0, 100),
        };
      });
    },
    [],
  );

  const saveActivityRecord = useCallback(
    (
      locationId: string,
      locationName: string,
      activityTitle: string,
      responses: Record<string, string>,
    ) => {
      const completedAt = new Date().toISOString();
      const record: ActivityRecord = {
        id: `activity-${locationId}-${Date.now()}`,
        locationId,
        locationName,
        activityTitle,
        responses,
        completedAt,
      };
      setState((current) => ({
        ...current,
        activityRecords: [record, ...current.activityRecords].slice(0, 100),
        learningHistory: [
          {
            id: record.id,
            type: "互动观察" as const,
            label: `完成「${locationName}」${activityTitle}`,
            at: completedAt,
          },
          ...current.learningHistory,
        ].slice(0, 100),
      }));
    },
    [],
  );

  const updateLearnerProfile = useCallback((profile: LearnerProfile) => {
    setState((current) => ({ ...current, learnerProfile: profile }));
  }, []);

  const resetLearning = useCallback(() => setState(EMPTY), []);
  const learningComplete = state.completedChapters.length >= TOTAL_CHAPTERS;
  const completedLocationQuizzes = useMemo(
    () => state.completedLocationQuizzes.filter((id) => VALID_LOCATION_IDS.has(id)),
    [state.completedLocationQuizzes],
  );
  const quizAttempts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(state.quizAttempts).filter(([id]) => VALID_LOCATION_IDS.has(id)),
      ),
    [state.quizAttempts],
  );

  const badges = useMemo(
    () => [
      {
        id: "生态课程启航者",
        desc: "完成至少 1 个章节连续测验",
        earned: state.completedChapters.length >= 1,
      },
      {
        id: "深圳湾学习者",
        desc: `完成全部 ${TOTAL_CHAPTERS} 个学习章节`,
        earned: learningComplete,
      },
      {
        id: "生态数据侦探",
        desc: "通过深圳湾生态综合测验并获得学习证书",
        earned: Boolean(state.finalAssessment),
      },
      {
        id: "公民科学观察员",
        desc: "完成至少 3 次互动观察并保存规范记录",
        earned: state.activityRecords.length >= 3,
      },
      ...samplingQuestRegions.map((region) => ({
        id: region.badge,
        desc: `完成「${region.title}」任意 ${region.badgeThreshold} 个真实采样点微测验`,
        earned:
          region.sampleIds.filter((id) => completedLocationQuizzes.includes(id)).length >=
          region.badgeThreshold,
      })),
      ...bonusMilestones.map((milestone) => ({
        id: milestone.reward.zh,
        desc: `主线完成 ${milestone.stationCount} 站并答对 Bonus Question`,
        earned: state.completedBonusQuestions.includes(milestone.id),
      })),
      ...librarySideQuests.map((quest) => ({
        id: quest.reward.zh,
        desc: `完成资料库支线「${quest.title.zh.replace(/^支线. · /, "")}」`,
        earned: state.completedSideQuests.includes(quest.id),
      })),
    ],
    [
      learningComplete,
      completedLocationQuizzes,
      state.activityRecords.length,
      state.completedChapters.length,
      state.completedBonusQuestions,
      state.completedSideQuests,
      state.finalAssessment,
    ],
  );

  const value: Ctx = {
    ...state,
    completedLocationQuizzes,
    quizAttempts,
    hydrated,
    learningComplete,
    badges,
    recordLocationAnswer,
    completeChapter,
    saveActivityRecord,
    completeFinalAssessment,
    recordBonusAnswer,
    recordSideQuestAnswer,
    updateLearnerProfile,
    resetLearning,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useAppState 必须在 AppStateProvider 内使用");
  return ctx;
}
