import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Blockquote } from "@/components/typography/blockquote";
import { Callout } from "@/components/typography/callout";
import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { OrderedList, UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";

export default function Typography() {
  if (process.env.VERCEL_ENV === "production") {
    return notFound();
  }

  return (
    <Container className="space-y-4 py-10">
      <div>
        <Heading level={1}>Heading 1</Heading>
        <Heading level={2}>Heading 2</Heading>
        <Heading level={3}>Heading 3</Heading>
      </div>

      <div>
        <Text size="lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          quia, nesciunt quas? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          voluptatibus, quos, quia, nesciunt quas? Lorem ipsum dolor sit amet consectetur.
        </Text>
        <Text size="md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          quia, nesciunt quas? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          voluptatibus, quos, quia, nesciunt quas? Lorem ipsum dolor sit amet consectetur.
        </Text>
        <Text size="sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          quia, nesciunt quas? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          voluptatibus, quos, quia, nesciunt quas? Lorem ipsum dolor sit amet consectetur.
        </Text>
      </div>

      <div>
        <Blockquote>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          quia, nesciunt quas?
        </Blockquote>
      </div>

      <div>
        <OrderedList>
          <ListItem>Ordered item 1</ListItem>
          <ListItem>Ordered item 2</ListItem>
          <ListItem>Ordered item 3</ListItem>
        </OrderedList>
      </div>

      <div>
        <UnorderedList>
          <ListItem>Unordered item 1</ListItem>
          <ListItem>Unordered item 2</ListItem>
          <ListItem>Unordered item 3</ListItem>
        </UnorderedList>
      </div>

      <div className="space-y-2">
        <Callout type="info">This is an information callout</Callout>
        <Callout type="warning">This is an warning callout</Callout>
        <Callout type="danger">This is an danger callout</Callout>
      </div>

      <div>
        <Chip>Chip</Chip>
        <Chip>Chip</Chip>
        <Chip>Chip</Chip>
        <Chip>Chip</Chip>
        <Chip>Chip</Chip>
        <Chip>Chip</Chip>
      </div>
    </Container>
  );
}
