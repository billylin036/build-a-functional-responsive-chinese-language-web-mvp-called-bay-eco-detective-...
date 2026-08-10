import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Compass,
  ExternalLink,
  GraduationCap,
  LockKeyhole,
  MapPinned,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SAMPLING_QUEST_IDS, samplingQuestRegions } from "@/data/exploration";
import type { CourseChapter } from "@/data/learning";
import {
  FINAL_PASS_SCORE,
  finalQuestions,
  getLearningSources,
  learningChapters,
  TOTAL_CHAPTERS,
  TOTAL_LEARNING_POINTS,
} from "@/data/learning";
import { locations } from "@/data/locations";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "学习闯关 | 湾区生态侦探" },
      {
        name: "description",
        content:
          "基于绿源官方公开资料的四章深圳湾生态课程：逐章阅读、连续测验、综合评估与学习证书。",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const {
    completedChapters,
    chapterAttempts,
    completedLocationQuizzes,
    finalAssessment,
    activityRecords,
    learnerProfile,
    learningComplete,
    updateLearnerProfile,
    completeChapter,
    completeFinalAssessment,
  } = useAppState();
  const firstChapter = learningChapters[0]!;
  const firstIncomplete =
    learningChapters.find((chapter) => !completedChapters.includes(chapter.id)) ?? firstChapter;
  const [activeChapterId, setActiveChapterId] = useState(firstIncomplete.id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<Record<string, boolean> | null>(null);
  const activeChapter =
    learningChapters.find((chapter) => chapter.id === activeChapterId) ?? firstChapter;
  const chapterProgress = Math.round((completedChapters.length / TOTAL_CHAPTERS) * 100);
  const completedSamplingQuizzes = SAMPLING_QUEST_IDS.filter((id) =>
    completedLocationQuizzes.includes(id),
  );
  const explorationProgress = Math.round(
    (completedSamplingQuizzes.length / SAMPLING_QUEST_IDS.length) * 100,
  );
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="overflow-hidden rounded-xl border border-teal/20 bg-gradient-to-br from-paleeco via-card to-card p-5 sm:p-7">
        <Badge className="bg-teal text-white">绿源真实资料课程</Badge>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end">
          <div>
            <h1 className="text-2xl font-semibold text-navy sm:text-3xl">深圳湾生态学习闯关</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              四个章节均参考深圳市绿源环保志愿者协会公开资料及专业规范。每章先阅读资料，再连续完成 5
              道递进测验，其中包含一道流域探索题；答错可根据提示重试，答对后才能进入下一题。
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              课程会明确标注调查年份。2015
              年排口记录是历史调查，不代表当前水质；没有公开的数据不会补造。
            </p>
          </div>
          <div className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-navy">章节进度</span>
              <span className="text-teal">
                {completedChapters.length} / {TOTAL_CHAPTERS}
              </span>
            </div>
            <Progress value={chapterProgress} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">{chapterProgress}% 完成</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <ClipboardCheck className="size-3.5" />
              另有 {completedLocationQuizzes.length} / {TOTAL_LEARNING_POINTS} 个地图微测验、
              {activityRecords.length} 次观察记录
            </p>
          </div>
        </div>
      </section>

      <section
        id="world-quest-guide"
        className="mt-8 scroll-mt-20 overflow-hidden rounded-xl border border-teal/25 bg-navy text-white"
      >
        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
          <div>
            <Badge className="bg-coral text-white hover:bg-coral">OPEN WORLD QUEST</Badge>
            <h2 className="mt-3 flex items-center gap-2 text-xl font-semibold sm:text-2xl">
              <Compass className="size-6 text-teal-200" />
              珠江流域 · 大世界探索
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">
              38
              个真实采样点被编成四条流域支线。搜索地点、跳转到真实坐标，阅读地点角色与指标线索，再完成不重复的推理任务和微测验。
            </p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>探索完成度</span>
              <span className="font-mono text-teal-200">
                {completedSamplingQuizzes.length} / {SAMPLING_QUEST_IDS.length}
              </span>
            </div>
            <Progress value={explorationProgress} className="mt-2 bg-white/15" />
            <p className="mt-2 text-xs text-white/65">
              {explorationProgress}% · 每区完成 3 个点位可得徽章
            </p>
          </div>
        </div>

        <div className="mx-5 mb-5 flex flex-col gap-3 rounded-xl border border-teal-200/25 bg-white/10 p-4 sm:mx-7 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <CircleHelp className="size-5 text-teal-200" />
              第一次玩大世界探索？
            </h3>
            <p className="mt-1 text-xs leading-5 text-white/65">
              点击按钮进入三步引导，完成后会自动打开第一站。
            </p>
          </div>
          <a
            href="/?tutorial=1"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-coral px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral/90"
          >
            启动新手教程
          </a>
        </div>

        <div className="grid border-t border-white/10 md:grid-cols-2 xl:grid-cols-4">
          {samplingQuestRegions.map((region) => {
            const completed = region.sampleIds.filter((id) =>
              completedLocationQuizzes.includes(id),
            );
            const nextId =
              region.sampleIds.find((id) => !completedLocationQuizzes.includes(id)) ??
              region.sampleIds[0]!;
            const nextLocation = locations.find((location) => location.id === nextId);
            const earned = completed.length >= region.badgeThreshold;
            return (
              <article
                key={region.id}
                className="border-white/10 p-5 md:border-r md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] text-teal-200">{region.code}</p>
                    <h3 className="mt-1 text-sm font-semibold">{region.title}</h3>
                  </div>
                  {earned && (
                    <Award className="size-5 shrink-0 text-amber-300" aria-label="徽章已解锁" />
                  )}
                </div>
                <p className="mt-2 text-xs leading-5 text-white/65">{region.description}</p>
                <p className="mt-3 text-xs text-white/80">
                  {completed.length}/{region.sampleIds.length} 已完成 · 徽章「{region.badge}」
                </p>
                <a
                  href={`/?location=${encodeURIComponent(nextId)}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-navy hover:bg-teal-50"
                >
                  <MapPin className="size-3.5" />
                  {completed.length === region.sampleIds.length
                    ? "再次探索"
                    : `前往 ${nextLocation?.name ?? "下一站"}`}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="mt-0.5 size-5 shrink-0 text-teal" />
          <div className="flex-1">
            <h2 className="text-base font-semibold text-navy">学生信息</h2>
            <p className="mt-1 text-xs text-muted-foreground">姓名和学校将显示在最终学习证书上。</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Input
                aria-label="学生姓名"
                placeholder="学生姓名"
                value={learnerProfile.name}
                onChange={(event) =>
                  updateLearnerProfile({ ...learnerProfile, name: event.target.value })
                }
              />
              <Input
                aria-label="学校名称"
                placeholder="学校名称"
                value={learnerProfile.school}
                onChange={(event) =>
                  updateLearnerProfile({ ...learnerProfile, school: event.target.value })
                }
              />
              <Input
                aria-label="班级（选填）"
                placeholder="班级（选填）"
                value={learnerProfile.className}
                onChange={(event) =>
                  updateLearnerProfile({ ...learnerProfile, className: event.target.value })
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="course-map-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="course-map-title" className="text-xl font-semibold text-navy">
              四章学习路线
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              章节依次解锁；已完成章节可以随时复习，不会重复计入进度。
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/resources">查看完整资料库</Link>
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {learningChapters.map((chapter, index) => {
            const done = completedChapters.includes(chapter.id);
            const unlocked =
              index === 0 || completedChapters.includes(learningChapters[index - 1]?.id ?? "");
            const active = chapter.id === activeChapter.id;
            const regionProgress = chapter.exploration
              ? chapter.exploration.sampleIds.filter((id) => completedLocationQuizzes.includes(id))
                  .length
              : 0;
            return (
              <button
                key={chapter.id}
                type="button"
                disabled={!unlocked}
                aria-current={active ? "step" : undefined}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-teal bg-paleeco shadow-sm"
                    : done
                      ? "border-mangrove/50 bg-card hover:border-mangrove"
                      : unlocked
                        ? "border-border bg-card hover:border-teal"
                        : "cursor-not-allowed border-border bg-muted/40 opacity-65"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-teal">CHAPTER {chapter.number}</span>
                  {done ? (
                    <CheckCircle2 className="size-4 text-mangrove" />
                  ) : unlocked ? (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  ) : (
                    <LockKeyhole className="size-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-navy">
                  {chapter.title.replace(/^第.章 · /, "")}
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{chapter.subtitle}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{chapter.duration}</span>
                  <span>{chapter.quiz.length} 题</span>
                </div>
                {chapter.exploration && (
                  <p className="mt-2 border-t border-current/10 pt-2 text-[11px] text-teal">
                    支线探索 {regionProgress}/{chapter.exploration.sampleIds.length}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <ChapterLesson
        chapter={activeChapter}
        completed={completedChapters.includes(activeChapter.id)}
        previousAttempts={chapterAttempts[activeChapter.id] ?? 0}
        completedLocationQuizzes={completedLocationQuizzes}
        onComplete={(attempts) => completeChapter(activeChapter.id, activeChapter.title, attempts)}
      />

      <section className="mt-10 rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          {learningComplete ? (
            <BookOpenCheck className="mt-0.5 size-6 shrink-0 text-teal" />
          ) : (
            <LockKeyhole className="mt-0.5 size-6 shrink-0 text-muted-foreground" />
          )}
          <div>
            <h2 className="text-xl font-semibold text-navy">最终综合测验</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              完成全部 {TOTAL_CHAPTERS} 章后解锁。共 {finalQuestions.length} 题，答对{" "}
              {FINAL_PASS_SCORE} 题即可获得证书。地图地点微测验是补充练习，不作为证书解锁条件。
            </p>
          </div>
        </div>

        {!learningComplete ? (
          <div className="mt-5 rounded-md border border-dashed border-border bg-muted/30 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              还需完成 {TOTAL_CHAPTERS - completedChapters.length} 个章节。
            </p>
          </div>
        ) : finalAssessment ? (
          <div className="mt-5 rounded-md border border-mangrove bg-paleeco p-5 text-center">
            <Award className="mx-auto size-8 text-mangrove" />
            <h3 className="mt-2 font-semibold text-navy">综合测验已通过</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              成绩：{finalAssessment.score} / {finalAssessment.total}
            </p>
            <Button asChild className="mt-3">
              <Link to="/me">查看徽章与证书</Link>
            </Button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!learnerProfile.name.trim() || !learnerProfile.school.trim()) {
                setMessage("请先填写学生姓名和学校名称。");
                return;
              }
              if (Object.keys(answers).length !== finalQuestions.length) {
                setMessage("请完成全部题目后再提交。");
                return;
              }
              const score = finalQuestions.filter(
                (question) => answers[question.id] === question.answerIndex,
              ).length;
              setReview(
                Object.fromEntries(
                  finalQuestions.map((question) => [
                    question.id,
                    answers[question.id] === question.answerIndex,
                  ]),
                ),
              );
              if (score >= FINAL_PASS_SCORE) {
                completeFinalAssessment(score, finalQuestions.length);
                setMessage(`恭喜通过！成绩 ${score}/${finalQuestions.length}。`);
              } else {
                setMessage(
                  `本次成绩 ${score}/${finalQuestions.length}。查看每题反馈、修改答案后可再次提交。`,
                );
              }
            }}
          >
            {finalQuestions.map((question, questionIndex) => (
              <fieldset key={question.id} className="rounded-lg border border-border p-4">
                <legend className="px-1 text-sm font-semibold text-navy">
                  {questionIndex + 1}. {question.question}
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={answers[question.id] === optionIndex}
                      onClick={() => {
                        setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
                        setReview(null);
                        setMessage("");
                      }}
                      className={`rounded-md border px-3 py-2 text-left text-xs ${
                        answers[question.id] === optionIndex
                          ? "border-teal bg-paleeco"
                          : "border-border bg-white hover:border-teal"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {review && (
                  <p
                    className={`mt-3 text-xs leading-5 ${review[question.id] ? "text-mangrove" : "text-coral"}`}
                  >
                    {review[question.id] ? "回答正确。" : `需要复习：${question.hint}`}{" "}
                    {review[question.id] ? question.explanation : ""}
                  </p>
                )}
              </fieldset>
            ))}
            {message && (
              <p role="status" className="rounded-md bg-muted px-3 py-2 text-sm">
                {message}
              </p>
            )}
            <Button type="submit">提交综合测验</Button>
          </form>
        )}
      </section>

      <section className="mt-8 flex flex-col gap-4 rounded-xl border border-teal/20 bg-paleeco p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <MapPinned className="mt-0.5 size-5 shrink-0 text-teal" />
          <div>
            <h2 className="font-semibold text-navy">继续大世界探索</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              在真实坐标地图中搜索地点、解锁流域支线徽章，并完成地点知识卡、微测验与安全观察记录。
            </p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link to="/">打开互动地图</Link>
        </Button>
      </section>
    </main>
  );
}

function ChapterLesson({
  chapter,
  completed,
  previousAttempts,
  completedLocationQuizzes,
  onComplete,
}: {
  chapter: CourseChapter;
  completed: boolean;
  previousAttempts: number;
  completedLocationQuizzes: string[];
  onComplete: (attempts: number) => void;
}) {
  const [stage, setStage] = useState<"reading" | "quiz" | "complete">(
    completed ? "complete" : "reading",
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const chapterSources = useMemo(() => getLearningSources(chapter.sourceIds), [chapter.sourceIds]);
  const question = chapter.quiz[questionIndex];
  const questionSources = question ? getLearningSources(question.sourceIds) : [];
  const questCompleted = chapter.exploration
    ? chapter.exploration.sampleIds.filter((id) => completedLocationQuizzes.includes(id))
    : [];
  const nextQuestId = chapter.exploration
    ? (chapter.exploration.sampleIds.find((id) => !completedLocationQuizzes.includes(id)) ??
      chapter.exploration.sampleIds[0])
    : undefined;
  const nextQuestLocation = locations.find((location) => location.id === nextQuestId);

  useEffect(() => {
    setStage(completed ? "complete" : "reading");
    setQuestionIndex(0);
    setPicked(null);
    setCorrect(false);
    setAttempts(0);
  }, [chapter.id, completed]);

  const restart = () => {
    setStage("reading");
    setQuestionIndex(0);
    setPicked(null);
    setCorrect(false);
    setAttempts(0);
  };

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-navy px-5 py-5 text-white sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-teal-200">CHAPTER {chapter.number}</p>
            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{chapter.title}</h2>
            <p className="mt-1 text-sm text-white/75">{chapter.subtitle}</p>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/10">
            {chapter.duration} · {chapter.quiz.length} 题
          </Badge>
        </div>
      </div>

      {stage === "reading" && (
        <div className="p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <BookOpen className="size-4 text-teal" />
                本章资料卡
              </div>
              <div className="mt-3 space-y-3">
                {chapter.facts.map((fact, index) => (
                  <article key={fact.title} className="rounded-lg border border-border p-4">
                    <p className="text-[11px] font-mono text-teal">
                      EVIDENCE {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-navy">{fact.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-foreground">{fact.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-teal/25 bg-paleeco p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <ShieldCheck className="size-4 text-teal" />
                  学习目标
                </h3>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
                  {chapter.goals.map((goal) => (
                    <li key={goal} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              {chapter.exploration && nextQuestId && (
                <div className="rounded-lg border border-navy/15 bg-navy p-4 text-white">
                  <p className="font-mono text-[11px] text-teal-200">OPEN WORLD SIDE QUEST</p>
                  <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold">
                    <Compass className="size-4" />
                    {chapter.exploration.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/70">
                    {chapter.exploration.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span>
                      {questCompleted.length}/{chapter.exploration.sampleIds.length} 个点位
                    </span>
                    <span>3 个解锁徽章</span>
                  </div>
                  <Progress
                    value={(questCompleted.length / chapter.exploration.sampleIds.length) * 100}
                    className="mt-2 bg-white/15"
                  />
                  <a
                    href={`/?location=${encodeURIComponent(nextQuestId)}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-navy hover:bg-teal-50"
                  >
                    <MapPin className="size-3.5" />
                    前往 {nextQuestLocation?.name ?? "流域支线"}
                  </a>
                </div>
              )}

              <div className="rounded-lg border border-coral/20 bg-coral/5 p-4">
                <h3 className="text-sm font-semibold text-navy">
                  课后实践 · {chapter.fieldTask.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {chapter.fieldTask.prompt}
                </p>
                <ol className="mt-3 space-y-1.5 text-xs leading-5 text-muted-foreground">
                  {chapter.fieldTask.steps.map((step, index) => (
                    <li key={step}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <p className="text-xs font-medium text-navy">本章资料来源</p>
                <div className="mt-2 space-y-1.5">
                  {chapterSources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-1.5 text-xs leading-5 text-teal underline"
                    >
                      <ExternalLink className="mt-0.5 size-3 shrink-0" />
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Button
              onClick={() => {
                setStage("quiz");
                setQuestionIndex(0);
                setPicked(null);
                setCorrect(false);
              }}
            >
              我已阅读，开始连续答题
              <ChevronRight className="size-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              答错可重试；答对后才会出现下一题。
            </span>
          </div>
        </div>
      )}

      {stage === "quiz" && question && (
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-navy">
              连续测验 · 第 {questionIndex + 1} / {chapter.quiz.length} 题
            </p>
            <Badge variant="outline">
              {question.skill} · {question.difficulty}
            </Badge>
          </div>
          <Progress
            value={((questionIndex + (correct ? 1 : 0)) / chapter.quiz.length) * 100}
            className="mt-3"
          />

          <fieldset className="mt-6">
            <legend className="max-w-3xl text-lg font-semibold leading-8 text-navy">
              {question.question}
            </legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => {
                const selected = picked === optionIndex;
                const selectedCorrect = selected && optionIndex === question.answerIndex;
                const selectedWrong = selected && optionIndex !== question.answerIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={correct}
                    aria-pressed={selected}
                    onClick={() => {
                      if (correct) return;
                      setAttempts((current) => current + 1);
                      setPicked(optionIndex);
                      setCorrect(optionIndex === question.answerIndex);
                    }}
                    className={`rounded-lg border px-4 py-3 text-left text-sm leading-6 transition-colors ${
                      selectedCorrect
                        ? "border-mangrove bg-paleeco"
                        : selectedWrong
                          ? "border-coral bg-coral/5"
                          : "border-border bg-white hover:border-teal disabled:cursor-not-allowed"
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {picked !== null && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-5 rounded-lg border p-4 ${
                correct ? "border-mangrove/40 bg-paleeco" : "border-coral/30 bg-coral/5"
              }`}
            >
              <p className={`text-sm font-semibold ${correct ? "text-mangrove" : "text-coral"}`}>
                {correct ? "回答正确" : "还不对，请根据提示再试一次"}
              </p>
              <p className="mt-1 text-sm leading-6 text-foreground">
                {correct ? question.explanation : `提示：${question.hint}`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {questionSources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-teal underline"
                  >
                    依据：{source.publisher}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <Button variant="ghost" size="sm" onClick={() => setStage("reading")}>
              返回资料卡
            </Button>
            {correct && (
              <Button
                onClick={() => {
                  if (questionIndex === chapter.quiz.length - 1) {
                    onComplete(attempts);
                    setStage("complete");
                    return;
                  }
                  setQuestionIndex((current) => current + 1);
                  setPicked(null);
                  setCorrect(false);
                }}
              >
                {questionIndex === chapter.quiz.length - 1 ? "完成本章" : "下一题"}
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {stage === "complete" && (
        <div className="p-6 text-center sm:p-10">
          <CheckCircle2 className="mx-auto size-10 text-mangrove" />
          <h3 className="mt-3 text-xl font-semibold text-navy">本章连续测验已完成</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            你已完成 {chapter.quiz.length}{" "}
            道题。选择上方下一章节继续学习；也可以重新阅读并复习本章。
          </p>
          {(previousAttempts > 0 || attempts > 0) && (
            <p className="mt-2 text-xs text-muted-foreground">
              已记录答题选择次数：{Math.max(previousAttempts, attempts)}
            </p>
          )}
          <Button variant="outline" className="mt-5" onClick={restart}>
            <RotateCcw className="size-4" />
            重新学习本章
          </Button>
        </div>
      )}
    </section>
  );
}
