"use client";

import { memo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type RegistrationWithUser } from "../../_lib/types";

type AreaChartRegistrationsOverTimeProps = {
  registrations: Array<RegistrationWithUser>;
};

export const AreaChartRegistrationsOverTime = memo(
  ({ registrations }: AreaChartRegistrationsOverTimeProps) => {
    const filteredRegistrations = registrations
      .filter((r) => r.status === "registered")
      .sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    const chartData: Array<{ time: string; count: number; total: number }> =
      filteredRegistrations.reduce(
        (acc, curr) => {
          const date = new Date(curr.createdAt);
          const time = `${date.getMonth() + 1}-${date.getDate()}`;

          const last = acc[acc.length - 1];
          if (last && last.time === time) {
            last.count += 1;
            last.total = (acc[acc.length - 2]?.total ?? 0) + last.count;
          } else {
            acc.push({ time, count: 1, total: (last?.total ?? 0) + 1 });
          }
          return acc;
        },
        [] as Array<{ time: string; count: number; total: number }>,
      );

    const chartConfig = chartData.reduce(
      (acc, curr) => {
        acc[curr.time] = {
          label: curr.time,
        };
        return acc;
      },
      {} as Record<string, { label: string }>,
    );

    return (
      <div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="count"
              type="linear"
              fillOpacity={0.4}
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            {/* Optional: Add a separate line for the total */}
            <Area
              dataKey="total"
              type="linear"
              fillOpacity={0.2}
              fill="var(--secondary)"
              stroke="var(--secondary)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    );
  },
);
AreaChartRegistrationsOverTime.displayName = "AreaChartRegistrationsOverTime";
