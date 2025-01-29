"use client";

import { memo } from "react";
import { Legend, Pie, PieChart } from "recharts";

import { type Degree } from "@echo-webkom/db/schemas";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { randomHexColor } from "@/lib/color";
import { type RegistrationWithUser } from "../../_lib/types";

type PieChartDegreesProps = {
  degrees: Array<Degree>;
  registrations: Array<RegistrationWithUser>;
};

export const PieChartDegrees = memo(({ degrees, registrations }: PieChartDegreesProps) => {
  const chartData: Array<{ degreeId: string; count: number }> = degrees.map((degree) => {
    const color = randomHexColor();

    return {
      degreeId: degree.id,
      count: registrations.filter((registration) => registration.user.degreeId === degree.id)
        .length,
      fill: color,
    };
  });

  const chartConfig = degrees.reduce(
    (acc, curr) => {
      acc[curr.id] = {
        label: curr.name,
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
              <ChartTooltipContent
                formatter={(value, degree) => `Påmeldinger for ${degree}: ${value}`}
              />
            }
          />
          <Pie data={chartData} dataKey="count" nameKey="degreeId" />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
});
PieChartDegrees.displayName = "PieChartDegrees";
