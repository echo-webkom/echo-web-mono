import { type GetStaticPaths, type GetStaticProps } from "next";
import Head from "next/head";
import { Breadcrum, Layout, Markdown } from "@/components";
import { isErrorMessage } from "@/utils/error";
import { fetchPostBySlug, fetchPostPaths, type Post } from "@/api/posts";

interface Props {
  post: Post;
}

const PostPage = ({ post }: Props) => {
  return (
    <>
      <Head>
        <title>En tittel</title>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <Breadcrum
            links={[
              { href: "/", label: "Hjem" },
              { href: "/posts", label: "Innlegg" },
              { href: `/posts/${post.slug}`, label: post.title.no },
            ]}
          />

          <article className="prose md:prose-xl">
            <Markdown content={post.body.no} />
          </article>
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchPostPaths();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
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
