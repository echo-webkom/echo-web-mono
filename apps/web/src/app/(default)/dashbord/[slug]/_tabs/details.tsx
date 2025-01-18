import { getStudentGroups } from "@/data/groups/queries";
import { AreaChartRegistrationsOverTime } from "../_components/charts/area-chart-registrations-over-time";
import { PieChartGroups } from "../_components/charts/pie-chart-group-registrations";
import { type RegistrationWithUser } from "../_lib/types";

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-medium">{children}</h2>
);

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border bg-muted px-3 py-8 text-center">{children}</div>
);

const Stat = ({ title, value }: { title: string; value: string }) => (
  <Box>
    <p className="mb-2 text-muted-foreground">{title}</p>
    <p className="text-7xl font-medium">{value}</p>
  </Box>
);

type DetailsTabProps = {
  registrations: Array<RegistrationWithUser>;
};

export const DetailsTab = async ({ registrations }: DetailsTabProps) => {
  const groups = await getStudentGroups();

  const registered = registrations.filter((registration) => registration.status === "registered");
  const waitlist = registrations.filter((registration) => registration.status === "waiting");
  const unregistered = registrations.filter(
    (registration) => registration.status === "unregistered",
  );
  const removed = registrations.filter((registration) => registration.status === "removed");

  return (
    <div className="mt-8 flex flex-col gap-6">
      <Heading>Oversikt</Heading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Stat title="Antall påmeldte" value={registered.length.toString()} />
        <Stat title="Antall på venteliste" value={waitlist.length.toString()} />
        <Stat title="Antall avmeldt" value={unregistered.length.toString()} />
        <Stat title="Antall fjernet" value={removed.length.toString()} />
      </div>

      <Heading>Grafer</Heading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Box>
          <PieChartGroups groups={groups} registrations={registrations} />
        </Box>
        <Box>
          <AreaChartRegistrationsOverTime registrations={registrations} />
        </Box>
      </div>
    </div>
  );
};
