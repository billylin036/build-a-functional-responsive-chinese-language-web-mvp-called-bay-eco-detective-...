import { CornerDownLeft, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { locations } from "@/data/locations";

export function LocationSearch({ onPick }: { onPick: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  const results = useMemo(
    () =>
      normalizedQuery
        ? locations
            .filter((location) => {
              const searchableValues = [
                location.name,
                location.id,
                location.category,
                location.summary,
                location.waterSample?.basin,
                ...(location.indicators ?? []).map((indicator) => indicator.value),
              ].filter((value): value is string => Boolean(value));
              return searchableValues.some((value) =>
                value.toLocaleLowerCase("zh-CN").includes(normalizedQuery),
              );
            })
            .slice(0, 10)
        : [],
    [normalizedQuery],
  );

  const pickResult = (id: string) => {
    onPick(id);
    setQuery("");
  };

  return (
    <div className="relative">
      <form
        className="flex items-center gap-2 rounded-lg border border-teal/30 bg-card px-2 shadow-lg"
        role="search"
        aria-label="地图地点搜索"
        onSubmit={(event) => {
          event.preventDefault();
          const firstResult = results[0];
          if (firstResult) pickResult(firstResult.id);
        }}
      >
        <Search className="size-4 shrink-0 text-teal" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="搜索地点名称，例如：东江、孔江水库"
          className="h-10 border-0 px-0 shadow-none focus-visible:ring-0"
          aria-label="搜索地点名称"
          autoComplete="off"
        />
        {query && (
          <button type="button" aria-label="清除搜索" onClick={() => setQuery("")}>
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
        <button
          type="submit"
          disabled={results.length === 0}
          aria-label="跳转到首个搜索结果"
          className="inline-flex h-7 items-center gap-1 rounded bg-teal px-2 text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          前往
          <CornerDownLeft className="size-3" />
        </button>
      </form>

      {normalizedQuery && (
        <div
          className="absolute z-500 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-border bg-card shadow-xl"
          role="listbox"
          aria-label="搜索结果"
        >
          {results.length === 0 ? (
            <p className="px-3 py-3 text-xs leading-5 text-muted-foreground">
              没有找到地图内地点。可尝试河流、流域、水库、湿地或报告点名称。
            </p>
          ) : (
            <>
              <p className="border-b border-border px-3 py-1.5 text-[10px] text-muted-foreground">
                找到 {results.length} 个结果 · 按 Enter 直接前往第一个
              </p>
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  role="option"
                  onClick={() => pickResult(result.id)}
                  className="flex w-full items-start gap-2 border-b border-border/60 px-3 py-2.5 text-left text-xs last:border-0 hover:bg-paleeco"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-teal" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-navy">{result.name}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {result.waterSample?.basin ?? result.category} · {result.id.toUpperCase()}
                    </span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
