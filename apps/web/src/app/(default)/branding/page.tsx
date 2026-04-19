import Image from "next/image";

import echoLogo from "@/assets/images/echo-logo.png";
import { Container } from "@/components/container";
import { Blockquote } from "@/components/typography/blockquote";
import { Callout } from "@/components/typography/callout";
import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { OrderedList, UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";

import { Button } from "../../../components/ui/button";

export default function Typography() {
  return (
    <Container className="space-y-4 py-10">
      <div>
        <Image src={echoLogo} alt={"logo"} width={200}></Image>
      </div>

      <Heading level={1} className="border-b py-4 font-mono">
        Typography
      </Heading>
      <div className="flex flex-col">
        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">Inter / 36px</p>
          <Heading level={1}>Heading 1</Heading>
        </div>
        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">Inter / 24px</p>
          <Heading level={2}>Heading 2</Heading>
        </div>
        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">Inter / 20px</p>
          <Heading level={3}>Heading 3</Heading>
        </div>

        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">Inter / 20px</p>
          <Text size="lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          </Text>
        </div>
        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">Inter / 18px</p>
          <Text size="md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          </Text>
        </div>
        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">Inter / 14px</p>
          <Text size="sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, quos,
          </Text>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex h-12 items-center space-x-4 text-xs">
          <p className="font-mono">VT323 / 28px</p>
          <p className="font-block text-4xl">PIXEL DISPLAY </p>
        </div>
      </div>

      <div>
        <Blockquote className="ml-3">
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
        <UnorderedList className="mb-4 -ml-1">
          <ListItem>Unordered item 1</ListItem>
          <ListItem>Unordered item 2</ListItem>
          <ListItem>Unordered item 3</ListItem>
        </UnorderedList>
      </div>

      <Heading level={1} className="border-b py-4 font-mono">
        Components
      </Heading>
      <div className="space-y-8 pb-4">
        <div className="h-14 space-x-2">
          <h1 className="pb-2 font-mono text-xs">Buttons</h1>
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <div className="h-14 space-x-2">
          <h1 className="pb-2 font-mono text-xs">Sizes</h1>
          <Button size="sm" variant="default">
            Small
          </Button>
          <Button size="default" variant="default">
            Default
          </Button>
          <Button size="lg" variant="default">
            Large
          </Button>
        </div>
        <div className="h-14 space-x-2">
          <h1 className="pb-2 font-mono text-xs">States</h1>
          <Button size="default" variant="default">
            Active
          </Button>
          <Button disabled={true} size="default" variant="default">
            Disabled
          </Button>
        </div>
        <div className="h-14 space-x-2">
          <h1 className="pb-2 font-mono text-xs">Icons</h1>
          <Button size="icon-lg" className="text-sm" variant="default"></Button>
          <Button size="icon" variant="default"></Button>
          <Button size="icon-sm" variant="default"></Button>
        </div>
        <div className="my-4 space-x-2">
          <h1 className="pb-2 font-mono text-xs">Chip</h1>
          <Chip variant="primary">Primary/Default</Chip>
          <Chip variant="secondary">Secondary</Chip>
          <Chip variant="destructive">Destructive</Chip>
          <Chip variant="stealth">Stealth</Chip>
        </div>
        <div className="space-y-2">
          <h1 className="pb-2 font-mono text-xs">Callout</h1>
          <Callout className="max-w-lg" type="info">
            This is an information callout
          </Callout>
          <Callout className="max-w-lg" type="warning">
            This is an warning callout
          </Callout>
          <Callout className="max-w-lg" type="danger">
            This is an danger callout
          </Callout>
        </div>
      </div>

      <Heading level={1} className="border-b py-4 font-mono">
        Colors
      </Heading>
      <div>
        <div className="flex flex-col space-y-4">
          <Heading level={3} className="py-4 font-mono">
            Surfaces
          </Heading>
          <div className="flex min-w-full divide-x overflow-hidden rounded-md border text-xs text-[#171923]">
            <div className="h-24 w-1/5 bg-[#f9fafb] p-2">
              <p>Background</p>
              <p>#f9fafb</p>
            </div>
            <div className="h-24 w-1/5 bg-[#fefefe] p-2">
              <p>Card</p>
              <p>#fefefe</p>
            </div>
            <div className="h-24 w-1/5 bg-[#ebeef4] p-2">
              <p>Muted</p>
              <p>#ebeef4</p>
            </div>
            <div className="h-24 w-1/5 bg-[#ebeef4] p-2">
              <p>Accent</p>
              <p>#ebeef4</p>
            </div>
            <div className="h-24 w-1/5 bg-[#9db2cd] p-2">
              <p>Border</p>
              <p>#9db2cd</p>
            </div>
          </div>
          <Heading level={3} className="py-4 font-mono">
            Dark Surfaces
          </Heading>
          <div className="flex min-w-full divide-x divide-[#4d4d4d] overflow-hidden rounded-md border text-xs text-[#eeeeee]">
            <div className="h-24 w-1/5 bg-[#151210] p-2">
              <p>Background</p>
              <p>#151210</p>
            </div>
            <div className="h-24 w-1/5 bg-[#171717] p-2">
              <p>Card</p>
              <p>#171717</p>
            </div>
            <div className="h-24 w-1/5 bg-[#181818] p-2">
              <p>Muted</p>
              <p>#181818</p>
            </div>
            <div className="h-24 w-1/5 bg-[#14171a] p-2">
              <p>Accent</p>
              <p>#14171a</p>
            </div>
            <div className="h-24 w-1/5 bg-[#4d4d4d] p-2">
              <p>Border</p>
              <p>#4d4d4d</p>
            </div>
          </div>
          <Heading level={3} className="py-4 font-mono">
            Banner &amp; Footer
          </Heading>
          <div className="flex min-w-full divide-x divide-[#d4a373] overflow-hidden rounded-md border text-xs text-[#171923]">
            <div className="h-24 w-1/3 bg-[#53adbd] p-2">
              <p>Banner</p>
              <p>#53adbd</p>
            </div>
            <div className="h-24 w-1/3 bg-[#f2cc8f] p-2">
              <p>Footer</p>
              <p>#f2cc8f</p>
            </div>
            <div className="h-24 w-1/3 bg-[#d4a373] p-2">
              <p>Footer Border</p>
              <p>#d4a373</p>
            </div>
          </div>
          <Heading level={3} className="py-4 font-mono">
            Foregrounds
          </Heading>
          <div className="flex min-w-full divide-x overflow-hidden rounded-md border text-xs">
            <div className="h-24 w-1/2 bg-[#eeeeee] p-2 text-[#171923]">
              <p>Foreground</p>
              <p>#eeeeee</p>
            </div>
            <div className="h-24 w-1/2 bg-[#999999] p-2 text-[#171923]">
              <p>Muted fg</p>
              <p>#999999</p>
            </div>
          </div>
          <Heading level={3} className="font-mono">
            Primary
          </Heading>
          <div className="text-primary-foreground divide-border flex min-w-full divide-x overflow-hidden rounded-md border text-xs">
            <div className="bg-primary-hover h-24 w-1/3 p-2">
              <p>Hover</p>
              <p>#32a5b5</p>
            </div>
            <div className="bg-primary h-24 w-1/3 p-2">
              <p>Default</p>
              <p>#008fa3</p>
            </div>
            <div className="bg-primary-dark h-24 w-1/3 p-2">
              <p>Dark</p>
              <p>#006f83</p>
            </div>
          </div>
          <div></div>
          <Heading level={3} className="font-mono">
            Secondary
          </Heading>
          <div className="text-secondary-foreground flex min-w-full divide-x divide-[#e8a820] overflow-hidden rounded-md border text-xs">
            <div className="bg-secondary-hover h-24 w-1/3 p-2">
              <p>Hover</p>
              <p>#ffe195</p>
            </div>
            <div className="bg-secondary h-24 w-1/3 p-2">
              <p>Default</p>
              <p>#fed879</p>
            </div>
            <div className="bg-secondary-dark h-24 w-1/3 p-2">
              <p>Dark</p>
              <p>#f9c652</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1"></div>
        </div>
        <Heading level={3} className="py-4 font-mono">
          Seasonal Themes
        </Heading>
        <div className="flex min-w-full divide-x overflow-hidden rounded-md border text-xs">
          <div className="h-24 w-1/4 bg-[#e07a5f] p-2">
            <p>Halloween - Light</p>
            <p>#e07a5f</p>
          </div>
          <div className="h-24 w-1/4 bg-[#9d4edd] p-2">
            <p>Halloween - Dark</p>
            <p>#9d4edd</p>
          </div>
          <div className="h-24 w-1/4 bg-[#c0392b] p-2">
            <p>Christmas - Primary</p>
            <p>#c0392b</p>
          </div>
          <div className="h-24 w-1/4 bg-[#27ae60] p-2">
            <p>Christmas - Secondary</p>
            <p>#27ae60</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
