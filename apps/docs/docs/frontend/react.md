# React

ReactJS er et JavaScript-bibliotek som brukes til å bygge brukergrensesnitt (UI). Det gir utviklere muligheten til å bygge interaktive og dynamiske brukergrensesnitt ved å dele dem opp i små komponenter som kan gjenbrukes og oppdateres separat fra resten av grensesnittet.

## Komponenter

I vår kode bruker vi funksjonelle komponenter, som er enklere å lese og skrive enn klassekomponenter. Komponenter hjelper oss med å dele opp grensesnittet i små, gjenbrukbare deler, og gjør det enklere å vedlikeholde og oppdatere koden.

```jsx
const HelloWorld = () => {
  return (
    <div>
      <h1>Hei, verden!</h1>
    </div>
  );
};
```

## Props

Props er en liste med egenskaper som sendes inn til en komponent. Props kan være alt fra tekststrenger til funksjoner, og brukes til å sende data fra en komponent til en annen. Props kan også brukes til å sende inn funksjoner som kan kalles fra en komponent.

```jsx
const Page = () => {
  return (
    <div>
      <SayHello name="Bo">
    </div>
  )
}

const SayHello = (props) => {
  return (
    <>
      <h1>Hei, {props.name}!</h1>
    </>
  )
}
```

:::note Merk
Props er read-only, og kan ikke endres av komponenten som mottar dem.
:::

:::tip Tips
Du kan bruke destructuring for å hente ut props fra et objekt. Dette er den anbefalte måten å hente ut props på.

```jsx
const SayHello = ({name}) => {
  return (
    <>
      <h1>Hei, {name}!</h1>
    </>
  );
};
```

:::

## Hooks

Hooks er funksjoner som lar deg bruke React-funksjoner som `useState` og `useEffect` i funksjonelle komponenter. Den mest brukte hooken er `useState`, som lar deg opprette og oppdatere tilstander i en komponent.

Eksempel på bruk av `useState`:

```jsx
const CoolComponent = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Hei, verden!</h1>
      <p>Du har klikket {count} ganger.</p>
      <button onClick={increment}>Klikk meg!</button>
    </div>
  );
};
```

Les mer om hooks i [React sin dokumentasjon](https://react.dev/reference/react).

## JSX

JSX er en syntaksutvidelse for JavaScript som lar deg skrive HTML-kode direkte i JavaScript. JSX-kode kompileres til vanlig JavaScript-kode, og kan derfor brukes i React-komponenter.

## TypeScript

TypeScript er et programmeringsspråk som er bygget på JavaScript, som gjør det mulig å skrive mer strukturert kode ved hjelp av å legge til typer for variabler og funksjoner.

Mer om TypeScript finner du i [TypeScript-dokumentasjonen](https://www.typescriptlang.org/docs/).

## React Server Components

På nettsiden bruker vi Next.js 13 med [app-router](https://nextjs.org/docs/app), dette gjør også at vi bruker
[React Server Components (RSC)](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). RSC er en ny måte å skrive React på som fokuserer på å rendre komponenter på serveren. Dette gjør at vi kan sende mindre kode til brukeren, og dermed få en raskere nettside.

På grunn av dette så blir også måte man skriver komponenter litt annerledes. Du kan for eksempel hente ut data fra databasen i komponenten din, uten at brukeren har tilgang til denne koden.

```jsx
async function ServerComponent() {
  const data = await getDataFromDatabase();

  return (
    <div>
      <h1>I am a Server Component</h1>
      <p>{data}</p>
    </div>
  );
}
```

### Ulemper

Server components kan ikke bruke hooks `useEffect`, `useState`, osv. Dette er fordi denne koden blir kjørt på clienten, og serveren har ikke tilgang til dette. Det man kan gjøre er å skrive en komponent hvor man eksplisitt sier at den skal kjøres på client.

```jsx title="components/client-component.jsx"
"use client";

function ClientComponent() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);

  return (
    <div>
      <h1>I am a Client Component</h1>
      <button onClick={increment}>{count}</button>
    </div>
  );
}
```

:::note MERK
Her bruker `"use client";` øverst i filen for å si at denne komponenten skal kjøres på client.
:::
