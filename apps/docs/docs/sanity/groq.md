# GROQ

GROQ er et språk for å spørre data fra Sanity. Det er enkelt å lære, og lar deg spørre data på en måte som er veldig likt hvordan du spør data i JavaScript.

## Spørre data

For å spørre data fra Sanity, må du først definere et spørringsobjekt. Dette er et objekt som inneholder spørringen din, og eventuelle parametere som spørringen din trenger.

```groq
*[_type == "post"]
```

Denne spørringen vil returnere alle dokumenter av typen `post`.

Du kan også definere parametere for spørringen din. Dette gjøres ved å bruke `$`-prefiks, og navngi parametere med `camelCase`.

```groq
*[_type == $type]

// ...

{
  "type": "post",
}
```

For å gjøre disse spørringene i frontend-koden våres bruker vi `createClient`-funksjonen fra `next-sanity`-pakken for å opprette en klient som kan brukes til å spørre data fra Sanity.

```tsx title="apps/web/src/lib/sanity.client.ts"
import {createClient} from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: process.env.NODE_ENV === "production",
});

export default sanityClient;
```

Når vi har en klient, kan vi bruke `fetch`-funksjonen til å spørre data fra Sanity.

```tsx title="apps/web/src/lib/post.ts"
import client from "@/utils/sanity/client";

const posts = await client.fetch(`*[_type == "post"]`);
```

## Spørre data med parametere

For å spørre data med parametere, kan vi bruke `fetch`-funksjonen til å spørre data fra Sanity.

```tsx title="apps/web/src/lib/post.ts"
import client from "@/utils/sanity/client";

const posts = await client.fetch(`*[_type == $type]`, {
  type: "post",
});
```

## Spørre data med referanser

En referanse er en peker til et annet dokument. Referanser lar deg spørre data fra flere dokumenter samtidig. For eksempel kan en post ha en referanse til en forfatter.

```groq
*[_type == "post"] {
  author -> {
    name,
    email,
  },
}
```

Denne spørringen vil returnere alle dokumenter av typen `post`, og inkludere forfatterens navn og e-postadresse.

Et praktisk eksempel vil være å spørre om alle innlegg og inkludere forfatterens navn og e-postadresse.

```tsx title="apps/web/src/lib/post.ts"
import client from "@/utils/sanity/client";

const posts = await client.fetch(
  `*[_type == "post"] {
    body,
    author -> {
      name,
      email,
    },
  }`,
);
```
