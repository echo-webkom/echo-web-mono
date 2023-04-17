# Frontend - Teknologier

## React

ReactJS er et JavaScript-bibliotek som brukes til å bygge brukergrensesnitt (UI). Det gir utviklere muligheten til å bygge interaktive og dynamiske brukergrensesnitt ved å dele dem opp i små komponenter som kan gjenbrukes og oppdateres separat fra resten av grensesnittet.

## TypeScript

TypeScript er et programmeringsspråk som er bygget på JavaScript, som gjør det mulig å skrive mer strukturert og forutsigbar kode ved å legge til typed variabler og funksjoner.

Med TypeScript kan utviklere angi typer for variabler, parametere og funksjonsreturverdier, og dermed hjelpe til med å identifisere feil og bugs tidligere i utviklingsprosessen. Dette gir også bedre lesbarhet og forståelse av koden, spesielt for større prosjekter med flere utviklere.

```tsx
import {useEffect, useState} from "react";

// Egendefinert type Post
type Post = {
  id: string;
  title: string;
  content: string;
};

const CoolComponent = () => {
  // useState er React sin måte å behandle forskjellige tilstander
  const [posts, setPosts] = useState<Post[]>([]);

  // useEffect er en nyttig React hook
  useEffect(() => {
    const fetchData = async () => {
      // Fetch data
    };
    void fetchData();
    // dependencies array [] er tom som betyr at dataen hentes på page load
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default CoolComponent;
```

## Tailwind

Tailwind er et CSS-rammeverk som lar deg **designe** en nettside ved hjelp av forhåndsdefinerte klasser, i stedet for å skrive ren CSS-kode. Det gir utviklere et stort utvalg av fleksible, gjenbrukbare og responsive verktøy som gjør det enklere å bygge en stilfull og responsiv nettside eller applikasjon raskt. Tailwind inkluderer blant annet ferdige stiler for layout, tekstbehandling, farger, rammer og mye mer.

```html
<div className="bg-rose-300 hover:scale-105 hover:bg-rose-400 transition-all duration-300">
  <h1 className="text-4xl text-center font-extrabold text-sky-500">tailwind ftw</h1>
</div>
```

## Framer Motion

Framer Motion er et JavaScript-bibliotek som brukes til å legge til **animasjoner** og interaktivitet i webapplikasjoner. Det er spesielt populært blant utviklere som jobber med ReactJS, ettersom det er enkelt å integrere i React-prosjekter.

```tsx
import {motion} from "framer-motion";

const CoolAnimations = () => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
      exit={{opacity: 0}}
    >
      Fader inn
    </motion.div>
  );
};

export default CoolAnimations;
```
