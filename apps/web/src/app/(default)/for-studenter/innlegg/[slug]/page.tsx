import { cache } from "react";
import { notFound } from "next/navigation";

import { isBoard } from "@echo-webkom/lib";
import { urlFor } from "@echo-webkom/sanity";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/initials";
import { type Author } from "@/sanity/posts";
import { fetchPostBySlug } from "@/sanity/posts/requests";

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
    <Container className="space-y-8">
      <Heading>{post.title}</Heading>
      {post.authors && <Authors authors={post.authors} />}
      <Markdown content={post.body} />
    </Container>
  );
}

function Authors({ authors }: { authors: Array<Author> }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-bold">Publisert av:</p>

      <div className="flex flex-col flex-wrap gap-5 md:flex-row">
        {authors.map((author) => {
          return (
            <div key={author._id} className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={author.image ? urlFor(author.image).url() : undefined} />
                <AvatarFallback>{initials(author.name)}</AvatarFallback>
              </Avatar>

              <p>{isBoard(author.name) ? "Hovedstyret" : author.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
