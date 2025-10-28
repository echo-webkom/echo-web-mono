"use client";

import { memo } from "react";

import { type Group } from "@echo-webkom/db/schemas";

import { GenericPieChart } from "@/components/charts/generic-pie-chart";
import { type RegistrationWithUser } from "../../_lib/types";

type PieChartGroupsProps = {
  registrations: Array<RegistrationWithUser>;
  groups: Array<Group>;
};

export const PieChartGroups = memo(({ groups, registrations }: PieChartGroupsProps) => {
  const items = groups.map((group) => ({
    id: group.id,
    name: group.name,
    count: registrations.filter((registration) =>
      registration.user.memberships.map((m) => m.group?.id).includes(group.id),
    ).length,
  }));

  return <GenericPieChart items={items} hideLabel />;
});
PieChartGroups.displayName = "PieChartGroups";
