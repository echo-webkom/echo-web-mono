import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { isBoard } from "@/lib/is-board";
import { type Author } from "@/sanity/posts";
import { fetchPostBySlug } from "@/sanity/posts/requests";
import { urlFor } from "@/utils/image-builder";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  return post;
});

export async function generateMetadata({ params }: Props) {
  const post = await getData(params.slug);

  const authors = post.authors?.map((author) => {
    return {
      name: author.name,
    };
  });

  return {
    title: post.title,
    authors,
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getData(params.slug);

  return (
    <Container className="space-y-4">
      <Heading>{post.title}</Heading>
      {post.authors && <Authors authors={post.authors} />}
      <Markdown content={post.body} />
    </Container>
  );
}

function Authors({ authors }: { authors: Array<Author> }) {
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

            <p className="text-xl">{isBoard(author.name) ? "Hovedstyret" : author.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
