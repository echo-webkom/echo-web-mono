import { getStudentGroups } from "@/data/groups/queries";
import { type getFullHappening } from "@/data/happenings/queries";
import { Box } from "../_components/box";
import { AreaChartRegistrationsOverTime } from "../_components/charts/area-chart-registrations-over-time";
import { BarChartYear } from "../_components/charts/bar-chart-year-registrations";
import { PieChartDegrees } from "../_components/charts/pie-chart-degree-registrations";
import { PieChartGroups } from "../_components/charts/pie-chart-group-registrations";
import { FastestRegistrations } from "../_components/fastest-registrations";
import { Heading } from "../_components/heading";
import { type RegistrationWithUser } from "../_lib/types";
import { uno } from "../../../../../api/client";
import { PizzaFormel } from "../../../../../components/pizza-formel";

const Stat = ({ title, value }: { title: string; value: string }) => (
  <Box className="text-center">
    <p className="text-muted-foreground mb-2">{title}</p>
    <p className="text-7xl font-medium">{value}</p>
  </Box>
);

type StatisticsTabProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

export const StatisticsTab = async ({ happening, registrations }: StatisticsTabProps) => {
  const [groups, degrees] = await Promise.all([getStudentGroups(), uno.degrees.all()]);

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

      {happening.registrationStart && (
        <>
          <Heading>Raskeste påmeldinger</Heading>
          <FastestRegistrations happening={happening} registrations={registrations} />
        </>
      )}

      <Heading>Grafer</Heading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Box>
          <PieChartGroups groups={groups} registrations={registrations} />
        </Box>
        <Box>
          <AreaChartRegistrationsOverTime registrations={registrations} />
        </Box>
        <Box>
          <PieChartDegrees degrees={degrees} registrations={registrations} />
        </Box>
        <Box>
          <BarChartYear registrations={registrations} />
        </Box>
      </div>

      <Heading>Pizza</Heading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Box>
          <PizzaFormel count={registered.length} />
        </Box>
      </div>
    </div>
  );
};
