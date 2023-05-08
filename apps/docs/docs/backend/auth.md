# Auth.js (NextAuth.js)

Auth.js, tidligere kjent som NextAuth.js, er en pakke som lar oss håndtere autentisering og autorisering i våre applikasjoner. Prisma har også en adapter for Auth.js, som gjør det enklere for oss å bruke Auth.js med Prisma.

## Innlogging

For å kunne bruke Auth.js, må vi først definere en `provider` for Auth.js. En `provider` er en tjeneste som vi kan bruke for å logge inn. Vi har definert våres egen provider for Feide. Da kan vi bruke Feide for å logge inn i applikasjonen vår.

Når en bruker har logget inn kan vi bruke `useSession`-hooken til Auth.js for å hente ut informasjon om brukeren. Om brukeren ikke er logget inn, vil `useSession`-hooken returnere `null`.

Vi har også lagt til litt ekstra data i `User`-typen vår, som gjør at vi også lett kan hente ut litt ekstra informasjon om brukeren, som `id`, `alternativeEmail`, `role`, `degree` og `year`. (Se `packages/auth/src/auth-options.ts`)

## Beskytte sider

For å beskytte sider kan du bruke `getServerSession` for å sjekke om brukeren har en session (om en bruker er logget inn). Du kan også bruke `redirect` til å sende de til en annen side om de ikke er logget inn.

```tsx title="app/protected/route.tsx
import {redirect} from "next/navigation";

import {getServerSession} from "@/lib/session";

export default async function ProtectedPage() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/api/auth/signin");
  }

  return (
    <div>
      <h1>Protected page</h1>
    </div>
  );
}
```
