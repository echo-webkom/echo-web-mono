import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Heading from "@/components/ui/heading";
import {fetchStudentGroupBySlug, fetchStudentGroupParams} from "@/sanity/student-group";

type Props = {
  params: {
    slug: string;
  };
};

async function getData(slug: string) {
  return await fetchStudentGroupBySlug(slug);
}

export async function generateMetadata({params}: Props) {
  const {slug} = params;

  const group = await getData(slug);

  return {
    title: group.name,
  };
}

export async function generateStaticParams() {
  const params = await fetchStudentGroupParams();

  return params;
}

export default async function GroupPage({params}: Props) {
  const {slug} = params;

  const group = await getData(slug);

  return (
    <Container>
      <Heading>{group.name}</Heading>

      <article>
        <Markdown content={group.description} />
      </article>
    </Container>
  );
}
