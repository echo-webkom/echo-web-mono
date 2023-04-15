# tRPC

tRPC (typed-rpc) er et rammeverk for å utvikle RPC (Remote Procedure Call)-tjenester som er type-safe. tRPC lar deg definere API-grensesnittet ditt med `zod`, som gjør det enkelt å definere og validere input og output for hver tjeneste.

For å bruke tRPC, må du definere tjenestene dine ved hjelp av tRPC API-grensesnittet. Dette gjøres ved å definere queries og mutations, og angi hva slags input og output hver tjeneste forventer.

Vi bruker routers til å organisere tjenestene våre. Hver router kan ha sine egne queries og mutations, og du kan bruke andre routers som under-routers.

Et eksempel på en tjeneste som returnerer "Hei, [Ditt navn]!" kan se slik ut:

```tsx
import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "../trpc";

export const stringRouter = createTRPCRouter({
  hello: publicProcedure.input(z.string()).query(({input}) => {
    return `Hei, ${input}!`;
  }),
});
```

tRPC genererer deretter klientkoden din automatisk, slik at du kan kommunisere med serveren din via API-et ditt.

Dette vil se slik ut i klienten (frontend):

```tsx
import {api} from "@/utils/api";

const ProfilePage = () => {
  const user = api.auth.me.useQuery({
    name: "Ola Nordmann",
  });

  return (
    <div>
      <h1>Profil</h1>
      <p>{user.data}</p>
    </div>
  );
};
```
