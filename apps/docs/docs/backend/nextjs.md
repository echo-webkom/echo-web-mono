# Next.js

I Next.js er det lett å lage en api-router. I `app`, så kan lage en mappe med navnet på ruten, og lage en fil med navnet `route.ts`.

```ts title="apps/api/ping/route.ts"
import {NextResponse} from "next/server";

export function GET() {
  return NextResponse.json({
    message: "pong",
  });
}
```

```sh title="Terminal"
$ curl http://localhost:3000/api/ping
{"message":"pong"}
```

Du kan også hente ut parametere fra urlen ved å bruke `request`.

```ts title="apps/api/ping/route.ts"
import {NextResponse} from "next/server";

export function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const paramsCount = searchParams.get("count");
  const count = paramsCount ? parseInt(paramsCount, 10) : 1;

  return NextResponse.json({
    message: Array(count).fill("pong"),
  });
}
```

:::note Merk
Denne koden kan ta in et parameter `count` fra urlen. Hvis den ikke finner parameteren, så vil den sette `count` til 1.
:::

```sh title="Terminal"
$ curl http://localhost:3000/api/ping\?count\=10
{"message":["pong","pong","pong","pong","pong","pong","pong","pong","pong","pong"]}

$ curl http://localhost:3000/api/ping
{"message":["pong"]}
```
