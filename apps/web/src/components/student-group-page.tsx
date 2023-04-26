import Head from "next/head";

import {studentGroupTypeName, type StudentGroup} from "@/api/student-group";
import Layout from "../layouts/layout";
import Container from "./container";
import Markdown from "./markdown";
import Breadcrumbs from "./ui/breadcrumbs";

type StudentGroupPageProps = {
  group: StudentGroup;
};

const StudentGroupPage = ({group}: StudentGroupPageProps) => {
  const title = studentGroupTypeName[group.groupType];

  return (
    <>
      <Head>
        <title>
          {title} - {group.name}
        </title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to={`/for-students/${group.groupType}`}>{title}</Breadcrumbs.Item>
            <Breadcrumbs.Item>{group.name}</Breadcrumbs.Item>
          </Breadcrumbs>

          {/* TODO: Render group image */}

          <article className="prose md:prose-xl">
            <h1>{group.name}</h1>
            <Markdown content={group.description ?? ""} />
          </article>

          {/* TODO: Render group members */}
        </Container>
      </Layout>
    </>
  );
};

export default StudentGroupPage;
