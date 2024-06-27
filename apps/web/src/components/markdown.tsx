import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/utils/cn";
import { Heading } from "./typography/heading";
import { OrderedList, UnorderedList } from "./typography/list";
import { ListItem } from "./typography/list-item";
import { Text } from "./typography/text";

type MarkdownProps = {
  className?: string;
  content: string | null;
};

export function Markdown({ className, content }: MarkdownProps) {
  if (!content) {
    return null;
  }

  return (
    <div className={cn("max-w-3xl space-y-4", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children, ...props }) => {
            return (
              <Heading level={1} {...props} copyable>
                {children}
              </Heading>
            );
          },
          h2: ({ children, ...props }) => {
            return (
              <Heading level={2} {...props} copyable>
                {children}
              </Heading>
            );
          },
          h3: ({ children, ...props }) => {
            return (
              <Heading level={3} {...props} copyable>
                {children}
              </Heading>
            );
          },
          h4: ({ children, ...props }) => {
            return (
              <Text className="font-bold" {...props}>
                {children}
              </Text>
            );
          },
          h5: ({ children, ...props }) => {
            return (
              <Text className="font-bold" {...props}>
                {children}
              </Text>
            );
          },
          h6: ({ children, ...props }) => {
            return (
              <Text className="font-bold" {...props}>
                {children}
              </Text>
            );
          },
          p: ({ children, ...props }) => {
            return <Text {...props}>{children}</Text>;
          },
          code: ({ children, className, ...props }) => {
            return (
              <code
                className={cn(
                  "rounded bg-gray-200 px-1 py-0.5 font-mono text-gray-700 dark:bg-wave dark:text-gray-100",
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children, className, ...props }) => {
            return (
              <blockquote
                className={cn("border-l-4 border-gray-300 py-4 pl-4 italic", className)}
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          ul: ({ children, ...props }) => {
            return <UnorderedList {...props}>{children}</UnorderedList>;
          },
          ol: ({ children, ...props }) => {
            return <OrderedList {...props}>{children}</OrderedList>;
          },
          li: ({ children, ...props }) => {
            return <ListItem {...props}>{children}</ListItem>;
          },
          a: ({ children, href, ...props }) => {
            const isExternal = href?.startsWith("http");
            const classNames = cn(
              "transition-colors underline font-medium duration-200 after:content-['_↗'] hover:text-blue-500",
              {
                "after:content-['_↗']": isExternal,
              },
            );

            if (isExternal) {
              return (
                <a
                  className={classNames}
                  href={href ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            }

            return (
              <Link className={classNames} href={href ?? ""} {...props}>
                {children}
              </Link>
            );
          },
          img: ({ src, alt, className, ...props }) => {
            return (
              <Image
                src={src ?? ""}
                alt={alt ?? ""}
                {...props}
                width="600"
                height="400"
                className={cn("mx-auto h-auto max-w-full", className)}
              />
            );
          },
          hr: ({ className, ...props }) => {
            return <hr className={cn("my-8 border-t-gray-300", className)} {...props} />;
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
