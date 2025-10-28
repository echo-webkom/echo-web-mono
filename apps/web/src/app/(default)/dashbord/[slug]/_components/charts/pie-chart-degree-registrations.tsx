"use client";

import { memo } from "react";

import { type Degree } from "@echo-webkom/db/schemas";

import { GenericPieChart } from "@/components/charts/generic-pie-chart";
import { type RegistrationWithUser } from "../../_lib/types";

type PieChartDegreesProps = {
  degrees: Array<Degree>;
  registrations: Array<RegistrationWithUser>;
};

export const PieChartDegrees = memo(({ degrees, registrations }: PieChartDegreesProps) => {
  const items = degrees.map((degree) => ({
    id: degree.id,
    name: degree.name,
    count: registrations.filter((registration) => registration.user.degreeId === degree.id)
      .length,
  }));

  return (
    <GenericPieChart
      items={items}
      chartTooltipFormatter={(value, degree) => `Påmeldinger for ${degree}: ${value}`}
    />
  );
});
PieChartDegrees.displayName = "PieChartDegrees";
