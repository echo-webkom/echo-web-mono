import Head from "next/head";
import Link from "next/link";
import {fetchMinutes, type Minute} from "@/api/minutes";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/accordion";
import Container from "@/components/container";
import Layout from "@/components/layout";
import {isErrorMessage} from "@/utils/error";

const TITLE = "Møtereferater";

interface Props {
  minutes: Array<Minute>;
}

const MinutesPage = ({minutes}: Props) => {
  const newMinutes = minutes.map((obj) => ({...obj, date: new Date(obj.date)}));
  const years = [...new Set(newMinutes.map((e) => e.date.getFullYear()))];

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{TITLE}</h1>
          {years.map((year) => (
            <Accordion type="single" collapsible key={year} className="text-2xl">
              <AccordionItem value="item-1">
                <AccordionTrigger>{year}</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-3">
                    {newMinutes
                      .filter((minute) => minute.date.getFullYear() === year)
                      .map((minute) => (
                        <li key={minute.date.toDateString()} className="flex gap-3 text-base">
                          <Link
                            href={`/minutes/${minute._id}`}
                            className="flex items-center hover:underline"
                          >
                            {minute.date.toLocaleString("nb-NO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Link>
                          <div>
                            {minute.isAllMeeting && (
                              <p className="w-fit rounded-lg bg-[#a4ced9] px-2 py-1 text-sm">
                                Allmøte
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </Container>
      </Layout>
    </>
  );
};

export const getStaticProps = async () => {
  const minutes = await fetchMinutes();

  if (isErrorMessage(minutes)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      minutes,
    },
  };
};

export default MinutesPage;
