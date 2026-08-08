import { createFileRoute } from "@tanstack/react-router";
import { MapExplorer } from "@/components/MapExplorer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "湾区生态侦探 | 深圳湾互动科普地图" },
      {
        name: "description",
        content:
          "一张能探索、会讲故事、还能参与保护的深圳湾生态地图：红树林修复、入湾排口水质、十年时间轴与公众观察任务。",
      },
      { property: "og:title", content: "湾区生态侦探 | 深圳湾互动科普地图" },
      {
        property: "og:description",
        content: "探索深圳湾红树林修复、排口水质与公众观察任务，用时间轴发现十年生态变化。",
      },
    ],
  }),
  component: MapExplorer,
});
