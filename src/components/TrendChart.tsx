import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import type { AnnualData } from "@/data/types";

export function TrendChart({
  data,
  year,
  dataKey = "waterQuality",
  label = "水质评分",
}: {
  data: AnnualData[];
  year: number;
  dataKey?: "waterQuality" | "mangroveCoverage" | "survivalRate" | "observationCount";
  label?: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
        暂无趋势数据
      </div>
    );
  }
  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={38} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid var(--border)",
            }}
            formatter={(v: number | string) => [`${v}`, label]}
            labelFormatter={(l) => `${l} 年`}
          />
          <ReferenceLine x={year} stroke="var(--coral)" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="var(--teal)"
            strokeWidth={2}
            fill="url(#trendFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
