import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { tasks } from "@/data/tasks";
import { getLocation } from "@/data/locations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "公众任务 | 湾区生态侦探" },
      {
        name: "description",
        content: "深圳湾公众观察任务清单：拍摄红树林长势、记录排口水色、观察滩涂鸟类与岸线垃圾。",
      },
      { property: "og:title", content: "公众任务 | 湾区生态侦探" },
      { property: "og:description", content: "选择一个任务，到现场记录你看到的生态证据。" },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { completedTasks } = useAppState();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">公众任务</h1>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        每个任务都对应一个真实地点。完成后提交观察记录，机构会在审核后用于生态保护与公众科普。
      </p>

      <div className="mt-6 space-y-4">
        {tasks.map((t) => {
          const loc = getLocation(t.locationId);
          const done = completedTasks.includes(t.id);
          return (
            <article key={t.id} className="rounded-md border border-border bg-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-navy">{t.title}</h2>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {loc?.name ?? "深圳湾"}
                  </p>
                </div>
                <Badge variant={done ? "default" : "secondary"} className="shrink-0">
                  {done ? "已完成" : "未完成"}
                </Badge>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-sm bg-secondary px-2 py-0.5">{t.category}</span>
                <span className="rounded-sm bg-secondary px-2 py-0.5">{t.difficulty}</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {t.duration}
                </span>
                <span className="rounded-sm bg-paleeco px-2 py-0.5">徽章：{t.badge}</span>
              </div>

              <p className="mt-2 text-sm leading-6">{t.description}</p>

              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-teal">查看操作步骤</summary>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6">
                  {t.instructions.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ol>
              </details>

              <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-coral">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                安全提示：{t.safetyNotes}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/submit" search={{ task: t.id }}>
                    提交观察记录
                  </Link>
                </Button>
                {loc && (
                  <Button asChild size="sm" variant="outline">
                    <Link to="/location/$id" params={{ id: loc.id }}>
                      查看地点故事
                    </Link>
                  </Button>
                )}
                {done && (
                  <span className="flex items-center gap-1 text-xs text-mangrove">
                    <CheckCircle2 className="size-3.5" />已记录在「我的记录」
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
