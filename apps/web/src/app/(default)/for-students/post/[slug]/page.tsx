import {type Metadata} from "next";
import Image from "next/image";

import Container from "@/components/container";
import Markdown from "@/components/markdown";
import {fetchPostBySlug, fetchPostParams, type Author} from "@/sanity/posts";
import {urlFor} from "@/utils/image-builder";

type Props = {
  params: {slug: string};
};

function fetchData(slug: string) {
  return fetchPostBySlug(slug);
}

export async function generateStaticParams() {
  return await fetchPostParams();
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const post = await fetchData(params.slug);

  const authors = post.authors.map((author) => {
    return {
      name: author.name,
    };
  });

  return {
    title: post.title,
    authors,
  };
}

export default async function PostPage({params}: Props) {
  const post = await fetchData(params.slug);

  return (
    <Container>
      <article className="flex flex-col gap-10">
        <h1 className="text-4xl font-bold md:text-6xl">{post.title}</h1>

        <Authors authors={post.authors} />

        <Markdown content={post.body} />
      </article>
    </Container>
  );
}

function Authors({authors}: {authors: Array<Author>}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl font-bold">Publisert av:</p>

      <div className="flex flex-col flex-wrap gap-5 md:flex-row">
        {authors.map((author) => (
          <div key={author._id} className="flex items-center gap-3">
            {author.image && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={urlFor(author.image).height(300).width(300).url()}
                  alt={author.name + " bilde"}
                  fill
                />
              </div>
            )}

            <p className="text-xl">{author.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
