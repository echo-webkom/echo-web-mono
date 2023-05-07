import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Heading from "@/components/ui/heading";
import {fetchStudentGroupBySlug, fetchStudentGroupParams} from "@/sanity/student-group";

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await fetchStudentGroupParams();

  return params;
}

export default async function GroupPage({params}: {params: {slug: string}}) {
  const {slug} = params;

  const group = await fetchStudentGroupBySlug(slug);

  return (
    <Container>
      <Heading>{group.name}</Heading>

      <article>
        <Markdown content={group.description} />
      </article>
    </Container>
  );
}
