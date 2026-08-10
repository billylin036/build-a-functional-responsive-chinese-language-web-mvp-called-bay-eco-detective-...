import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { samplingQuestRegions } from "@/data/exploration";
import { bonusMilestones, librarySideQuests } from "@/data/game-quests";
import { TOTAL_CHAPTERS } from "@/data/learning";
import { locations } from "@/data/locations";
import {
  joinLearningClass,
  restoreLearningProfile,
  saveLearningProgress,
} from "@/lib/classroom-cloud";

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

export interface ClassroomLink {
  profileId: string;
  classCode: string;
  className: string;
  displayName: string;
  recoveryCode: string;
}

export type CloudSyncStatus = "local" | "connecting" | "syncing" | "synced" | "error";

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
const CLASSROOM_LINK_KEY = "bay-eco-classroom-link-v1";

function normalizeProgress(progress: Partial<AppState> | Record<string, unknown>): AppState {
  return { ...EMPTY, ...(progress as Partial<AppState>) };
}

interface Ctx extends AppState {
  hydrated: boolean;
  classroomLink: ClassroomLink | null;
  cloudSyncStatus: CloudSyncStatus;
  cloudSyncError: string | null;
  cloudLastSyncedAt: string | null;
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
  joinClassroom: (classCode: string, displayName: string) => Promise<ClassroomLink>;
  restoreClassroom: (classCode: string, recoveryCode: string) => Promise<ClassroomLink>;
  disconnectClassroom: () => void;
  retryCloudSync: () => Promise<void>;
  resetLearning: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [classroomLink, setClassroomLink] = useState<ClassroomLink | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>("local");
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const [cloudLastSyncedAt, setCloudLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(normalizeProgress(JSON.parse(raw) as Partial<AppState>));
      const classroomRaw = localStorage.getItem(CLASSROOM_LINK_KEY);
      if (classroomRaw) setClassroomLink(JSON.parse(classroomRaw) as ClassroomLink);
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

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (classroomLink) {
        localStorage.setItem(CLASSROOM_LINK_KEY, JSON.stringify(classroomLink));
      } else {
        localStorage.removeItem(CLASSROOM_LINK_KEY);
      }
    } catch {
      /* 本地存储不可用时仍可继续本次会话 */
    }
  }, [classroomLink, hydrated]);

  useEffect(() => {
    if (!hydrated || !classroomLink || cloudReady) return;
    let cancelled = false;
    setCloudSyncStatus("connecting");
    setCloudSyncError(null);
    void restoreLearningProfile(classroomLink.classCode, classroomLink.recoveryCode)
      .then((restored) => {
        if (cancelled) return;
        setState(normalizeProgress(restored.progress));
        setClassroomLink((current) =>
          current
            ? {
                ...current,
                profileId: restored.profileId,
                className: restored.className,
                displayName: restored.displayName,
              }
            : current,
        );
        setCloudReady(true);
        setCloudSyncStatus("synced");
        setCloudLastSyncedAt(restored.updatedAt);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setCloudSyncStatus("error");
        setCloudSyncError(error instanceof Error ? error.message : "CLOUD_REQUEST_FAILED");
      });
    return () => {
      cancelled = true;
    };
  }, [classroomLink, cloudReady, hydrated]);

  useEffect(() => {
    if (!hydrated || !classroomLink || !cloudReady) return;
    const timer = window.setTimeout(() => {
      setCloudSyncStatus("syncing");
      setCloudSyncError(null);
      void saveLearningProgress(classroomLink.profileId, classroomLink.recoveryCode, state)
        .then(() => {
          setCloudSyncStatus("synced");
          setCloudLastSyncedAt(new Date().toISOString());
        })
        .catch((error: unknown) => {
          setCloudSyncStatus("error");
          setCloudSyncError(error instanceof Error ? error.message : "CLOUD_REQUEST_FAILED");
        });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [classroomLink, cloudReady, hydrated, state]);

  const joinClassroom = useCallback(
    async (classCode: string, displayName: string) => {
      setCloudSyncStatus("connecting");
      setCloudSyncError(null);
      try {
        const link = await joinLearningClass(classCode, displayName);
        await saveLearningProgress(link.profileId, link.recoveryCode, state);
        setClassroomLink(link);
        setCloudReady(true);
        setCloudSyncStatus("synced");
        setCloudLastSyncedAt(new Date().toISOString());
        return link;
      } catch (error) {
        setCloudSyncStatus("error");
        setCloudSyncError(error instanceof Error ? error.message : "CLOUD_REQUEST_FAILED");
        throw error;
      }
    },
    [state],
  );

  const restoreClassroom = useCallback(async (classCode: string, recoveryCode: string) => {
    setCloudSyncStatus("connecting");
    setCloudSyncError(null);
    try {
      const restored = await restoreLearningProfile(classCode, recoveryCode);
      const link: ClassroomLink = {
        profileId: restored.profileId,
        classCode: classCode
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, ""),
        className: restored.className,
        displayName: restored.displayName,
        recoveryCode: recoveryCode.trim().toUpperCase().replace(/\s+/g, ""),
      };
      setState(normalizeProgress(restored.progress));
      setClassroomLink(link);
      setCloudReady(true);
      setCloudSyncStatus("synced");
      setCloudLastSyncedAt(restored.updatedAt);
      return link;
    } catch (error) {
      setCloudSyncStatus("error");
      setCloudSyncError(error instanceof Error ? error.message : "CLOUD_REQUEST_FAILED");
      throw error;
    }
  }, []);

  const disconnectClassroom = useCallback(() => {
    setClassroomLink(null);
    setCloudReady(false);
    setCloudSyncStatus("local");
    setCloudSyncError(null);
    setCloudLastSyncedAt(null);
  }, []);

  const retryCloudSync = useCallback(async () => {
    if (!classroomLink) return;
    setCloudSyncStatus("syncing");
    setCloudSyncError(null);
    try {
      if (!cloudReady) {
        const restored = await restoreLearningProfile(
          classroomLink.classCode,
          classroomLink.recoveryCode,
        );
        setState(normalizeProgress(restored.progress));
        setClassroomLink((current) =>
          current
            ? {
                ...current,
                profileId: restored.profileId,
                className: restored.className,
                displayName: restored.displayName,
              }
            : current,
        );
        setCloudLastSyncedAt(restored.updatedAt);
      } else {
        await saveLearningProgress(classroomLink.profileId, classroomLink.recoveryCode, state);
        setCloudLastSyncedAt(new Date().toISOString());
      }
      setCloudReady(true);
      setCloudSyncStatus("synced");
    } catch (error) {
      setCloudSyncStatus("error");
      setCloudSyncError(error instanceof Error ? error.message : "CLOUD_REQUEST_FAILED");
      throw error;
    }
  }, [classroomLink, cloudReady, state]);

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
    classroomLink,
    cloudSyncStatus,
    cloudSyncError,
    cloudLastSyncedAt,
    learningComplete,
    badges,
    recordLocationAnswer,
    completeChapter,
    saveActivityRecord,
    completeFinalAssessment,
    recordBonusAnswer,
    recordSideQuestAnswer,
    updateLearnerProfile,
    joinClassroom,
    restoreClassroom,
    disconnectClassroom,
    retryCloudSync,
    resetLearning,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useAppState 必须在 AppStateProvider 内使用");
  return ctx;
}
