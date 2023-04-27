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
