import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {Breadcrum, Layout, Markdown} from "@/components";
import {isErrorMessage} from "@/utils/error";
import {fetchPostBySlug, fetchPostPaths, type Post} from "@/api/posts";
import {capitalize} from "@/utils/string";

interface Props {
  post: Post;
}

const PostPage = ({post}: Props) => {
  const seoTitle = `Innlegg - ${capitalize(post.title.no)}`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-3">
          <Breadcrum
            className="mb-3"
            links={[
              {href: "/", label: "Hjem"},
              {href: "/for-students/post", label: "Innlegg"},
              {href: `/for-students/post/${post.slug}`, label: post.title.no},
            ]}
          />

          <article className="prose md:prose-xl">
            <h1>{post.title.no}</h1>
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
