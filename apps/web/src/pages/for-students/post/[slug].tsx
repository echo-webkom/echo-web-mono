import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

import {fetchPostBySlug, fetchPostPaths, type Post} from "@/api/posts";
import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Layout from "@/layouts/layout";
import {isErrorMessage} from "@/utils/error";
import {capitalize} from "@/utils/string";

interface Props {
  post: Post;
}

const PostPage = ({post}: Props) => {
  const seoTitle = `Innlegg - ${capitalize(post.title)}`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to={`/for-students/post`}>Innlegg</Breadcrumbs.Item>
            <Breadcrumbs.Item>{post.title}</Breadcrumbs.Item>
          </Breadcrumbs>

          <p className="text-gray-500">
            Publisert:{" "}
            {format(new Date(post._createdAt), "d. MMMM yyyy", {
              locale: nb,
            })}
          </p>

          <article className="prose md:prose-xl">
            <h1>{post.title}</h1>
            <p>Skrevet av: {post.authors.map((author) => author.name).join(", ")}</p>
            <Markdown content={post.body} />
          </article>
        </Container>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchPostPaths();

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const post = await fetchPostBySlug(slug);

  if (isErrorMessage(post)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};

export default PostPage;
