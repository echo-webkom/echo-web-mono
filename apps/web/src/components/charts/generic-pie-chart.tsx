"use client";

import { memo } from "react";
import { Legend, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { randomHexColor } from "@/lib/color";

type PieChartItem = {
  id: string;
  name: string;
  count: number;
};

type GenericPieChartProps = {
  items: Array<PieChartItem>;
  chartTooltipFormatter?: (value: number, name: string) => string;
  hideLabel?: boolean;
};

export const GenericPieChart = memo(
  ({ items, chartTooltipFormatter, hideLabel = false }: GenericPieChartProps) => {
    const chartData = items.map((item) => {
      const color = randomHexColor();

      return {
        id: item.id,
        count: item.count,
        fill: color,
      };
    });

    const chartConfig = items.reduce(
      (acc, item) => {
        acc[item.id] = {
          label: item.name,
        };
        return acc;
      },
      {} as Record<string, { label: string }>,
    );

    return (
      <div>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent hideLabel={hideLabel} formatter={chartTooltipFormatter} />
              }
            />
            <Pie data={chartData} dataKey="count" nameKey="id" />
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
    );
  },
);
GenericPieChart.displayName = "GenericPieChart";
