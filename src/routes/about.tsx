import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Github, Mail } from "lucide-react";
import { useLanguage } from "@/lib/language";

const githubProfileUrl = "https://github.com/billylin036";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于项目与数据说明 | 湾区生态侦探 v1.0 公测版" },
      {
        name: "description",
        content:
          "湾区生态侦探 v1.0 公测版由 Billy Lin 开发，并与深圳市绿源环保志愿者协会开展数据合作，把生态保护资料转化为公众可探索的地图故事。",
      },
      { property: "og:title", content: "关于项目与数据说明 | 湾区生态侦探 v1.0 公测版" },
      { property: "og:description", content: "项目背景、数据来源与证据边界说明。" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { language } = useLanguage();
  if (language === "en") return <EnglishAboutPage />;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">关于项目</h1>
      <p className="mt-3 text-sm leading-7">
        「湾区生态侦探 v1.0 公测版」由 <strong>Billy Lin</strong> 开发，并与
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
        协会长期从事滨海湿地修复、生态保护、公众教育与环境监测工作。合作资料记录了坝光 8
        个红树林修复区域的整体成果，以及 2015 年深圳湾 30 个排口首次调查和 2025
        年十年回访的总体结果。
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
          地图保留报告正文同时提供公开 GPS 坐标和水体现场描述的 11 个排口，以及 2023 年报告表格中的
          38 个快速检测点。不存在真实资料支撑的示例点已移除。
        </li>
        <li>
          2025 年十年回访目前只展示 30
          个排口的整体对比；在取得逐排口原始记录前，不把总体数据写成某个点的现状。
        </li>
        <li>
          在线地图优先使用中国大陆可访问的高德地图线路，并自动切换至 OpenStreetMap / CARTO
          国际备用线路；地图点位会按底图坐标系统自动校正。
        </li>
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

function EnglishAboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">About this project</h1>
      <p className="mt-3 text-sm leading-7">
        <strong>Bay Eco Detective v1.0 Beta</strong> was developed by <strong>Billy Lin</strong> in
        data collaboration with the{" "}
        <strong>Shenzhen Green Source Environmental Volunteers Association</strong>. It turns
        published environmental material into a school-oriented learning map where students read
        evidence, solve reasoning challenges and design reproducible observations.
      </p>
      <div className="mt-5 grid gap-3 rounded-lg border border-teal/25 bg-paleeco p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-teal">Website development</p>
          <p className="mt-1 text-sm font-semibold text-navy">Billy Lin</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Product design, development and interaction
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-teal">Data collaboration</p>
          <p className="mt-1 text-sm font-semibold text-navy">
            Shenzhen Green Source Environmental Volunteers Association
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Environmental project material and data
          </p>
        </div>
      </div>
      <h2 className="mt-7 text-lg font-semibold text-navy">Contact and project</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <a
          href="mailto:billylin036@gmail.com"
          className="flex items-center gap-3 rounded-lg border p-4"
        >
          <Mail className="size-5 text-teal" />
          <span>
            <span className="block text-xs text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-navy">billylin036@gmail.com</span>
          </span>
        </a>
        <a
          href={githubProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg border p-4"
        >
          <Github className="size-5 text-teal" />
          <span className="text-sm font-medium text-navy">Billy Lin on GitHub</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
      <h2 className="mt-8 text-lg font-semibold text-navy">Evidence policy</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
        <li>
          The map includes 11 outfalls with published 2015 coordinates and field descriptions, plus
          38 rapid-test rows from the 2023 report.
        </li>
        <li>
          The 38 report rows did not publish sampling GPS coordinates. Their markers are
          place-name-matched reference locations and are labelled accordingly.
        </li>
        <li>
          Missing units, unpublished measurements and unknown current conditions are stated
          explicitly rather than filled with estimates.
        </li>
        <li>
          Historical observations describe their survey period; they do not establish current water
          quality.
        </li>
        <li>Learning progress remains in the current browser.</li>
      </ul>
      <p className="mt-6 text-xs leading-6 text-muted-foreground">
        © 2026 Billy Lin. Original product design, code and explanatory writing retain attribution.
        Source organisations retain rights to their own material; see the Sources page.
      </p>
      <div className="mt-6 flex gap-4 text-sm">
        <Link to="/" className="text-teal underline">
          Open map
        </Link>
        <Link to="/learn" className="text-teal underline">
          Start learning
        </Link>
        <Link to="/resources" className="text-teal underline">
          View sources
        </Link>
      </div>
    </main>
  );
}
