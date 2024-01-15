"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RequestChartProps = {
  data: Array<{
    query: string;
    params: Record<string, unknown>;
    date: Date;
  }>;
};

export function RequestChart({ data }: RequestChartProps) {
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour < 10 ? "0" : ""}${hour}:00`,
    count: 0,
  }));

  data.forEach((item) => {
    const hour = new Date(item.date).getUTCHours();

    if (hourlyData[hour]) {
      hourlyData[hour]!.count += 1;
    }
  });

  return (
    <ResponsiveContainer height="auto" width="100%">
      <BarChart height={300} width={500} data={hourlyData}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="hour" interval={4} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
