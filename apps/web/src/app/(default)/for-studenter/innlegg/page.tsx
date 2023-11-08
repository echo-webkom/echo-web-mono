import Link from "next/link";
import { notFound } from "next/navigation";
import { type Metadata } from "next/types";

import { Container } from "@/components/container";
import { PostPreview } from "@/components/post-preview";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import { fetchPostsByPage } from "@/sanity/posts";

type Props = {
  searchParams: {
    page?: string;
  };
};

export const metadata = {
  title: "Innlegg",
} satisfies Metadata;

async function getData(page: number) {
  const resp = await fetchPostsByPage(page, 6);

  if (resp.posts.length === 0) {
    return notFound();
  }

  return resp;
}

export default async function PostsOverviewPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;

  const { posts, hasMore } = await getData(page);

  return (
    <Container className="space-y-4">
      <Heading>Innlegg</Heading>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {posts.map((post) => (
          <div key={post._id}>
            <PostPreview post={post} withBorder />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {page > 1 && (
          <Button asChild>
            <Link href={`/for-studenter/innlegg?page=${page - 1}`}>Forrige side</Link>
          </Button>
        )}

        {hasMore && (
          <Button asChild>
            <Link href={`/for-studenter/innlegg?page=${page + 1}`}>Neste side</Link>
          </Button>
        )}
      </div>
    </Container>
  );
}
