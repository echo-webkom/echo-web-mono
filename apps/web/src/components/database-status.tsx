import { getDatabaseStatus } from "@/utils/database-status";

export async function DatabaseStatusBar() {
  const status = await getDatabaseStatus();

  if (!status) {
    return (
      <div className="bg-red-400 p-2 text-center text-sm font-medium">
        <p>
          Webkom har mistet kontakt med databasen. Dette er ikke bra. Vi jobber med å fikse det.
        </p>
      </div>
    );
  }

  return null;
}
