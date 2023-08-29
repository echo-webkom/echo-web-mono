import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/utils/cn";

type MarkdownProps = {
  className?: string;
  content: string | null;
};

export const Markdown = ({ className, content }: MarkdownProps) => {
  if (!content) {
    return null;
  }

  return (
    <ReactMarkdown
      className={cn("prose", "md:prose-xl", className)}
      components={{
        a: ({ children, href }) => {
          // TODO: Add external link icon and behavior
          return (
            <Link
              className="transition-colors duration-200 after:content-['_↗'] hover:text-blue-500"
              href={href ?? ""}
            >
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
      }}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
};
