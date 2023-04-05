import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import Link from "next/link";
import {Avatar} from "@radix-ui/react-avatar";
import {AiOutlineInstagram, AiOutlineLinkedin} from "react-icons/ai";
import {MdOutlineFacebook, MdOutlineMail} from "react-icons/md";

import {isErrorMessage} from "@/utils/error";
import {AvatarFallback, AvatarImage} from "@/components/avatar";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {
  fetchStudentGroupBySlug,
  fetchStudentGroupPaths,
  studentGroupTypeName,
  type StudentGroup,
} from "@/api/student-group";

type Props = {
  group: StudentGroup;
};

const SubGroupPage = ({group}: Props) => {
  const title = studentGroupTypeName[group.groupType];

  return (
    <>
      <Head>
        <title>{`${title} - ${group.name}`}</title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to={`/for-students/${group.groupType}`}>{title}</Breadcrumbs.Item>
            <Breadcrumbs.Item>{group.name}</Breadcrumbs.Item>
          </Breadcrumbs>

          {/* TODO: Render group image */}

          <article className="prose md:prose-xl">
            <h1>{group.name}</h1>

            <Markdown content={group.description?.no ?? ""} />
          </article>

          <div className="mx-auto my-5 flex items-center gap-2">
            {group.socials?.email && (
              <Link href={"mailto:" + group.socials.email}>
                <span className="sr-only">E-post</span>
                <MdOutlineMail
                  title="E-post"
                  className="h-10 w-10 rounded p-1 hover:bg-slate-200"
                />
              </Link>
            )}
            {group.socials?.facebook && (
              <Link href={group.socials.facebook}>
                <span className="sr-only">Facebook</span>
                <MdOutlineFacebook
                  title="Facebook"
                  className="h-10 w-10 rounded p-1 hover:bg-slate-200"
                />
              </Link>
            )}
            {group.socials?.instagram && (
              <Link href={group.socials.instagram}>
                <span className="sr-only">Instagram</span>
                <AiOutlineInstagram
                  title="Instagram"
                  className="h-10 w-10 rounded p-1 hover:bg-slate-200"
                />
              </Link>
            )}
            {group.socials?.linkedin && (
              <Link href={group.socials.linkedin}>
                <span className="sr-only">LinkedIn</span>
                <AiOutlineLinkedin
                  title="LinkedIn"
                  className="h-10 w-10 rounded p-1 hover:bg-slate-200"
                />
              </Link>
            )}
          </div>

          {/* TODO: Render group members */}
          {group.members && (
            <div>
              <div className="prose md:prose-xl">
                <h2>Medlemmer</h2>
              </div>
              <ul>
                {group.members.map((member) => (
                  <li key={member.profile._id}>
                    <div className="flex flex-col items-center gap-5 p-5">
                      <Avatar className="overflow-hidden">
                        <AvatarImage
                          src={member.profile.imageUrl ?? ""}
                          alt={`${member.profile.name} profilbilde`}
                          className="h-24 w-24"
                        />
                        <AvatarFallback className="text-xl">
                          {member.profile.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex w-full flex-col gap-1 overflow-x-hidden text-center">
                        <h3 className="truncate text-2xl font-semibold">{member.profile.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchStudentGroupPaths();

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const group = await fetchStudentGroupBySlug(slug);

  if (isErrorMessage(group)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      group,
    },
  };
};

export default SubGroupPage;
