import {AiOutlineInstagram, AiOutlineLinkedin} from "react-icons/ai";
import {MdOutlineEmail, MdOutlineFacebook} from "react-icons/md";

import {Container} from "@/components/container";
import {Markdown} from "@/components/markdown";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  fetchStudentGroupBySlug,
  fetchStudentGroupParams,
  studentGroupTypeName,
} from "@/sanity/student-group";
import {urlFor} from "@/utils/image-builder";

type Props = {
  params: {
    slug: string;
  };
};

const getData = async (slug: string) => {
  return await fetchStudentGroupBySlug(slug);
};

export const generateMetadata = async ({params}: Props) => {
  const {slug} = params;

  const group = await getData(slug);

  return {
    title: group.name,
  };
};

export const generateStaticParams = async () => {
  const params = await fetchStudentGroupParams();

  return params;
};

export default async function GroupPage({params}: Props) {
  const {slug} = params;

  const group = await getData(slug);

  return (
    <Container className="prose md:prose-xl">
      <p className="not-prose">{studentGroupTypeName[group.groupType]}</p>

      <h1>{group.name}</h1>

      <div className="not-prose mb-4 flex gap-4">
        {group.socials?.email && (
          <a href={`mailto:${group.socials.email}`}>
            <p className="sr-only">E-post</p>
            <MdOutlineEmail className="h-6 w-6" />
          </a>
        )}
        {group.socials?.facebook && (
          <a href={group.socials.facebook}>
            <p className="sr-only">Facebook</p>
            <MdOutlineFacebook className="h-6 w-6" />
          </a>
        )}
        {group.socials?.instagram && (
          <a href={group.socials.instagram}>
            <p className="sr-only">Instagram</p>
            <AiOutlineInstagram className="h-6 w-6" />
          </a>
        )}
        {group.socials?.linkedin && (
          <a href={group.socials.linkedin}>
            <p className="sr-only">LinkedIn</p>
            <AiOutlineLinkedin className="h-6 w-6" />
          </a>
        )}
      </div>

      <article>
        <Markdown content={group.description} />
      </article>

      <h2>Medlemmer</h2>

      <div className="not-prose mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {group.members?.map((member) => {
          const image = member.profile?.image;
          const initials = member.profile?.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2);

          return (
            <div className="flex flex-col gap-2 p-5 text-center" key={member.profile._id}>
              <Avatar className="mx-auto">
                <AvatarImage src={image ? urlFor(image).url() : undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <p className="text-lg font-medium">{member.profile.name}</p>
              <p>{member.role}</p>
              {/* TODO: Add member socials */}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
