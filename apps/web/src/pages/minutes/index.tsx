import Link from "next/link";
import {fetchMinutes, type Minute} from "@/api/minutes";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/accordion";
import {Layout} from "@/components/layout";
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
      <Layout>
        <div className="container mx-auto px-3">
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
                        <li key={minute.date.toDateString()} className="text-base">
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
                        </li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
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
