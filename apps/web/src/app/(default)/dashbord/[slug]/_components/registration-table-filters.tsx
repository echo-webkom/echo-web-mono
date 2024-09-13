import { type Group } from "@echo-webkom/db/schemas";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type SearchFilterProps = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
};

export const SearchFilter = ({ searchTerm, setSearchTerm }: SearchFilterProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor="search">Søk:</Label>
      <Input
        id="search"
        type="text"
        placeholder="Søk etter navn eller e-post"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

type YearFilterProps = {
  yearFilter: string;
  setYearFilter: (yearFilter: string) => void;
};

export const YearFilter = ({ yearFilter, setYearFilter }: YearFilterProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor="year">Trinn:</Label>
      <Select id="year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
        <option value="">Alle</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </Select>
    </div>
  );
};

type StatusFilterProps = {
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;
};

export const StatusFilter = ({ statusFilter, setStatusFilter }: StatusFilterProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor="status">Status:</Label>
      <Select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">Alle</option>
        <option value="påmeldt">Bare påmeldt</option>
        <option value="venteliste">Bare venteliste</option>
        <option value="avmeldt">Bare avmeldt</option>
        <option value="fjernet">Bare fjernet</option>
      </Select>
    </div>
  );
};

type GroupFilterProps = {
  studentGroups: Array<Group>;
  groupFilter: string;
  setGroupFilter: (groupFilter: string) => void;
};

export const GroupFilter = ({ studentGroups, groupFilter, setGroupFilter }: GroupFilterProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor="group">Undergruppe:</Label>
      <Select id="group" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
        <option value="">Alle</option>
        {studentGroups.map((group) => (
          <option key={group.id}>{group.name}</option>
        ))}
      </Select>
    </div>
  );
};
