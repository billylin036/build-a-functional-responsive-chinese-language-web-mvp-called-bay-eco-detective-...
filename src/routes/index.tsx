import { createFileRoute } from "@tanstack/react-router";
import { MapExplorer } from "@/components/MapExplorer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "湾区生态侦探 | 深圳湾互动科普地图" },
      {
        name: "description",
        content:
          "面向学校与学生的深圳湾互动学习地图：探索具有公开坐标和历史水体观察的排口点位，逐点学习并完成测验。",
      },
      { property: "og:title", content: "湾区生态侦探 | 深圳湾互动科普地图" },
      {
        property: "og:description",
        content:
          "探索深圳湾 2015 年公开排口坐标与历史水体观察，用地图学习、地点测验和综合评估理解证据边界。",
      },
    ],
  }),
  component: MapExplorer,
});
