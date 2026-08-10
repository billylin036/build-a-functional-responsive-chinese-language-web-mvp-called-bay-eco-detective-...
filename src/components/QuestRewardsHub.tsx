import { useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  Gift,
  LockKeyhole,
  Map,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SAMPLING_QUEST_IDS } from "@/data/exploration";
import type { BonusMilestone, LibrarySideQuest } from "@/data/game-quests";
import { bonusMilestones, librarySideQuests } from "@/data/game-quests";
import { getLearningSources } from "@/data/learning";
import { useAppState } from "@/lib/app-state";
import type { Language } from "@/lib/language";

function text(value: { zh: string; en: string }, language: Language) {
  return value[language];
}

export default function QuestRewardsHub({ language }: { language: Language }) {
  const {
    completedLocationQuizzes,
    completedBonusQuestions,
    completedSideQuests,
    recordBonusAnswer,
    recordSideQuestAnswer,
  } = useAppState();
  const completedStations = SAMPLING_QUEST_IDS.filter((id) =>
    completedLocationQuizzes.includes(id),
  ).length;
  const nextMilestone = bonusMilestones.find(
    (milestone) => !completedBonusQuestions.includes(milestone.id),
  );

  return (
    <section id="quest-rewards" className="mt-8 scroll-mt-20 space-y-6">
      <div className="overflow-hidden rounded-xl border border-amber-300/40 bg-gradient-to-br from-amber-50 via-card to-paleeco">
        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
          <div>
            <Badge className="bg-amber-500 text-white hover:bg-amber-500">
              <Sparkles className="mr-1 size-3.5" />
              {language === "zh" ? "主线惊喜奖励" : "MAIN-QUEST SURPRISES"}
            </Badge>
            <h2 className="mt-3 text-xl font-semibold text-navy sm:text-2xl">
              {language === "zh"
                ? "走几站，就会遇见一个隐藏 Bonus"
                : "Hidden bonuses along the 38-station journey"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              {language === "zh"
                ? "完成指定站数会解锁一道 Bonus Question。答对才会揭晓调查装备；完成第 38 站并破解终极题，可获得全主线大奖。"
                : "Reach a station milestone to unlock a bonus question. Answer correctly to reveal an investigation tool; finish station 38 and solve the final bonus for the main-quest grand prize."}
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-navy">
                {language === "zh" ? "下一份惊喜" : "Next surprise"}
              </span>
              <span className="font-mono text-amber-700">
                {nextMilestone ? `${nextMilestone.stationCount} / 38` : "COMPLETE"}
              </span>
            </div>
            <Progress
              value={nextMilestone ? (completedStations / nextMilestone.stationCount) * 100 : 100}
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {language === "zh"
                ? `主线 ${completedStations}/38 · 已领取 ${completedBonusQuestions.length}/${bonusMilestones.length} 份奖励`
                : `Main quest ${completedStations}/38 · ${completedBonusQuestions.length}/${bonusMilestones.length} rewards claimed`}
            </p>
          </div>
        </div>

        <div className="grid border-t border-amber-200/60 md:grid-cols-2 xl:grid-cols-4">
          {bonusMilestones.map((milestone) => (
            <BonusCard
              key={milestone.id}
              milestone={milestone}
              language={language}
              completedStations={completedStations}
              claimed={completedBonusQuestions.includes(milestone.id)}
              onAnswer={(correct) => recordBonusAnswer(milestone.id, milestone.reward.zh, correct)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#4F46E5]/25 bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge className="bg-[#4F46E5] text-white hover:bg-[#4F46E5]">
              <Map className="mr-1 size-3.5" />
              {language === "zh" ? "资料库支线" : "SOURCE-LIBRARY SIDE QUESTS"}
            </Badge>
            <h2 className="mt-3 text-xl font-semibold text-navy">
              {language === "zh"
                ? "离开主路，破解四份真实资料档案"
                : "Leave the main path and investigate four source files"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              {language === "zh"
                ? "支线不虚构新点位：它们分别来自绿源排口调查、红树林项目、2023 年民间微观察和专业监测指南。完成后获得独立徽章，但不阻挡主线。"
                : "Side quests create no fictional locations. They use the published outfall survey, mangrove materials, the 2023 citizen-observation report and professional monitoring guidance. They award separate badges without blocking the main quest."}
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-[#4F46E5]/5 px-4 py-3 text-sm text-[#4F46E5]">
            {language === "zh" ? "支线完成" : "Side quests"} {completedSideQuests.length}/
            {librarySideQuests.length}
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {librarySideQuests.map((quest) => (
            <SideQuestCard
              key={quest.id}
              quest={quest}
              language={language}
              completedStations={completedStations}
              completed={completedSideQuests.includes(quest.id)}
              onAnswer={(correct) => recordSideQuestAnswer(quest.id, quest.reward.zh, correct)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BonusCard({
  milestone,
  language,
  completedStations,
  claimed,
  onAnswer,
}: {
  milestone: BonusMilestone;
  language: Language;
  completedStations: number;
  claimed: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  const unlocked = completedStations >= milestone.stationCount;
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === milestone.question.answerIndex;

  return (
    <article className="border-b border-r border-amber-200/60 p-4 last:border-r-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] text-amber-700">
            {language === "zh"
              ? `里程碑 · ${milestone.stationCount} 站`
              : `MILESTONE · ${milestone.stationCount} STATIONS`}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-navy">
            {claimed ? text(milestone.reward, language) : text(milestone.teaser, language)}
          </h3>
        </div>
        {claimed ? (
          <Trophy className="size-5 shrink-0 text-amber-500" />
        ) : unlocked ? (
          <Gift className="size-5 shrink-0 text-amber-500" />
        ) : (
          <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />
        )}
      </div>

      {claimed ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          <p className="font-semibold">
            {language === "zh" ? "奖励已收入装备库" : "Reward added to your collection"}
          </p>
          <p className="mt-1">{text(milestone.question.explanation, language)}</p>
        </div>
      ) : !unlocked ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {language === "zh"
            ? `再完成 ${milestone.stationCount - completedStations} 站解锁`
            : `Complete ${milestone.stationCount - completedStations} more station(s)`}
        </p>
      ) : !open ? (
        <Button
          size="sm"
          className="mt-3 bg-amber-500 text-white hover:bg-amber-600"
          onClick={() => setOpen(true)}
        >
          <Sparkles className="size-3.5" />
          {language === "zh" ? "打开神秘 Bonus" : "Open mystery bonus"}
        </Button>
      ) : (
        <QuestionBlock
          language={language}
          question={milestone.question}
          picked={picked}
          correct={correct}
          onPick={(index) => {
            setPicked(index);
            onAnswer(index === milestone.question.answerIndex);
          }}
          sourceIds={milestone.sourceIds}
        />
      )}
    </article>
  );
}

function SideQuestCard({
  quest,
  language,
  completedStations,
  completed,
  onAnswer,
}: {
  quest: LibrarySideQuest;
  language: Language;
  completedStations: number;
  completed: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  const unlocked = completedStations >= quest.unlockAt;
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === quest.question.answerIndex;

  return (
    <article
      className={`rounded-xl border p-4 ${completed ? "border-mangrove/45 bg-paleeco" : "border-border bg-background"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] text-[#4F46E5]">
            {language === "zh"
              ? `主线 ${quest.unlockAt} 站解锁`
              : `UNLOCKS AT ${quest.unlockAt} MAIN STATIONS`}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-navy">{text(quest.title, language)}</h3>
        </div>
        {completed ? (
          <CheckCircle2 className="size-5 shrink-0 text-mangrove" />
        ) : unlocked ? (
          <BookOpenCheck className="size-5 shrink-0 text-[#4F46E5]" />
        ) : (
          <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />
        )}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {text(quest.mission, language)}
      </p>

      {completed ? (
        <div className="mt-3 rounded-lg bg-white/80 p-3 text-xs text-mangrove">
          <p className="font-semibold">
            {language === "zh" ? "支线完成 · 获得" : "Side quest complete · Reward"}「
            {text(quest.reward, language)}」
          </p>
          <p className="mt-1 leading-5 text-muted-foreground">
            {text(quest.question.explanation, language)}
          </p>
        </div>
      ) : !unlocked ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {language === "zh"
            ? `再完成 ${quest.unlockAt - completedStations} 个主线站点开放`
            : `Complete ${quest.unlockAt - completedStations} more main-quest station(s)`}
        </p>
      ) : !open ? (
        <Button
          size="sm"
          variant="outline"
          className="mt-3 border-[#4F46E5]/35 text-[#4F46E5]"
          onClick={() => setOpen(true)}
        >
          {language === "zh" ? "进入支线" : "Enter side quest"}
        </Button>
      ) : (
        <div className="mt-4 border-t border-border pt-4">
          <div className="space-y-2">
            {quest.facts.map((fact, index) => (
              <p key={index} className="rounded-md bg-[#4F46E5]/5 px-3 py-2 text-xs leading-5">
                <span className="mr-1 font-mono text-[#4F46E5]">FILE {index + 1}</span>
                {text(fact, language)}
              </p>
            ))}
          </div>
          <QuestionBlock
            language={language}
            question={quest.question}
            picked={picked}
            correct={correct}
            onPick={(index) => {
              setPicked(index);
              onAnswer(index === quest.question.answerIndex);
            }}
            sourceIds={quest.sourceIds}
          />
        </div>
      )}
    </article>
  );
}

function QuestionBlock({
  language,
  question,
  picked,
  correct,
  onPick,
  sourceIds,
}: {
  language: Language;
  question: BonusMilestone["question"];
  picked: number | null;
  correct: boolean;
  onPick: (index: number) => void;
  sourceIds: string[];
}) {
  const sources = getLearningSources(sourceIds);
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold leading-5 text-navy">
        BONUS · {text(question.prompt, language)}
      </p>
      <div className="mt-2 space-y-1.5">
        {question.options.map((option, index) => (
          <button
            key={text(option, language)}
            type="button"
            disabled={correct}
            onClick={() => onPick(index)}
            className={`block w-full rounded-md border px-3 py-2 text-left text-xs leading-5 ${
              picked === index
                ? index === question.answerIndex
                  ? "border-mangrove bg-paleeco"
                  : "border-coral bg-coral/5"
                : "border-border bg-white hover:border-[#4F46E5]"
            }`}
          >
            {String.fromCharCode(65 + index)}. {text(option, language)}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p
          role="status"
          className={`mt-2 text-xs leading-5 ${correct ? "text-mangrove" : "text-coral"}`}
        >
          {correct
            ? `${language === "zh" ? "回答正确！" : "Correct! "}${text(question.explanation, language)}`
            : language === "zh"
              ? "还没破解。回到资料线索，再试一次。"
              : "Not solved yet. Re-read the evidence files and try again."}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-teal underline"
          >
            {language === "zh" ? `依据：${source.publisher}` : `Source: ${source.publisher}`}
            <ExternalLink className="size-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
