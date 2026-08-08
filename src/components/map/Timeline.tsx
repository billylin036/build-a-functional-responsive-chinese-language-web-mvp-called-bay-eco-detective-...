import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { YEARS } from "@/data/locations";
import { Button } from "@/components/ui/button";

export function Timeline({
  year,
  onChange,
  event,
}: {
  year: number;
  onChange: (y: number) => void;
  event?: string | undefined;
}) {
  const [playing, setPlaying] = useState(false);
  const yearRef = useRef(year);
  yearRef.current = year;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const next = yearRef.current + 1;
      if (next > YEARS[YEARS.length - 1]!) {
        setPlaying(false);
        return;
      }
      onChange(next);
    }, 1200);
    return () => clearInterval(id);
  }, [playing, onChange]);

  return (
    <div className="border-t border-border bg-card/95 px-3 py-2 backdrop-blur">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex shrink-0 items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            aria-label={playing ? "暂停" : "播放"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="重置到 2015 年"
            onClick={() => {
              setPlaying(false);
              onChange(YEARS[0]!);
            }}
          >
            <RotateCcw className="size-4" />
          </Button>
          <span className="ml-1 w-14 text-lg font-semibold tabular-nums text-navy">{year}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => {
                  setPlaying(false);
                  onChange(y);
                }}
                aria-pressed={y === year}
                className={`shrink-0 rounded-sm px-2 py-1 text-xs tabular-nums transition-colors ${
                  y === year
                    ? "bg-teal text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-paleeco"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground" aria-live="polite">
        {event ? `${year} 年大事：${event}` : `${year} 年：无重点事件记录，可拖动时间轴查看变化`}
      </p>
    </div>
  );
}
