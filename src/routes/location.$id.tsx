import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getLocation, YEARS } from "@/data/locations";
import { StoryPanel } from "@/components/StoryPanel";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/location/$id")({
  loader: ({ params }) => {
    const loc = getLocation(params.id);
    if (!loc) throw notFound();
    return { name: loc.name, summary: loc.summary };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} | 湾区生态侦探` : "地点未找到 | 湾区生态侦探";
    const desc = loaderData?.summary ?? "该地点不存在或已被移除。";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: LocationNotFound,
  component: LocationPage,
});

function LocationNotFound() {
  const { tr } = useLanguage();
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-navy">
        {tr("没有找到这个地点", "Location not found")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {tr(
          "它可能已被移除，或链接有误。",
          "It may have been removed, or the link may be incorrect.",
        )}
      </p>
      <Button asChild className="mt-4">
        <Link to="/">{tr("返回地图", "Back to map")}</Link>
      </Button>
    </main>
  );
}

function LocationPage() {
  const { tr } = useLanguage();
  const { id } = Route.useParams();
  const loc = getLocation(id);
  const [year, setYear] = useState(2025);
  if (!loc) return <LocationNotFound />;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/">{tr("返回地图", "Back to map")}</Link>
        </Button>
        <label className="text-xs text-muted-foreground">{tr("查看年份", "View year")}</label>
        <select
          className="h-8 rounded-md border border-input bg-card px-2 text-sm"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
              {tr(" 年", "")}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <StoryPanel
          location={loc}
          year={year}
          onClose={() => history.back()}
          onNavigate={(id) => window.location.assign(`/?location=${encodeURIComponent(id)}`)}
        />
      </div>
    </main>
  );
}
