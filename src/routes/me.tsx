import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, ClipboardCheck, History, Printer, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SAMPLING_QUEST_IDS } from "@/data/exploration";
import { TOTAL_CHAPTERS, TOTAL_LEARNING_POINTS } from "@/data/learning";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "学习成果 | 湾区生态侦探" },
      {
        name: "description",
        content: "查看深圳湾生态学习进度、测验徽章与学习完成证书。",
      },
    ],
  }),
  component: LearningResultsPage,
});

function LearningResultsPage() {
  const {
    hydrated,
    completedChapters,
    chapterAttempts,
    completedLocationQuizzes,
    quizAttempts,
    finalAssessment,
    learnerProfile,
    learningHistory,
    activityRecords,
    badges,
    resetLearning,
  } = useAppState();

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-sm text-muted-foreground">
        读取学习记录中…
      </main>
    );
  }

  const totalLocationAttempts = Object.values(quizAttempts).reduce(
    (total, attempts) => total + attempts,
    0,
  );
  const totalChapterAttempts = Object.values(chapterAttempts).reduce(
    (total, attempts) => total + attempts,
    0,
  );
  const completedWorldQuests = SAMPLING_QUEST_IDS.filter((id) =>
    completedLocationQuizzes.includes(id),
  ).length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">学习成果</h1>
          <p className="mt-1 text-sm text-muted-foreground">学习进度保存在当前浏览器中。</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (window.confirm("确定清空全部学习进度和证书吗？")) resetLearning();
          }}
        >
          <RotateCcw className="size-4" />
          重置学习进度
        </Button>
      </div>

      <section className="no-print mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="完成章节" value={`${completedChapters.length} / ${TOTAL_CHAPTERS}`} />
        <Stat label="章节答题选择" value={`${totalChapterAttempts} 次`} />
        <Stat
          label="大世界探索"
          value={`${completedWorldQuests}/${SAMPLING_QUEST_IDS.length} 支线 · 全部 ${completedLocationQuizzes.length}/${TOTAL_LEARNING_POINTS} 点`}
        />
        <Stat
          label="综合测验"
          value={
            finalAssessment ? `${finalAssessment.score} / ${finalAssessment.total}` : "尚未完成"
          }
        />
      </section>

      <section className="no-print mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
          <Award className="size-5" />
          学习徽章
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <article
              key={badge.id}
              className={`rounded-lg border p-4 ${badge.earned ? "border-mangrove bg-paleeco" : "border-border bg-card opacity-65"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{badge.id}</p>
                {badge.earned && <CheckCircle2 className="size-4 text-mangrove" />}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{badge.desc}</p>
              <Badge variant={badge.earned ? "default" : "secondary"} className="mt-3">
                {badge.earned ? "已获得" : "未获得"}
              </Badge>
            </article>
          ))}
        </div>
      </section>

      {finalAssessment ? (
        <section className="certificate-print mt-10 overflow-hidden rounded-xl border-2 border-teal bg-white p-6 text-center shadow-sm sm:p-10">
          <p className="text-xs font-medium tracking-[0.35em] text-teal">BAY ECO DETECTIVE</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-wide text-navy">
            深圳湾生态学习完成证书
          </h2>
          <p className="mt-6 text-sm text-muted-foreground">兹证明</p>
          <p className="mt-2 text-2xl font-semibold text-navy">{learnerProfile.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {learnerProfile.school}
            {learnerProfile.className ? ` · ${learnerProfile.className}` : ""}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7">
            已完成“湾区生态侦探”全部 {TOTAL_CHAPTERS} 个真实资料学习章节与连续测验，
            并通过深圳湾生态综合测验，成绩为 {finalAssessment.score}/{finalAssessment.total}。
          </p>
          <div className="mx-auto mt-8 grid max-w-xl gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:grid-cols-3">
            <div>
              <p>证书编号</p>
              <p className="mt-1 font-medium text-navy">{finalAssessment.certificateId}</p>
            </div>
            <div>
              <p>完成日期</p>
              <p className="mt-1 font-medium text-navy">
                {new Date(finalAssessment.completedAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
            <div>
              <p>网站开发</p>
              <p className="mt-1 font-medium text-navy">Billy Lin</p>
            </div>
          </div>
          <p className="mt-6 text-[11px] text-muted-foreground">
            数据合作：深圳市绿源环保志愿者协会
          </p>
          <Button className="no-print mt-6" onClick={() => window.print()}>
            <Printer className="size-4" />
            打印或保存证书
          </Button>
        </section>
      ) : (
        <section className="no-print mt-10 rounded-lg border border-dashed border-border bg-card p-7 text-center">
          <Award className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold text-navy">学习证书尚未解锁</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            完成全部四个章节并通过综合测验后即可生成；地图地点题为拓展练习。
          </p>
          <Button asChild className="mt-4">
            <Link to="/learn">继续学习闯关</Link>
          </Button>
        </section>
      )}

      <section className="no-print mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
          <ClipboardCheck className="size-5" />
          互动观察记录
        </h2>
        {activityRecords.length === 0 ? (
          <div className="mt-3 rounded-md border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            还没有观察记录。每个地图数据点都有一个 3–8 分钟的安全活动。
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {activityRecords.slice(0, 12).map((record) => (
              <article key={record.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy">{record.activityTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{record.locationName}</p>
                  </div>
                  <Badge variant="outline">
                    {new Date(record.completedAt).toLocaleDateString("zh-CN")}
                  </Badge>
                </div>
                <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
                  {Object.values(record.responses).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="no-print mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
          <History className="size-5" />
          学习记录
        </h2>
        {learningHistory.length === 0 ? (
          <div className="mt-3 rounded-md border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            还没有学习记录。
            <Link className="ml-1 text-teal underline" to="/learn">
              开始第一章
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {learningHistory.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
              >
                <Badge variant="outline">{item.type}</Badge>
                <span className="min-w-0 truncate text-sm">{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.at).toLocaleDateString("zh-CN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-navy">{value}</p>
    </div>
  );
}
