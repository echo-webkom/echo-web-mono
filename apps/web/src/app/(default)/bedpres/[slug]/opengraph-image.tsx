import { ImageResponse } from "next/og";

import { client } from "@/sanity/client";

export const runtime = "edge";
export const contentType = "image/png";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Image({ params }: Props) {
  const { slug } = params;

  const title = await client.fetch<string | null>(
    '*[_type == "bedpres" && slug.current == $slug][0].company->name',
    { slug },
  );

  if (!title) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "linear-gradient(60deg, #fff, #ffeabb)",
          fontSize: 50,
          letterSpacing: -2,
          gap: "30px",
        }}
      >
        <div
          style={{
            fontWeight: 400,
          }}
        >
          Bedpres med...
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 80,
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
