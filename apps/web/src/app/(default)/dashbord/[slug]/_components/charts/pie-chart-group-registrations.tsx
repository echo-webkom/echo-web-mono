"use client";

import { memo } from "react";
import { Legend, Pie, PieChart } from "recharts";

import { type Group } from "@echo-webkom/db/schemas";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { randomHexColor } from "@/lib/color";
import { type RegistrationWithUser } from "../../_lib/types";

type PieChartGroupsProps = {
  registrations: Array<RegistrationWithUser>;
  groups: Array<Group>;
};

export const PieChartGroups = memo(({ groups, registrations }: PieChartGroupsProps) => {
  const chartData: Array<{ groupId: string; count: number }> = groups.map((group) => {
    const color = randomHexColor();
    return {
      groupId: group.id,
      count: registrations.filter((registration) =>
        registration.user.memberships.map((m) => m.group?.id).includes(group.id),
      ).length,
      fill: color,
    };
  });

  const chartConfig = groups.reduce(
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="count" nameKey="groupId" />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
});
PieChartGroups.displayName = "PieChartGroups";
