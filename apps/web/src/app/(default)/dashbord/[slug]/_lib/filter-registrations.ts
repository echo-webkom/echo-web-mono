import { type Group } from "@echo-webkom/db/schemas";

import { type RegistrationWithUser } from "./types";
import { NO_GROUP_FILTER_VALUE, type RegistrationFilter } from "./use-registration-filter";

export const filterRegistrations = (
  registrations: Array<RegistrationWithUser>,
  studentGroups: Array<Group>,
  filters: RegistrationFilter,
) => {
  const { searchTerm, yearFilter, statusFilter, groupFilter } = filters;

  return registrations.filter((registration) => {
    const matchesSearchTerm =
      (registration.user.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.user.alternativeEmail ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYearFilter =
      yearFilter === "" || registration.user.year?.toString() === yearFilter;

    const matchesStatusFilter =
      statusFilter === "" ||
      (statusFilter === "påmeldt" && registration.status === "registered") ||
      (statusFilter === "venteliste" && registration.status === "waiting") ||
      (statusFilter === "avmeldt" && registration.status === "unregistered") ||
      (statusFilter === "fjernet" && registration.status === "removed") ||
      (statusFilter === "under behandling" && registration.status === "pending");

    const matchesGroupFilter =
      groupFilter === "" ||
      (groupFilter === NO_GROUP_FILTER_VALUE
        ? registration.user.memberships.length === 0 ||
          registration.user.memberships.every((membership) => !membership.group)
        : studentGroups.some((group) => {
            const groupName = group.name?.toLowerCase();

            if (!groupName) {
              return false;
            }

            return (
              groupFilter.toLowerCase() === groupName &&
              registration.user.memberships.some(
                (membership) => membership.group?.name?.toLowerCase() === groupName,
              )
            );
          }));
    return matchesSearchTerm && matchesYearFilter && matchesStatusFilter && matchesGroupFilter;
  });
};
