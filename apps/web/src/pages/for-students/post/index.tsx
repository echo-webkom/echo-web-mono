import {type GetStaticProps} from "next";
import Link from "next/link";
import {fetchPosts, type Post} from "@/api/posts";
import {Layout} from "@/components/layout";
import {isErrorMessage} from "@/utils/error";
import removeMd from "remove-markdown";

interface Props {
  posts: Array<Post>;
}

const PostsPage = ({posts}: Props) => {
  return (
    <Layout>
      <div className="container mx-auto px-3">
        <h1 className="mb-3 text-4xl font-bold md:text-6xl">Innlegg</h1>

        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id}>
              <div className="flex h-full flex-col rounded-md border p-5">
                <h2 className="break-words text-3xl font-bold">{post.title.no}</h2>
                <hr className="my-1" />
                <article className="my-3">{removeMd(post.body.no).slice(0, 300)}...</article>
                <Link
                  href={`/for-students/post/${post.slug}`}
                  className="mt-auto flex-shrink font-bold text-blue-500 hover:underline"
                >
                  Les mer &rarr;
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetchPosts("all");

  if (isErrorMessage(posts)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      posts,
    },
  };
};

export default PostsPage;
