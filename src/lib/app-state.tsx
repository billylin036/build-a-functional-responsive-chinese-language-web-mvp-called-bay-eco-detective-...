import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { TOTAL_LEARNING_POINTS } from "@/data/learning";

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
  type: "地点测验" | "综合测验";
  label: string;
  at: string;
}

interface AppState {
  completedLocationQuizzes: string[];
  quizAttempts: Record<string, number>;
  finalAssessment: FinalAssessmentResult | null;
  learnerProfile: LearnerProfile;
  learningHistory: LearningHistoryItem[];
}

const EMPTY: AppState = {
  completedLocationQuizzes: [],
  quizAttempts: {},
  finalAssessment: null,
  learnerProfile: { name: "", school: "", className: "" },
  learningHistory: [],
};

const KEY = "bay-eco-school-learning-v2";

interface Ctx extends AppState {
  hydrated: boolean;
  learningComplete: boolean;
  badges: { id: string; desc: string; earned: boolean }[];
  recordLocationAnswer: (locationId: string, locationName: string, correct: boolean) => void;
  completeFinalAssessment: (score: number, total: number) => void;
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

  const updateLearnerProfile = useCallback((profile: LearnerProfile) => {
    setState((current) => ({ ...current, learnerProfile: profile }));
  }, []);

  const resetLearning = useCallback(() => setState(EMPTY), []);
  const learningComplete = state.completedLocationQuizzes.length >= TOTAL_LEARNING_POINTS;

  const badges = useMemo(
    () => [
      {
        id: "数据点探索者",
        desc: "完成至少 1 个地图数据点测验",
        earned: state.completedLocationQuizzes.length >= 1,
      },
      {
        id: "深圳湾学习者",
        desc: `完成全部 ${TOTAL_LEARNING_POINTS} 个地图数据点测验`,
        earned: learningComplete,
      },
      {
        id: "生态数据侦探",
        desc: "通过深圳湾生态综合测验并获得学习证书",
        earned: Boolean(state.finalAssessment),
      },
    ],
    [learningComplete, state.completedLocationQuizzes.length, state.finalAssessment],
  );

  const value: Ctx = {
    ...state,
    hydrated,
    learningComplete,
    badges,
    recordLocationAnswer,
    completeFinalAssessment,
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
