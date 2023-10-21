import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/utils/cn";
import { Heading } from "./ui/heading";

type MarkdownProps = {
  className?: string;
  content: string | null;
};

export function Markdown({ className, content }: MarkdownProps) {
  if (!content) {
    return null;
  }

  return (
    <article className={cn("max-w-3xl text-xl text-gray-800", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => {
            return <Heading level={1}>{children}</Heading>;
          },
          h2: ({ children }) => {
            return <Heading level={2}>{children}</Heading>;
          },
          p: ({ children }) => {
            return <p className="py-4 leading-8">{children}</p>;
          },
          code: ({ children }) => {
            return <code className="rounded bg-gray-200 px-1 py-0.5 font-mono">{children}</code>;
          },
          blockquote: ({ children }) => {
            return (
              <blockquote className="border-l-4 border-gray-300 py-4 pl-4 italic">
                {children}
              </blockquote>
            );
          },
          ul: ({ children }) => {
            return <ul className="list-disc py-4 pl-8">{children}</ul>;
          },
          ol: ({ children }) => {
            return <ol className="list-decimal py-4 pl-8">{children}</ol>;
          },
          li: ({ children }) => {
            return <li className="py-1">{children}</li>;
          },
          a: ({ children, href }) => {
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
                >
                  {children}
                </a>
              );
            }

            return (
              <Link className={classNames} href={href ?? ""}>
                {children}
              </Link>
            );
          },
          img: ({ src, alt }) => {
            return (
              <Image
                src={src ?? ""}
                alt={alt ?? ""}
                width="600"
                height="400"
                className="mx-auto h-auto max-w-full"
              />
            );
          },
          hr: () => {
            return <hr className="my-8 border-t-gray-300" />;
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
