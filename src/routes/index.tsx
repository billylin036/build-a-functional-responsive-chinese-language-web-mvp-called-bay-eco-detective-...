import { createFileRoute } from "@tanstack/react-router";
import { MapExplorer } from "@/components/MapExplorer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "湾区生态侦探 | 深圳湾互动科普地图" },
      {
        name: "description",
        content:
          "面向学校与学生的深圳湾互动学习地图：探索红树林修复与公开排口数据，逐点学习并完成测验。",
      },
      { property: "og:title", content: "湾区生态侦探 | 深圳湾互动科普地图" },
      {
        property: "og:description",
        content: "探索深圳湾红树林修复与公开排口数据，用地图学习、地点测验和综合评估理解生态变化。",
      },
    ],
  }),
  component: MapExplorer,
});
