import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BADGES } from "@/data/tasks";
import { routeStops } from "@/data/route";

export interface Submission {
  id: string;
  taskId: string;
  locationId: string;
  date: string;
  category: string;
  description: string;
  waterColor: string;
  unusual: string;
  contact: string;
  photoName: string;
  createdAt: string;
  stationId?: string;
  weather?: string;
  tide?: string;
  waterFlow?: string;
  odor?: string;
}

export interface StationClaim {
  stationId: string;
  claimedAt: string;
}

export interface HistoryItem {
  id: string;
  type: "任务" | "路线" | "问答" | "观察记录" | "认领";
  label: string;
  at: string;
}

interface AppState {
  completedTasks: string[];
  routeProgress: number; // 已完成站点数
  routeStarted: boolean;
  submissions: Submission[];
  history: HistoryItem[];
  answeredQuiz: string[];
  claimedStations: StationClaim[];
}

const EMPTY: AppState = {
  completedTasks: [],
  routeProgress: 0,
  routeStarted: false,
  submissions: [],
  history: [],
  answeredQuiz: [],
  claimedStations: [],
};

const KEY = "bay-eco-detective-v1";

interface Ctx extends AppState {
  hydrated: boolean;
  badges: { id: string; desc: string; earned: boolean }[];
  routeDone: boolean;
  completeTask: (taskId: string, label: string) => void;
  resetRoute: () => void;
  startRoute: () => void;
  advanceRoute: () => void;
  answerQuiz: (locationId: string, label: string) => void;
  addSubmission: (s: Omit<Submission, "id" | "createdAt">) => void;
  claimStation: (stationId: string, label: string) => void;
  releaseStation: (stationId: string) => void;
  clearAll: () => void;
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
      /* 忽略损坏的本地记录 */
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

  const push = useCallback((s: AppState, item: HistoryItem): AppState => {
    return { ...s, history: [item, ...s.history].slice(0, 100) };
  }, []);

  const completeTask = useCallback(
    (taskId: string, label: string) => {
      setState((s) =>
        s.completedTasks.includes(taskId)
          ? s
          : push(
              { ...s, completedTasks: [...s.completedTasks, taskId] },
              { id: `${taskId}-${Date.now()}`, type: "任务", label, at: new Date().toISOString() },
            ),
      );
    },
    [push],
  );

  const startRoute = useCallback(() => {
    setState((s) => ({ ...s, routeStarted: true, routeProgress: 0 }));
  }, []);

  const advanceRoute = useCallback(() => {
    setState((s) => {
      const next = Math.min(s.routeProgress + 1, routeStops.length);
      const done = next === routeStops.length && s.routeProgress !== next;
      const base = { ...s, routeProgress: next, routeStarted: true };
      return done
        ? push(base, {
            id: `route-${Date.now()}`,
            type: "路线",
            label: "完成「深圳湾生态变化侦探路线」",
            at: new Date().toISOString(),
          })
        : base;
    });
  }, [push]);

  const resetRoute = useCallback(() => {
    setState((s) => ({ ...s, routeProgress: 0, routeStarted: false }));
  }, []);

  const answerQuiz = useCallback(
    (locationId: string, label: string) => {
      setState((s) =>
        s.answeredQuiz.includes(locationId)
          ? s
          : push(
              { ...s, answeredQuiz: [...s.answeredQuiz, locationId] },
              {
                id: `quiz-${locationId}-${Date.now()}`,
                type: "问答",
                label,
                at: new Date().toISOString(),
              },
            ),
      );
    },
    [push],
  );

  const addSubmission = useCallback(
    (s: Omit<Submission, "id" | "createdAt">) => {
      const rec: Submission = {
        ...s,
        id: `sub-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => {
        const withTask = prev.completedTasks.includes(rec.taskId)
          ? prev
          : { ...prev, completedTasks: [...prev.completedTasks, rec.taskId] };
        return push(
          { ...withTask, submissions: [rec, ...withTask.submissions] },
          {
            id: rec.id,
            type: "观察记录",
            label: `提交观察记录（${rec.category}）`,
            at: rec.createdAt,
          },
        );
      });
    },
    [push],
  );

  const claimStation = useCallback(
    (stationId: string, label: string) => {
      setState((state) => {
        if (state.claimedStations.some((claim) => claim.stationId === stationId)) return state;
        const claimedAt = new Date().toISOString();
        return push(
          {
            ...state,
            claimedStations: [{ stationId, claimedAt }, ...state.claimedStations],
          },
          {
            id: `claim-${stationId}-${Date.now()}`,
            type: "认领",
            label: `认领「${label}」`,
            at: claimedAt,
          },
        );
      });
    },
    [push],
  );

  const releaseStation = useCallback((stationId: string) => {
    setState((state) => ({
      ...state,
      claimedStations: state.claimedStations.filter((claim) => claim.stationId !== stationId),
    }));
  }, []);

  const clearAll = useCallback(() => setState(EMPTY), []);

  const routeDone = state.routeProgress >= routeStops.length;

  const badges = useMemo(() => {
    const stationRecords = state.submissions.filter((submission) => submission.stationId).length;
    return [
      ...BADGES.map((b) => ({
        id: b.id,
        desc: b.desc,
        earned: b.rule(state.completedTasks, routeDone),
      })),
      {
        id: "共测守护者",
        desc: "认领至少 1 个共测站并完成 1 次标准化观察",
        earned: state.claimedStations.length > 0 && stationRecords > 0,
      },
    ];
  }, [state.completedTasks, state.submissions, state.claimedStations, routeDone]);

  const value: Ctx = {
    ...state,
    hydrated,
    badges,
    routeDone,
    completeTask,
    startRoute,
    advanceRoute,
    resetRoute,
    answerQuiz,
    addSubmission,
    claimStation,
    releaseStation,
    clearAll,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useAppState 必须在 AppStateProvider 内使用");
  return ctx;
}
