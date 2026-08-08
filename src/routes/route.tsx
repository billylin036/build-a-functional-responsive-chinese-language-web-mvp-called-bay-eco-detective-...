import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Compass, MapPin, RotateCcw } from "lucide-react";
import { ROUTE_INTRO, ROUTE_NAME, routeStops } from "@/data/route";
import { getLocation } from "@/data/locations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/route")({
  head: () => ({
    meta: [
      { title: "深圳湾生态变化侦探路线 | 湾区生态侦探" },
      {
        name: "description",
        content: "5 个站点、5 个问题：跟着证据走一遍深圳湾，理解红树林成活率与水质达标背后的真实故事。",
      },
      { property: "og:title", content: "深圳湾生态变化侦探路线" },
      { property: "og:description", content: "选择地点、比较变化、理解原因、参与行动。" },
    ],
  }),
  component: RoutePage,
});

function RoutePage() {
  const { routeStarted, routeProgress, routeDone, startRoute, advanceRoute, resetRoute } =
    useAppState();
  const [picked, setPicked] = useState<number | null>(null);

  const index = Math.min(routeProgress, routeStops.length - 1);
  const stop = routeStops[index]!;
  const loc = getLocation(stop.locationId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">{ROUTE_NAME}</h1>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{ROUTE_INTRO}</p>

      {!routeStarted ? (
        <div className="mt-6 rounded-md border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-navy">路线站点</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7">
            {routeStops.map((s) => (
              <li key={s.locationId}>
                <span className="font-medium">{getLocation(s.locationId)?.name}</span>
                <span className="text-muted-foreground">：{s.question}</span>
              </li>
            ))}
          </ol>
          <Button className="mt-4" onClick={startRoute}>
            <Compass className="size-4" />开始路线
          </Button>
        </div>
      ) : routeDone ? (
        <div className="mt-6 rounded-md border border-mangrove bg-paleeco p-6 text-center">
          <CheckCircle2 className="mx-auto size-9 text-mangrove" />
          <h2 className="mt-3 text-lg font-semibold text-navy">路线完成</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7">
            你已经走完 5 个站点。记住这条线索：指标变好是好消息，但只有当水、林、鸟三者一起恢复，
            深圳湾的生态才算真正回来。
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/me">查看徽章与记录</Link>
            </Button>
            <Button variant="outline" onClick={resetRoute}>
              <RotateCcw className="size-4" />重新开始
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-navy">
                第 {index + 1} / {routeStops.length} 站
              </span>
              <span className="text-muted-foreground">
                完成度 {Math.round((routeProgress / routeStops.length) * 100)}%
              </span>
            </div>
            <Progress value={(routeProgress / routeStops.length) * 100} className="mt-2" />
          </div>

          <article className="rounded-md border border-border bg-card p-5">
            <Badge variant="secondary">{loc?.category}</Badge>
            <h2 className="mt-2 text-lg font-semibold text-navy">{loc?.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {loc?.latitude.toFixed(4)}, {loc?.longitude.toFixed(4)}
            </p>
            <p className="mt-3 text-sm font-medium">核心问题：{stop.question}</p>
            <p className="mt-1 text-sm text-muted-foreground">现场提示：{stop.hint}</p>

            <div className="mt-4 rounded-md bg-paleeco p-3">
              <p className="text-sm font-medium text-navy">{stop.quiz.question}</p>
              <div className="mt-2 space-y-1">
                {stop.quiz.options.map((o, i) => (
                  <button
                    key={o}
                    onClick={() => setPicked(i)}
                    className={`block w-full rounded-sm border px-2 py-1.5 text-left text-sm ${
                      picked === i
                        ? i === stop.quiz.answerIndex
                          ? "border-mangrove bg-card"
                          : "border-coral bg-card"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {picked !== null && (
                <p className="mt-2 text-sm leading-6">
                  {picked === stop.quiz.answerIndex ? "回答正确。" : "换个角度想想。"}
                  {stop.quiz.explain}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {loc && (
                <Button asChild variant="outline">
                  <Link to="/location/$id" params={{ id: loc.id }}>
                    查看地点故事
                  </Link>
                </Button>
              )}
              <Button
                disabled={picked === null}
                onClick={() => {
                  setPicked(null);
                  advanceRoute();
                }}
              >
                {index === routeStops.length - 1 ? "完成路线" : "前往下一站"}
              </Button>
              <Button variant="ghost" onClick={resetRoute}>
                退出路线
              </Button>
            </div>
            {picked === null && (
              <p className="mt-2 text-xs text-muted-foreground">先回答本站问题，再前往下一站。</p>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
