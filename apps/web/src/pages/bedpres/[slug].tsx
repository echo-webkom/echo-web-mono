import {type GetServerSideProps} from "next";
import {fetchBedpresBySlug, type Bedpres} from "@/api/bedpres";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {isErrorMessage} from "@/utils/error";

type Props = {
  bedpres: Bedpres;
};

const BedpresPage = ({bedpres}: Props) => {
  return (
    <Layout>
      <Container>
        <Breadcrumbs>
          <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
          <Breadcrumbs.Item to="/">Bedriftspresentasjoner</Breadcrumbs.Item>
          <Breadcrumbs.Item>{bedpres.title}</Breadcrumbs.Item>
        </Breadcrumbs>

        <article className="prose md:prose-xl">
          <h1>{bedpres.title}</h1>
          <Markdown content={bedpres.body?.no ?? ""} />
        </article>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const bedpres = await fetchBedpresBySlug(slug);

  if (isErrorMessage(bedpres)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bedpres,
    },
  };
};

export default BedpresPage;
