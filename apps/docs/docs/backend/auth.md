# Auth.js (NextAuth.js)

Auth.js, tidligere kjent som NextAuth.js, er en pakke som lar oss håndtere autentisering og autorisering i våre applikasjoner. Prisma har også en adapter for Auth.js, som gjør det enklere for oss å bruke Auth.js med Prisma.

## Innlogging

For å kunne bruke Auth.js, må vi først definere en `provider` for Auth.js. En `provider` er en tjeneste som vi kan bruke for å logge inn. Vi har definert våres egen provider for Feide. Da kan vi bruke Feide for å logge inn i applikasjonen vår.

Når en bruker har logget inn kan vi bruke `useSession`-hooken til Auth.js for å hente ut informasjon om brukeren. Om brukeren ikke er logget inn, vil `useSession`-hooken returnere `null`.

Vi har også lagt til litt ekstra data i `User`-typen vår, som gjør at vi også lett kan hente ut litt ekstra informasjon om brukeren, som `id`, `alternativeEmail`, `role`, `degree` og `year`. (Se `packages/auth/src/auth-options.ts`)

## Beskytte sider

For å beskytte sider i Next.js, kan vi bruke `getServerSideProps`-funksjonen. Denne funksjonen vil kjøre på serveren, og vi kan bruke den til å sjekke om brukeren er logget inn. Hvis brukeren ikke er logget inn, kan vi sende brukeren til en annen side, eller vise en feilmelding.

Gitt at du allerede har laget en side, kan du også legge til denne funksjonen for å beskytte siden:

```tsx
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Henter ut session fra Auth.js
  const session = await getServerSession(ctx);

  // Hvis session er null, vil brukeren bli sendt til /auth/signin
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  // Hvis session ikke er null, vil brukeren få lov til å se siden
  return {
    props: {
      session,
    },
  };
};
```

:::note Merk
`getServerSideProps`-funksjonen vil kun kjøre på serveren. Dette vil si at alt av logikk som kjøres i denne funksjonen vil være skjult for brukeren.
:::

:::note Merk
Vi returnerer `session` som en prop til siden, men man skal ikke bruke denne propen i komponenten for siden. Hvis du vil hente ut session, kan du bruke `useSession`-hooken. Ved å returnere `session` som en prop, kan vi hente ut session på client uten å gjøre en ekstra kall til databasen.
:::
