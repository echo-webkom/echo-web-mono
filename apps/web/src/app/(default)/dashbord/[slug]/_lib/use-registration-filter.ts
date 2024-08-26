import { useState } from "react";

export type RegistrationFilter = {
  searchTerm: string;
  yearFilter: string;
  statusFilter: string;
  groupFilter: string;
};

export const defaultFilters: RegistrationFilter = {
  searchTerm: "",
  yearFilter: "",
  statusFilter: "",
  groupFilter: "",
};

export const useRegistrationFilter = () => {
  const [filters, setFilters] = useState<RegistrationFilter>(defaultFilters);

  const setSearchTerm = (searchTerm: string) => setFilters({ ...filters, searchTerm });
  const setYearFilter = (yearFilter: string) => setFilters({ ...filters, yearFilter });
  const setStatusFilter = (statusFilter: string) => setFilters({ ...filters, statusFilter });
  const setGroupFilter = (groupFilter: string) => setFilters({ ...filters, groupFilter });

  const resetFilters = () => setFilters(defaultFilters);

  return {
    filters,
    resetFilters,
    setFilters,
    setSearchTerm,
    setYearFilter,
    setStatusFilter,
    setGroupFilter,
  };
};
