import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

/**
 * Renders markdown content
 *
 * @param content The markdown content to render
 * @returns Markdown mapped to HTML
 */
export const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className="prose md:prose-xl"
      components={{
        a: ({ children, href }) => {
          // TODO: Add external link icon and behavior
          return (
            <Link
              className="transition-colors duration-200 hover:text-blue-500"
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
