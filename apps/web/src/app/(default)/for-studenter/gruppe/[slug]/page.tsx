import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import { MdOutlineEmail, MdOutlineFacebook } from "react-icons/md";

import { urlFor } from "@echo-webkom/sanity";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchStudentGroupBySlug, studentGroupTypeName } from "@/sanity/student-group";
import { mailTo } from "@/utils/prefixes";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const group = await fetchStudentGroupBySlug(slug);

  if (!group) {
    return notFound();
  }

  if (group.groupType === "hidden") {
    return notFound();
  }

  return group;
});

export async function generateMetadata({ params }: Props) {
  const { slug } = params;

  const group = await getData(slug);

  return {
    title: group.name,
  };
}

export default async function GroupPage({ params }: Props) {
  const { slug } = params;

  const group = await getData(slug);

  const hasSocials = Object.values(group.socials ?? {}).some((value) => value);

  return (
    <Container className="space-y-8 py-10">
      <div>
        <p>{studentGroupTypeName[group.groupType]}</p>
        <Heading>{group.name}</Heading>
      </div>

      {hasSocials && (
        <section className="flex items-center gap-4">
          {group.socials?.email && (
            <a
              href={mailTo(group.socials.email)}
              className="flex items-center gap-2 hover:underline"
            >
              <span>
                <MdOutlineEmail className="h-6 w-6" />
              </span>
              <span>E-post</span>
            </a>
          )}
          {group.socials?.facebook && (
            <a href={group.socials.facebook} className="flex items-center gap-2 hover:underline">
              <span>
                <MdOutlineFacebook className="h-6 w-6" />
              </span>
              <span>Facebook</span>
            </a>
          )}
          {group.socials?.instagram && (
            <a href={group.socials.instagram} className="flex items-center gap-2 hover:underline">
              <span>
                <AiOutlineInstagram className="h-6 w-6" />
              </span>
              <span>Instagram</span>
            </a>
          )}
          {group.socials?.linkedin && (
            <a href={group.socials.linkedin} className="flex items-center gap-2 hover:underline">
              <span>
                <AiOutlineLinkedin className="h-6 w-6" />
              </span>
              <span>LinkedIn</span>
            </a>
          )}
        </section>
      )}

      {group.image && (
        <Image
          width={700}
          height={475}
          src={urlFor(group.image).url()}
          alt={group.name}
          className="rounded-lg"
        />
      )}

      <section>
        <article>
          <Markdown content={group.description} />
        </article>
      </section>

      {group.members && (
        <section>
          <Heading level={2}>Medlemmer</Heading>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {group.members.map((member) => {
              const image = member.profile?.picture;
              const initials = member.profile?.name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2);

              return (
                <div className="flex flex-col gap-2 p-5 text-center" key={member.profile?._id}>
                  <Avatar className="mx-auto">
                    <AvatarImage src={image ? urlFor(image).url() : undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <p className="text-lg font-medium">{member.profile?.name}</p>
                  <p>{member.role}</p>
                  {/* TODO: Add member socials */}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </Container>
  );
}
