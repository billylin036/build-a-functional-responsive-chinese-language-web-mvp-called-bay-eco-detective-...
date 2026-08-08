import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于项目与数据说明 | 湾区生态侦探" },
      {
        name: "description",
        content:
          "湾区生态侦探由深圳绿源环保志愿者协会提出，把红树林修复、入湾排口监测等项目材料转化为公众可交互的地图故事。",
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
        「湾区生态侦探」由深圳绿源环保志愿者协会提出，是一张能探索、会讲故事、还能参与保护的深圳湾生态地图。
        协会长期从事滨海湿地修复、生态保育、公众教育与环境监测工作，积累了 14 年红树林修复经验、8
        个红树林修复点、30 个深圳湾入湾排口的巡查监测，以及 2015—2025 年的水环境监测资料。
      </p>
      <p className="mt-3 text-sm leading-7">
        这些信息此前分散在报告、表格与项目文档中。本产品的目标，是把它们转化成公众可以点击、比对、追问的地图故事：
        <span className="font-medium text-navy">选择地点 → 比较变化 → 理解原因 → 参与行动。</span>
      </p>

      <h2 className="mt-8 text-lg font-semibold text-navy">数据说明</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
        <li>
          本演示版本使用<strong>示例数据</strong>（基于项目材料整理与模拟），
          用于教学与产品演示，<strong>不构成监测结论或官方发布数据</strong>。
        </li>
        <li>
          页面中出现的「水质达标率从 53.3% 提升到 96.7%」为示例项目数据；同期不少排口被记录为干涸，
          说明指标改善不等于生态水文过程完全恢复。
        </li>
        <li>地点坐标为示意坐标，用于地图交互演示，不代表精确点位。</li>
        <li>底图使用 OpenStreetMap 开源地图数据，版权归其贡献者所有。</li>
        <li>
          公众提交的观察记录在本演示中仅保存于你的浏览器本机，未经审核不会作为经过验证的科学结论使用。
        </li>
        <li>数据层与界面代码分离，后续可直接替换为真实 API 或数据库。</li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold text-navy">适合谁使用</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
        <li>学生与家庭：在真实地点里发现红树林、水质与生物多样性的故事。</li>
        <li>志愿者与公众：沿着观察路线记录环境状况、上传照片、提交观察记录。</li>
        <li>学校与自然教育机构：用主题路线与任务卡组织户外环境教育活动。</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link className="text-teal underline" to="/">
          返回地图
        </Link>
        <Link className="text-teal underline" to="/route">
          走一遍侦探路线
        </Link>
        <Link className="text-teal underline" to="/tasks">
          查看公众任务
        </Link>
      </div>
    </main>
  );
}
