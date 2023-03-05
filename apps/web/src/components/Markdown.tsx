import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

export const Markdown = ({content}: MarkdownProps) => {
  return (
    <ReactMarkdown className="prose md:prose-xl" remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};
