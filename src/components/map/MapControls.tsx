import { Search, X } from "lucide-react";
import { locations } from "@/data/locations";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
          placeholder="搜索排口，如「B4」「大沙河」"
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
