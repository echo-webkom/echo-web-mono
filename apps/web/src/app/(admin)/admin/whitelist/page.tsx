import { db } from "@echo-webkom/db";

import WhitelistButton from "@/components/whitelist-button";
import { shortDateNoTime } from "@/utils/date";

export default async function WhitelistPage() {
  const whitelisted = await db.query.whitelist.findMany();

  return (
    <div className="flex flex-col gap-4 md:mx-10">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Whitelist</h1>
        <WhitelistButton className="mx-4">Legg til</WhitelistButton>
      </div>
      <table className="w-full table-fixed border-separate rounded-md border">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left text-sm font-medium text-neutral-500">
              E-post
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-medium text-neutral-500">
              Utløper
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-medium text-neutral-500">
              Grunn
            </th>
            <th className="w-32 border-b px-4 py-2 text-left text-sm font-medium text-neutral-500"></th>
          </tr>
        </thead>
        <tbody>
          {whitelisted.map((whitelistEntry) => (
            <tr key={whitelistEntry.email}>
              <td className="border-b p-4">{whitelistEntry.email}</td>
              <td className="border-b p-4">{shortDateNoTime(whitelistEntry.expiresAt)}</td>
              <td className="break-words border-b p-4">{whitelistEntry.reason}</td>
              <td className="border-b p-4 text-end">
                {
                  <WhitelistButton variant="secondary" whitelistEntry={whitelistEntry}>
                    Endre
                  </WhitelistButton>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
