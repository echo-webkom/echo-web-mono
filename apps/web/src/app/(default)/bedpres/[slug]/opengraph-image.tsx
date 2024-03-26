/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import { urlFor } from "@echo-webkom/sanity";

import { baseURL } from "@/config";
import { fetchHappeningBySlug } from "@/sanity/happening";
import EchoLogo from "../../../../assets/images/echo-logo.png";

export const runtime = "edge";
export const contentType = "image/png";

type Props = {
  params: {
    slug: string;
  };
};

export default async function BedpresOpenGraphImage({ params }: Props) {
  const { slug } = params;

  const bedpres = await fetchHappeningBySlug(slug);

  if (!bedpres?.company) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        tw="h-full w-full p-8 flex flex-col"
        style={{
          backgroundImage: "linear-gradient(60deg, #fff, #ffeabb)",
        }}
      >
        <img tw="h-32 w-32" src={`${baseURL}/${EchoLogo.src}`} alt="Webkom logo" />
        <p
          style={{
            fontWeight: 400,
            fontSize: 40,
          }}
        >
          Bedriftpresentasjon med...
        </p>
        <div tw="flex justify-between">
          <p
            style={{
              fontWeight: 600,
              fontSize: 110,
            }}
          >
            {bedpres.company.name}
          </p>
          <img
            tw="h-[300px] w-[300px]"
            src={urlFor(bedpres.company.image).url()}
            alt={bedpres.company.name}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
