import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpenCheck, ExternalLink, Microscope, ShieldCheck } from "lucide-react";
import { learningSources } from "@/data/learning";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "学习资料库 | 湾区生态侦探" },
      {
        name: "description",
        content: "查看深圳湾生态学习题目使用的政府标准、专业教育指南与公开数据来源。",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
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

function Principle({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="text-teal">{icon}</div>
      <h2 className="mt-3 text-sm font-semibold text-navy">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </article>
  );
}
