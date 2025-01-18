"use client";

import { memo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type RegistrationWithUser } from "../../_lib/types";

type BarChartYearProps = {
  registrations: Array<RegistrationWithUser>;
};

const YEARS = [1, 2, 3, 4, 5, 6];

const COLORS = ["#4F46E5", "#FFC700", "#FF6F00", "#FF0000", "#00FF00", "#00FFFF", "#FF00FF"];

const chartConfig: Record<number, { label: string }> = {
  1: { label: "1. året" },
  2: { label: "2. året" },
  3: { label: "3. året" },
  4: { label: "4. året" },
  5: { label: "5. året" },
  6: { label: "PhD/Annet" },
};

export const BarChartYear = memo(({ registrations }: BarChartYearProps) => {
  const chartData = YEARS.map((year) => {
    const count = registrations.filter((registration) => registration.user.year === year).length;
    return {
      year,
      count,
      fill: COLORS[year - 1],
    };
  });

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            tickFormatter={(value) => chartConfig[value]!.label}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dashed"
                formatter={(value) => `Antall påmeldinger: ${value}`}
              />
            }
          />

          <Bar dataKey="count" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
});

BarChartYear.displayName = "BarChartYear";
