import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpenCheck, ExternalLink, Microscope, ShieldCheck } from "lucide-react";
import { learningSources } from "@/data/learning";
import { Badge } from "@/components/ui/badge";
import reportPatrolFindings from "@/assets/2023-citizen-observation-patrol-findings.png";
import reportRapidTestTable from "@/assets/2023-citizen-observation-rapid-test-table.png";
import reportSitesMap from "@/assets/2023-citizen-observation-sites-map.png";
import { useLanguage } from "@/lib/language";

const reportStats = [
  { value: "73 起", label: "水环境污染信息" },
  { value: "33 起", label: "生态环境损害举报" },
  { value: "17 次", label: "推动属地处理" },
  { value: "40 场次", label: "水环境巡护及调查" },
  { value: "1177 人次", label: "环境志愿服务" },
  { value: "5172 小时", label: "志愿服务时长" },
  { value: "33,312 公里", label: "涉水行程" },
];

const ENGLISH_GREEN_SOURCE_TITLES: Record<string, string> = {
  "outfall-source": "Shenzhen Bay Outfall Survey: Published 2015 Records",
  "sengo-wetland": "Coastal Wetland Conservation",
  "sengo-water": "Deep Flowing Water: Watershed Stewardship Programme",
  "sengo-2023-observation": "Deep Flowing Water | 2023 Citizen Micro-observation Report",
  "sengo-patrol-2025-01": "Mangrove Rangers: Professional Training and Wetland Stewardship",
  "sengo-patrol-2025-04": "Mangrove Ranger Training Review · 2025-04",
  "sengo-patrol-2025-05": "Mangrove Ranger Team Training Review · 2025-05",
  "sengo-2024-q3": "Green Source 2024 Third-quarter Work Briefing",
};

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "学习资料库 | 湾区生态侦探 v1.0 公测版" },
      {
        name: "description",
        content: "查看深圳湾生态学习题目使用的政府标准、专业教育指南与公开数据来源。",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { language } = useLanguage();
  if (language === "en") return <EnglishResourcesPage />;
  const groups = [
    {
      title: "绿源官方资料",
      description: "来自深圳市绿源环保志愿者协会官网同步发布的项目页、调查报告与活动回顾。",
      sources: learningSources.filter((source) => source.kind === "绿源官方资料"),
    },
    {
      title: "政府与专业资料",
      description: "用于补充监测方法、修复原则、生物观察与数据质量要求。",
      sources: learningSources.filter((source) => source.kind !== "绿源官方资料"),
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="rounded-xl border border-teal/20 bg-gradient-to-br from-paleeco to-card p-6 sm:p-8">
        <Badge className="bg-teal text-white">可追溯知识库</Badge>
        <h1 className="mt-3 text-2xl font-semibold text-navy sm:text-3xl">学习资料库</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          四章课程和地图挑战题都保留原始出处。绿源官方调查、项目页与培训回顾用于讲述深圳本地事实；
          政府标准和专业教育指南用于解释调查方法。没有获得的原始监测数据不会用推测值补齐。
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Principle
          icon={<ShieldCheck className="size-5" />}
          title="先追溯来源"
          text="优先采用政府标准、政府科普和专业机构教学资料，并保留原始链接。"
        />
        <Principle
          icon={<Microscope className="size-5" />}
          title="区分观察与结论"
          text="现场现象是线索；因果、水质等级和长期趋势需要标准方法与重复证据。"
        />
        <Principle
          icon={<BookOpenCheck className="size-5" />}
          title="允许未知"
          text="缺失、未测和未公开不是 0。明确数据边界本身就是科学素养。"
        />
      </section>

      <section className="mt-10 overflow-hidden rounded-xl border border-teal/20 bg-card">
        <div className="border-b border-border bg-gradient-to-r from-paleeco to-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <Badge className="bg-teal text-white">绿源 2023 年度报告</Badge>
              <h2 className="mt-3 text-xl font-semibold text-navy sm:text-2xl">
                碧水流深 · 民间微观察
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                以下数字与图件来自深圳市绿源环保志愿者协会发布的《2023年度民间微观察》。它们记录的是
                2023 年项目行动和采样快照，不是实时监测数据。
              </p>
            </div>
            <a
              href="https://mp.weixin.qq.com/s/6e_1tieqb8zGIk2zBL4Hhg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-teal/30 bg-white px-3 py-2 text-sm font-medium text-teal hover:border-teal"
            >
              查看原始报告
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reportStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-lg border border-border bg-background p-4"
              >
                <p className="font-mono text-lg font-semibold text-teal">{stat.value}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{stat.label}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border border-border bg-background">
              <img
                src={reportSitesMap}
                alt="报告中的 2014 至 2023 年民间河长行动足迹、2023 年走巡路线与水生生物调查点位图"
                className="h-auto w-full"
                loading="lazy"
              />
              <figcaption className="border-t border-border p-4 text-xs leading-5 text-muted-foreground">
                报告第 11 页：2014—2023 年行动足迹、2023 年走巡路线及水生生物调查点位。
                点位分布用于说明调查范围，不代表每个地点都有连续监测。
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-lg border border-border bg-background">
              <img
                src={reportRapidTestTable}
                alt="报告中的珠江流域 38 个点位水质快速检测结果表"
                className="h-auto w-full"
                loading="lazy"
              />
              <figcaption className="border-t border-border p-4 text-xs leading-5 text-muted-foreground">
                报告第 12 页：珠江流域 38 个 eDNA 采样点的现场快速检测表，列出 pH、总磷、COD
                和氨氮。网站保留原表，不自行增补水质等级。
              </figcaption>
            </figure>
          </div>

          <figure className="mt-5 overflow-hidden rounded-lg border border-border bg-background lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <img
              src={reportPatrolFindings}
              alt="报告记录的 2023 年巡河中发现的问题现场照片"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <figcaption className="flex flex-col justify-center border-t border-border p-5 text-sm leading-7 text-muted-foreground lg:border-l lg:border-t-0">
              <span className="font-semibold text-navy">巡护照片是问题线索，不是污染源鉴定。</span>
              报告将 2023
              年民间河长巡护问题归纳为污水溢流、渗漏、直排、面源污染、工程泥浆水及综合管理问题。
              照片可帮助记录位置与现象，原因仍需现场核查、规范采样和部门调查。
            </figcaption>
          </figure>

          <div className="mt-5 rounded-lg border border-coral/25 bg-coral/5 p-4 text-xs leading-6 text-muted-foreground">
            <span className="font-semibold text-navy">阅读边界：</span>
            “1177 人次”不是 1177 名不重复个人；“33,312 公里”是年度涉水行程，不是河流长度；38
            点位表是 eDNA 采样时的快速筛查，不能替代当前水质评价或实验室监测。
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.title} className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-navy">{group.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            </div>
            <Badge variant="outline">{group.sources.length} 项</Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.sources.map((source, index) => (
              <article key={source.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs text-teal">
                        SOURCE {String(index + 1).padStart(2, "0")}
                      </p>
                      {source.publishedAt && (
                        <Badge variant="secondary" className="text-[10px]">
                          {source.publishedAt}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-6 text-navy">
                      {source.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{source.publisher}</p>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`打开来源：${source.title}`}
                    className="rounded-md border border-border p-2 text-teal hover:border-teal"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </div>
                <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                  课程用途：{source.useFor}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-10 rounded-lg border border-coral/25 bg-coral/5 p-5">
        <h2 className="font-semibold text-navy">给学生的资料判断四问</h2>
        <ol className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          <li>1. 谁发布了这份资料？</li>
          <li>2. 数据在何时、何地、用什么方法获得？</li>
          <li>3. 页面展示的是原始数据、解释还是示例？</li>
          <li>4. 还有哪些缺失条件会改变结论？</li>
        </ol>
      </section>
    </main>
  );
}

function EnglishResourcesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="rounded-xl border border-teal/20 bg-gradient-to-br from-paleeco to-card p-7">
        <Badge className="bg-teal text-white">TRACEABLE SOURCES</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-navy">Learning Sources</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Map records and course explanations keep their source links. Local facts come from Green
          Source publications; professional and government guidance supports monitoring methods and
          evidence quality. Missing original data is never replaced with an estimate.
        </p>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Principle
          icon={<ShieldCheck className="size-5" />}
          title="Trace the source"
          text="Check the publisher, date and original context before interpreting a value."
        />
        <Principle
          icon={<Microscope className="size-5" />}
          title="Separate evidence from conclusions"
          text="A field observation is a clue; causes and long-term classes require comparable repeated evidence."
        />
        <Principle
          icon={<BookOpenCheck className="size-5" />}
          title="Allow unknowns"
          text="Missing, untested and unpublished do not mean zero. Transparent limits are part of science."
        />
      </section>
      <section className="mt-9 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold text-navy">Primary Green Source material</h2>
        <div className="mt-4 grid gap-3">
          {learningSources
            .filter((source) => source.kind === "绿源官方资料")
            .map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border p-4 hover:border-teal"
              >
                <p className="text-sm font-semibold text-navy">
                  {ENGLISH_GREEN_SOURCE_TITLES[source.id] ?? "Green Source project publication"}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Shenzhen Green Source Environmental Volunteers Association
                  {source.publishedAt ? ` · ${source.publishedAt}` : ""}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-teal underline">
                  Open original <ExternalLink className="size-3" />
                </span>
              </a>
            ))}
        </div>
      </section>
      <section className="mt-7 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold text-navy">2023 citizen-observation report</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          The 38 rapid-test rows used on the map are transcribed from the report table. The table
          screenshot does not show units and the report does not publish sampling GPS coordinates,
          so the site preserves those limitations.
        </p>
        <a
          href="https://mp.weixin.qq.com/s/6e_1tieqb8zGIk2zBL4Hhg"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-teal underline"
        >
          Open the published article <ExternalLink className="size-4" />
        </a>
      </section>
    </main>
  );
}

function Principle({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="text-teal">{icon}</div>
      <h2 className="mt-3 text-sm font-semibold text-navy">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </article>
  );
}
