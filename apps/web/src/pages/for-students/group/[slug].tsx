import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import {AiOutlineInstagram, AiOutlineLinkedin} from "react-icons/ai";
import {MdOutlineFacebook, MdOutlineMail} from "react-icons/md";

import {
  fetchStudentGroupBySlug,
  fetchStudentGroupPaths,
  studentGroupTypeName,
  type StudentGroup,
} from "@/api/student-group";
import Container from "@/components/container";
import Markdown from "@/components/markdown";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import DefaultLayout from "@/layouts/default";
import {staggeredListContainer, verticalStaggeredChildren} from "@/utils/animations/helpers";
import {isErrorMessage} from "@/utils/error";
import {urlFor} from "@/utils/image-builder";

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
      <DefaultLayout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to={`/for-students/${group.groupType}`}>{title}</Breadcrumbs.Item>
            <Breadcrumbs.Item>{group.name}</Breadcrumbs.Item>
          </Breadcrumbs>

          <h1 className="text-4xl font-bold md:text-6xl">{group.name}</h1>

          {group.image && (
            <div className="my-5 overflow-hidden rounded-xl border-4 border-black">
              <div className="relative aspect-video h-full w-full">
                <Image src={urlFor(group.image).url()} alt={`${group.name} photo`} fill />
              </div>
            </div>
          )}

          <article className="prose md:prose-xl">
            <Markdown content={group.description ?? ""} />
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
              <motion.ul
                variants={staggeredListContainer}
                initial="hidden"
                whileInView="show"
                viewport={{once: true}}
                className="grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {group.members.map((member) => (
                  <li key={member.profile._id}>
                    <div className="flex h-full flex-col items-center gap-5 p-5">
                      <Avatar className="overflow-hidden border">
                        <motion.div variants={verticalStaggeredChildren}>
                          <AvatarImage
                            src={member.profile.image ? urlFor(member.profile.image).url() : ""}
                            alt={`${member.profile.name} profilbilde`}
                          />
                        </motion.div>
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
                        <div className="mx-auto flex w-fit items-center">
                          {member.profile.socials?.email && (
                            <Link href={"mailto:" + member.profile.socials.email}>
                              <span className="sr-only">E-post</span>
                              <MdOutlineMail
                                title="E-post"
                                className="h-7 w-7 rounded p-1 hover:bg-slate-200"
                              />
                            </Link>
                          )}
                          {member.profile.socials?.linkedin && (
                            <Link href={member.profile.socials.linkedin}>
                              <span className="sr-only">LinkedIn</span>
                              <AiOutlineLinkedin
                                title="LinkedIn"
                                className="h-7 w-7 rounded p-1 hover:bg-slate-200"
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </motion.ul>
            </div>
          )}
        </Container>
      </DefaultLayout>
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
