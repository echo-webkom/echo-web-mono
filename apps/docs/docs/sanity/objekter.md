# Objekter

I Sanity kan man definere objekter som kan gjenbrukes i flere dokumenter. Objekter kan være enkelt eller mer komplekse. Objekter kan også inneholde andre objekter. Det kan være nyttig å definere et objekt for å unngå duplisering av data.

## Definere objekter

Vi definerer objekter i `schemas/objects`-mappen.

SEO er noe vi gjerne vil gjenbruke i flere dokumenter. Da kan vi lage et objekt for SEO, som tar inn tittel og beskrivelse.

```tsx title="apps/cms/schemas/objects/seo.ts"
import {defineField, defineType} from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "string",
    }),
  ],
});
```

For å kunne bruke dette objektet i et dokument må vi exportere det i `schemas/index.ts`.

Da kan vi bruke objektet i et dokument.

```tsx title="apps/cms/schemas/documents/post.ts"
import {defineField, defineType} from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: "string",
    }),
  ],
});
```
