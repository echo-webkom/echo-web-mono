import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { Container } from "@/components/container";
import { Blockquote } from "@/components/typography/blockquote";
import { Heading } from "@/components/typography/heading";
import { isWebkom } from "@/lib/memberships";
import { DeleteQuoteButton } from "./_components/delete-quote-button";
import { SubmitQuoteModal } from "./_components/submit-quote-modal";

export default async function Quotes() {
  const [quotes, user] = await Promise.all([unoWithAdmin.quotes.all(), auth()]);
  const canDelete = !!user && isWebkom(user);

  return (
    <Container className="py-16">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <Heading>Sitater</Heading>
          <p className="text-muted-foreground mt-1 text-sm">
            Morsomme, rare og minneverdige sitater fra echo-arrangementer og forelesninger.
          </p>
        </div>
        <SubmitQuoteModal />
      </div>

      <div className="divide-y">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex items-start justify-between gap-4 py-6">
            <div>
              <Blockquote className="text-base">{quote.text}</Blockquote>
              <p className="mt-3 text-sm font-semibold">
                — {quote.person}
                {quote.context && `, ${quote.context}`}
              </p>
            </div>
            {canDelete && <DeleteQuoteButton id={quote.id} />}
          </div>
        ))}
      </div>
    </Container>
  );
}
