import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Repeat2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocation } from "@/data/locations";
import { monitoringStations, nextObservationDate, type MonitoringStation } from "@/data/stations";
import { useAppState, type StationClaim, type Submission } from "@/lib/app-state";

export const Route = createFileRoute("/stations")({
  head: () => ({
    meta: [
      { title: "生态共测站 | 湾区生态侦探" },
      {
        name: "description",
        content: "认领深圳湾固定生态观察点，按统一方法持续记录，让公众观察形成可比较的长期数据。",
      },
    ],
  }),
  component: StationsPage,
});

function StationsPage() {
  const { claimedStations, submissions, claimStation, releaseStation } = useAppState();
  const stationRecords = submissions.filter((submission) => submission.stationId);
  const abnormalRecords = stationRecords.filter((submission) => submission.unusual);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="overflow-hidden rounded-xl border border-teal/20 bg-gradient-to-br from-paleeco via-card to-card p-5 sm:p-7">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
          <div>
            <Badge className="bg-teal text-white">持续参与</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
              生态共测站
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              认领一个固定地点，按相同方法重复观察。一次记录是一条线索，长期记录才能看见趋势、发现异常，并支持机构后续核查。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <a href="#station-list">选择共测站</a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/me">查看我的贡献</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HeroStat label="开放站点" value={`${monitoringStations.length}`} />
            <HeroStat label="我已认领" value={`${claimedStations.length}`} />
            <HeroStat label="共测记录" value={`${stationRecords.length}`} />
            <HeroStat label="待核查异常" value={`${abnormalRecords.length}`} />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">一条记录如何产生价值</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FlowStep
            icon={MapPin}
            index="01"
            title="认领地点"
            text="选择离你近、方便重复到访的固定观察点。"
          />
          <FlowStep
            icon={Repeat2}
            index="02"
            title="定期共测"
            text="按每两周或每月的统一流程提交记录。"
          />
          <FlowStep
            icon={ClipboardCheck}
            index="03"
            title="交叉核验"
            text="机构审核，多名用户的同期记录相互印证。"
          />
          <FlowStep
            icon={Activity}
            index="04"
            title="形成行动"
            text="趋势和反复异常进入复查与保护工作清单。"
          />
        </div>
      </section>

      <section id="station-list" className="mt-10 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-navy">选择一个共测站</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              建议先认领 1 个，连续完成 3 次观察。
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Users className="size-3.5" />
            公众共同维护
          </Badge>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {monitoringStations.map((station) => {
            const claim = claimedStations.find((item) => item.stationId === station.id);
            const records = stationRecords.filter((record) => record.stationId === station.id);
            return (
              <StationCard
                key={station.id}
                station={station}
                claim={claim}
                records={records}
                onClaim={() => {
                  claimStation(station.id, station.name);
                  toast.success(`已认领「${station.name}」`);
                }}
                onRelease={() => {
                  releaseStation(station.id);
                  toast.success("已取消认领，共测记录仍会保留。");
                }}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-navy">
          <ShieldCheck className="size-5 text-teal" />
          数据可信度说明
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          公众提交不会自动成为科学结论。记录需要经过完整性检查、位置核对与多人交叉验证，异常情况再由机构决定是否实地复查。本
          MVP 将认领和记录保存在当前浏览器；正式上线时需接入账号、云端数据库和机构审核后台。
        </p>
      </section>
    </main>
  );
}

function StationCard({
  station,
  claim,
  records,
  onClaim,
  onRelease,
}: {
  station: MonitoringStation;
  claim: StationClaim | undefined;
  records: Submission[];
  onClaim: () => void;
  onRelease: () => void;
}) {
  const location = getLocation(station.locationId);
  const latest = records
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const nextDate = claim
    ? nextObservationDate(latest?.date ?? claim.claimedAt, station.cadenceDays)
    : null;

  return (
    <article
      className={`rounded-lg border bg-card p-4 ${claim ? "border-teal/60 shadow-sm" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-teal">{station.theme}</p>
          <h3 className="mt-1 text-base font-semibold text-navy">{station.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {location?.name ?? "深圳湾"}
          </p>
        </div>
        <Badge variant={claim ? "default" : "secondary"} className="shrink-0">
          {claim ? "已认领" : station.cadenceLabel}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-6">{station.purpose}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {station.focus.map((item) => (
          <span
            key={item}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>

      <details className="mt-3 rounded-md bg-muted/50 px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium text-navy">查看标准观察流程</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-5 text-muted-foreground">
          {station.protocol.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </details>

      {claim && (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-md border border-teal/20 bg-paleeco/50 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">已贡献</p>
            <p className="mt-0.5 font-semibold text-navy">{records.length} 条记录</p>
          </div>
          <div>
            <p className="text-muted-foreground">下次观察</p>
            <p className="mt-0.5 font-semibold text-navy">
              {formatDueDate(nextDate, records.length === 0)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {claim ? (
          <>
            <Button asChild size="sm">
              <Link to="/submit" search={{ task: station.taskId, station: station.id }}>
                提交本期观察
              </Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={onRelease}>
              取消认领
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={onClaim}>
            认领这个站点
          </Button>
        )}
        {location && (
          <Button asChild size="sm" variant="outline">
            <Link to="/location/$id" params={{ id: location.id }}>
              查看地图地点
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

function formatDueDate(date: Date | null, firstObservation: boolean) {
  if (firstObservation) return "现在即可开始";
  if (!date) return "待安排";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return `已到期 ${Math.abs(days)} 天`;
  if (days === 0) return "今天";
  if (days <= 7) return `${days} 天后`;
  return due.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-navy">{value}</p>
    </div>
  );
}

function FlowStep({
  icon: Icon,
  index,
  title,
  text,
}: {
  icon: typeof CalendarClock;
  index: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Icon className="size-5 text-teal" />
        <span className="font-mono text-xs text-muted-foreground">{index}</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </article>
  );
}
