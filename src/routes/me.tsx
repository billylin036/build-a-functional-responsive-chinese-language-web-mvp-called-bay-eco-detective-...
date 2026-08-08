import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CalendarClock, History, MapPinned, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/app-state";
import { getLocation } from "@/data/locations";
import { getTask } from "@/data/tasks";
import { routeStops } from "@/data/route";
import { getMonitoringStation, nextObservationDate } from "@/data/stations";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "我的记录 | 湾区生态侦探" },
      {
        name: "description",
        content: "查看你的深圳湾探索历史、已完成任务、路线进度与获得的生态观察徽章。",
      },
      { property: "og:title", content: "我的记录 | 湾区生态侦探" },
      { property: "og:description", content: "你的探索历史、任务进度与徽章都会保存在本机。" },
    ],
  }),
  component: MePage,
});

function MePage() {
  const {
    hydrated,
    history,
    badges,
    completedTasks,
    submissions,
    routeProgress,
    routeDone,
    claimedStations,
    clearAll,
  } = useAppState();

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-sm text-muted-foreground">
        读取本机记录中…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h1 className="truncate text-2xl font-semibold text-navy">我的记录</h1>
        <Button variant="outline" size="sm" onClick={clearAll} className="shrink-0">
          <Trash2 className="size-4" />
          清空本机记录
        </Button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        进度保存在本机浏览器中，刷新页面后依然有效。
      </p>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="已完成任务" value={`${completedTasks.length} / 6`} />
        <Stat
          label="路线进度"
          value={`${routeProgress} / ${routeStops.length}${routeDone ? "（已完成）" : ""}`}
        />
        <Stat label="提交观察记录" value={`${submissions.length} 条`} />
        <Stat label="已认领共测站" value={`${claimedStations.length} 个`} />
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
            <MapPinned className="size-5" />
            我的生态共测站
          </h2>
          <Link className="text-sm text-teal underline" to="/stations">
            管理共测站
          </Link>
        </div>
        {claimedStations.length === 0 ? (
          <EmptyState
            text="你还没有认领固定观察点。认领后可以持续积累同一地点的变化记录。"
            action={
              <Link className="text-teal underline" to="/stations">
                选择一个共测站
              </Link>
            }
          />
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {claimedStations.map((claim) => {
              const station = getMonitoringStation(claim.stationId);
              if (!station) return null;
              const records = submissions
                .filter((submission) => submission.stationId === station.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              const nextDate = nextObservationDate(
                records[0]?.date ?? claim.claimedAt,
                station.cadenceDays,
              );
              return (
                <article
                  key={claim.stationId}
                  className="rounded-md border border-teal/30 bg-paleeco/40 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-navy">{station.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{station.cadenceLabel}</p>
                    </div>
                    <Badge variant="outline">{records.length} 条</Badge>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5" />
                    {records.length === 0
                      ? "首次观察：现在即可开始"
                      : `下次建议：${formatDate(nextDate)}`}
                  </p>
                  <Button asChild size="sm" className="mt-3">
                    <Link to="/submit" search={{ task: station.taskId, station: station.id }}>
                      提交本期观察
                    </Link>
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
          <Award className="size-5" />
          徽章
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-md border p-3 ${
                b.earned ? "border-mangrove bg-paleeco" : "border-border bg-card opacity-70"
              }`}
            >
              <p className="text-sm font-semibold text-navy">{b.id}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{b.desc}</p>
              <Badge variant={b.earned ? "default" : "secondary"} className="mt-2">
                {b.earned ? "已获得" : "未获得"}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">我提交的观察记录</h2>
        {submissions.length === 0 ? (
          <EmptyState
            text="你还没有提交观察记录。"
            action={
              <Link className="text-teal underline" to="/tasks">
                去看看公众任务
              </Link>
            }
          />
        ) : (
          <ul className="mt-3 space-y-3">
            {submissions.map((s) => (
              <li key={s.id} className="rounded-md border border-border bg-card p-3">
                <p className="text-sm font-medium text-navy">
                  {getTask(s.taskId)?.title ?? "公众观察"}
                </p>
                {s.stationId && (
                  <Badge variant="outline" className="mt-1">
                    共测记录 · {getMonitoringStation(s.stationId)?.name}
                  </Badge>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.date}｜{getLocation(s.locationId)?.name}｜{s.category}｜水色：{s.waterColor}
                </p>
                {(s.weather || s.tide || s.waterFlow || s.odor) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[s.weather, s.tide, s.waterFlow, s.odor].filter(Boolean).join("｜")}
                  </p>
                )}
                <p className="mt-1 text-sm leading-6">{s.description}</p>
                {s.unusual && <p className="mt-1 text-sm text-coral">异常：{s.unusual}</p>}
                <Badge variant="secondary" className="mt-2">
                  审核中
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
          <History className="size-5" />
          探索历史
        </h2>
        {history.length === 0 ? (
          <EmptyState
            text="还没有探索记录。回答一道地点问答，或走一遍侦探路线试试。"
            action={
              <Link className="text-teal underline" to="/route">
                开始侦探路线
              </Link>
            }
          />
        ) : (
          <ul className="mt-3 space-y-2">
            {history.map((h) => (
              <li
                key={h.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
              >
                <Badge variant="outline" className="shrink-0">
                  {h.type}
                </Badge>
                <span className="min-w-0 truncate text-sm">{h.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(h.at).toLocaleDateString("zh-CN")}
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
    <div className="rounded-md border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-navy">{value}</p>
    </div>
  );
}

function EmptyState({ text, action }: { text: string; action: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md border border-dashed border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <p className="mt-2 text-sm">{action}</p>
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) return "待安排";
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}
