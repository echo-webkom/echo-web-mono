# TypeScript

TypeScript er et programmeringsspråk som er bygget på JavaScript, som gjør det mulig å skrive mer strukturert og forutsigbar kode ved å legge til typed variabler og funksjoner.

Med TypeScript kan utviklere angi typer for variabler, parametere og funksjonsreturverdier, og dermed hjelpe til med å identifisere feil og bugs tidligere i utviklingsprosessen. Dette gir også bedre lesbarhet og forståelse av koden, spesielt for større prosjekter med flere utviklere.

```tsx
"use client";

import {useEffect, useState} from "react";

// Egendefinert type Post
type Post = {
  id: string;
  title: string;
  content: string;
};

const CoolComponent = () => {
  // useState er React sin måte å behandle forskjellige tilstander
  const [posts, setPosts] = useState<Array<Post>>([]);

  // useEffect er en nyttig React hook
  useEffect(() => {
    const fetchData = async () => {
      // Fetch data
    };
    void fetchData();
    // dependencies array [] er tom som betyr at dataen hentes på component mount
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
