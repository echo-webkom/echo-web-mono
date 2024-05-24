import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export default function Ratelimited() {
  return (
    <Container>
      <Heading>Du har blitt rate limited</Heading>
      <Text>Her gikk det fort unna. Vi må dessverre be deg om å slappe av i et par sekunder.</Text>
    </Container>
  );
}
