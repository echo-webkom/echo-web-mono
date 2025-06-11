import { ImageResponse } from "next/og";

import { urlFor } from "@echo-webkom/sanity";

import { fetchHappeningBySlug } from "@/sanity/happening";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ImageProps = {
  params: {
    slug: string;
  };
};

export default async function Image({ params }: ImageProps) {
  const slug = params.slug;

  const event = await fetchHappeningBySlug(slug);

  if (!event) {
    return new Response("Event not found", {
      status: 404,
    });
  }

  const logoUrl = urlFor(event.company!.image).width(300).url();

  return new ImageResponse(
    (
      <div
        style={{
          color: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "linear-gradient(45deg, #008094 0%, #a6cfd9 50%, #fcbf00 100%)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "90%",
            height: "90%",
            display: "flex",
            background: "white",
            borderRadius: 30,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "row",
              gap: 50,
              alignItems: "center",
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src="https://echo.uib.no/android-chrome-512x512.png" width={300} />
            <p style={{ fontSize: 120 }}>🤝</p>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={logoUrl} width={300} />
          </div>
          <p
            style={{
              position: "absolute",
              bottom: "25%",
              left: "5%",
              fontSize: 50,
              fontFamily: '"Bebas Neue"',
            }}
          >
            Bedpres med
          </p>
          <p
            style={{
              position: "absolute",
              bottom: "5%",
              left: "5%",
              fontSize: 80,
              fontFamily: '"Bebas Neue"',
              strokeWidth: 3,
            }}
          >
            {event.company?.name}
          </p>
        </div>
      </div>
    ),
    {
      emoji: "twemoji",
      ...size,
    },
  );
}
