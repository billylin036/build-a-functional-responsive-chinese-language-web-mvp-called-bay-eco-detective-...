import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Github, Mail } from "lucide-react";

const githubProfileUrl = "https://github.com/billylin036";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于项目与数据说明 | 湾区生态侦探" },
      {
        name: "description",
        content:
          "湾区生态侦探由 Billy Lin 开发，并与深圳市绿源环保志愿者协会开展数据合作，把生态保护资料转化为公众可探索的地图故事。",
      },
      { property: "og:title", content: "关于项目与数据说明 | 湾区生态侦探" },
      { property: "og:description", content: "项目背景、数据来源与示例数据说明。" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">关于项目</h1>
      <p className="mt-3 text-sm leading-7">
        「湾区生态侦探」由 <strong>Billy Lin</strong> 开发，并与
        <strong>深圳市绿源环保志愿者协会</strong>
        开展数据合作。网站把生态保护资料转化为一张面向学校的深圳湾学习地图：学生需要阅读证据、
        解决情境题，并完成可重复的观察记录。
      </p>
      <div className="mt-4 grid gap-3 rounded-lg border border-teal/25 bg-paleeco p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-teal">网站开发</p>
          <p className="mt-1 text-sm font-semibold text-navy">Billy Lin</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            产品设计、网站开发与交互体验
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-teal">数据合作</p>
          <p className="mt-1 text-sm font-semibold text-navy">深圳市绿源环保志愿者协会</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">生态项目资料与环境数据合作</p>
        </div>
      </div>

      <section aria-labelledby="contact-heading" className="mt-6">
        <h2 id="contact-heading" className="text-lg font-semibold text-navy">
          联系与项目
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href="mailto:billylin036@gmail.com"
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-teal/60"
          >
            <span className="rounded-md bg-paleeco p-2 text-teal">
              <Mail className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs text-muted-foreground">联系邮箱</span>
              <span className="mt-1 block text-sm font-medium text-navy group-hover:text-teal">
                billylin036@gmail.com
              </span>
            </span>
          </a>
          <a
            href={githubProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-teal/60"
          >
            <span className="rounded-md bg-paleeco p-2 text-teal">
              <Github className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground">GitHub 主页</span>
              <span className="mt-1 flex items-center gap-1 text-sm font-medium text-navy group-hover:text-teal">
                查看 Billy Lin 的 GitHub 主页
                <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          © 2026 <span className="font-medium text-navy">Billy Lin</span>
          。网站产品设计、代码与原创说明保留署名；绿源资料、地图及第三方专业资料的权利归各自权利人，来源见资料库。
        </p>
      </section>
      <p className="mt-4 text-sm leading-7">
        协会长期从事滨海湿地修复、生态保护、公众教育与环境监测工作，积累了 14 年红树林修复经验、8
        个红树林修复点、30 个深圳湾入湾排口的巡查监测资料，以及 2015—2025 年的水环境监测资料。
      </p>
      <p className="mt-3 text-sm leading-7">
        这些信息此前分散在报告、表格与项目文档中。本产品的目标，是把它们转化成学生可以点击、比对、追问的学习任务：
        <span className="font-medium text-navy">
          读取证据 → 提出解释 → 完成挑战 → 规范观察 → 反思局限。
        </span>
      </p>

      <h2 className="mt-8 text-lg font-semibold text-navy">数据说明</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
        <li>
          地图点位、坐标与历史现场观察均整理自绿源公开资料；课程中的情境题和观察活动用于教学，
          <strong>不构成新的监测结论</strong>。
        </li>
        <li>
          目前尚未获得各排口可公开使用的原始水质指标，因此网站不展示推测的水质评分或达标结论。
        </li>
        <li>
          地图仅保留报告正文同时提供公开 GPS 坐标和水体现场描述的 11
          个排口；没有可核验水质信息的红树林示例点和综合学习点已移除。
        </li>
        <li>在线地图使用 OpenStreetMap 开源地图数据，版权归其贡献者所有。</li>
        <li>学生的学习进度、答题结果与证书信息仅保存在当前浏览器中。</li>
        <li>缺少的监测数据会明确标记为“待补充”，不会使用估算值代替。</li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold text-navy">适合谁使用</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
        <li>学生与家庭：围绕深圳湾地点发现红树林、水环境与生物多样性的故事。</li>
        <li>学生：通过情境题、数据比较和短时观察活动建立生态数据素养。</li>
        <li>学校与自然教育机构：组织课堂学习、项目式学习与深圳湾主题课程。</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link className="text-teal underline" to="/">
          返回地图
        </Link>
        <Link className="text-teal underline" to="/learn">
          开始学习闯关
        </Link>
        <Link className="text-teal underline" to="/resources">
          查看可靠资料库
        </Link>
      </div>
    </main>
  );
}
