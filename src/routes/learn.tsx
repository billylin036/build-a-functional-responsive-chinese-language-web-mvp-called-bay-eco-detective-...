import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LockKeyhole,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  FINAL_PASS_SCORE,
  finalQuestions,
  getLearningModule,
  learningChapters,
  TOTAL_LEARNING_POINTS,
} from "@/data/learning";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "学习闯关 | 湾区生态侦探" },
      {
        name: "description",
        content: "面向学校与学生的深圳湾生态学习模式：逐点阅读、即时测验、综合评估与学习证书。",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const {
    completedLocationQuizzes,
    finalAssessment,
    activityRecords,
    learnerProfile,
    learningComplete,
    updateLearnerProfile,
    completeFinalAssessment,
  } = useAppState();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<Record<string, boolean> | null>(null);
  const progress = Math.round((completedLocationQuizzes.length / TOTAL_LEARNING_POINTS) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="overflow-hidden rounded-xl border border-teal/20 bg-gradient-to-br from-paleeco via-card to-card p-5 sm:p-7">
        <Badge className="bg-teal text-white">学校学习模式</Badge>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end">
          <div>
            <h1 className="text-2xl font-semibold text-navy sm:text-3xl">深圳湾生态学习闯关</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              在地图中逐一完成 {TOTAL_LEARNING_POINTS} 个差异化学习模块：阅读可靠知识卡、
              解决情境挑战题，还可以完成安全的观察活动并保存记录。全部完成后解锁综合测验。
            </p>
          </div>
          <div className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-navy">总学习进度</span>
              <span className="text-teal">
                {completedLocationQuizzes.length} / {TOTAL_LEARNING_POINTS}
              </span>
            </div>
            <Progress value={progress} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">{progress}% 完成</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <ClipboardCheck className="size-3.5" />
              已保存 {activityRecords.length} 次互动观察
            </p>
          </div>
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

      <section className="mt-8 space-y-8">
        {learningChapters.map((chapter) => {
          const completeCount = chapter.locations.filter((location) =>
            completedLocationQuizzes.includes(location.id),
          ).length;
          return (
            <div key={chapter.id}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-navy">{chapter.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{chapter.description}</p>
                </div>
                <Badge variant="outline">
                  {completeCount} / {chapter.locations.length}
                </Badge>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {chapter.locations.map((location, index) => {
                  const done = completedLocationQuizzes.includes(location.id);
                  const module = getLearningModule(location.id);
                  return (
                    <article
                      key={location.id}
                      className={`rounded-lg border bg-card p-4 ${done ? "border-mangrove/60" : "border-border"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {done ? (
                          <Badge className="gap-1 bg-mangrove">
                            <CheckCircle2 className="size-3" />
                            已完成
                          </Badge>
                        ) : (
                          <Badge variant="secondary">待学习</Badge>
                        )}
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-navy">{location.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {location.category}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {location.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Badge variant="outline">{module.quiz.skill}</Badge>
                        <Badge variant="secondary">{module.quiz.difficulty}</Badge>
                      </div>
                      <p className="mt-2 flex items-start gap-1 text-[11px] leading-4 text-muted-foreground">
                        <ClipboardCheck className="mt-0.5 size-3 shrink-0" />
                        可选活动：{module.activity.title}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        variant={done ? "outline" : "default"}
                        className="mt-3"
                      >
                        <Link to="/location/$id" params={{ id: location.id }}>
                          {done ? "复习数据点" : "学习并答题"}
                        </Link>
                      </Button>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

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
              完成全部数据点后解锁。共 {finalQuestions.length} 题，答对 {FINAL_PASS_SCORE}{" "}
              题即可获得证书。题目重点考查迁移、比较和证据判断，不要求死记编号。
            </p>
          </div>
        </div>

        {!learningComplete ? (
          <div className="mt-5 rounded-md border border-dashed border-border bg-muted/30 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              还需完成 {TOTAL_LEARNING_POINTS - completedLocationQuizzes.length} 个数据点测验。
            </p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/">返回地图学习</Link>
            </Button>
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
                setMessage("请先填写学生姓名和学校名称。 ");
                return;
              }
              if (Object.keys(answers).length !== finalQuestions.length) {
                setMessage("请完成全部题目后再提交。 ");
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
    </main>
  );
}
