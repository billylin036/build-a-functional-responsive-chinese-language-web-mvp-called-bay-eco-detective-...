import { Layers, Search, X } from "lucide-react";
import type { LocationType } from "@/data/types";
import { locations } from "@/data/locations";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LAYER_META: { id: LocationType; label: string; color: string; desc: string }[] = [
  { id: "mangrove", label: "红树林修复地", color: "bg-mangrove", desc: "8 处修复地块" },
  { id: "outfall", label: "入湾排口与水质", color: "bg-teal", desc: "30 个监测排口" },
  { id: "task", label: "公众观察任务点", color: "bg-coral", desc: "公众可参与" },
];

export function LayerControls({
  active,
  onToggle,
}: {
  active: LocationType[];
  onToggle: (id: LocationType) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-card/95 p-3 shadow-sm backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy">
        <Layers className="size-4" /> 数据图层
      </div>
      <div className="space-y-1.5">
        {LAYER_META.map((l) => {
          const on = active.includes(l.id);
          return (
            <button
              key={l.id}
              onClick={() => onToggle(l.id)}
              aria-pressed={on}
              className={`flex w-full items-center gap-2 rounded-sm border px-2 py-1.5 text-left text-xs transition-colors ${
                on ? "border-teal bg-paleeco" : "border-border bg-card opacity-60 hover:opacity-100"
              }`}
            >
              <span className={`size-3 shrink-0 rounded-full ${l.color}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{l.label}</span>
                <span className="block truncate text-muted-foreground">{l.desc}</span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {on ? "显示中" : "已隐藏"}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 border-t border-border pt-2 text-[11px] leading-5 text-muted-foreground">
        <div className="mb-1 font-medium text-navy">图例</div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-mangrove" />
          红树林修复地
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-teal" />
          排口（当年有水）
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: "#C7803F" }} />
          排口（微流/干涸）
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-coral" />
          公众任务点
        </div>
      </div>
    </div>
  );
}

export function LocationSearch({ onPick }: { onPick: (id: string) => void }) {
  const [q, setQ] = useState("");
  const normalizedQuery = q.trim().toLocaleLowerCase("zh-CN");
  const results = normalizedQuery
    ? locations
        .filter((location) =>
          [location.name, location.id, location.category, location.summary].some((value) =>
            value.toLocaleLowerCase("zh-CN").includes(normalizedQuery),
          ),
        )
        .slice(0, 8)
    : [];
  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 shadow-sm">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索地点，如「红树林」「OF-04」"
          className="h-9 border-0 px-0 shadow-none focus-visible:ring-0"
          aria-label="搜索地点"
        />
        {q && (
          <button aria-label="清除搜索" onClick={() => setQ("")}>
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
      {normalizedQuery && (
        <div
          className="absolute z-500 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-card shadow-md"
          role="listbox"
          aria-label="搜索结果"
        >
          {results.length === 0 ? (
            <p className="px-3 py-3 text-xs text-muted-foreground">
              没有找到匹配的地点，换个关键词试试。
            </p>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                type="button"
                role="option"
                onClick={() => {
                  onPick(r.id);
                  setQ("");
                }}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-paleeco"
              >
                <span className="block font-medium">{r.name}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {r.category} · {r.id.toUpperCase()}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
