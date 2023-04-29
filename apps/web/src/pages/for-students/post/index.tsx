import {type GetStaticProps} from "next";
import Link from "next/link";
import removeMd from "remove-markdown";

import {fetchPosts, type Post} from "@/api/posts";
import Container from "@/components/container";
import DefaultLayout from "@/layouts/default";
import {isErrorMessage} from "@/utils/error";

interface Props {
  posts: Array<Post>;
}

const PostsPage = ({posts}: Props) => {
  return (
    <DefaultLayout>
      <Container>
        <h1 className="mb-3 text-4xl font-bold md:text-6xl">Innlegg</h1>

        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id}>
              <div className="flex h-full flex-col rounded-md border p-5">
                <h2 className="break-words text-3xl font-bold">{post.title}</h2>
                <hr className="my-1" />
                <article className="my-3">{removeMd(post.body).slice(0, 300)}...</article>
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
      </Container>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetchPosts(-1);

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
