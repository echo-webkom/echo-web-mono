import { useComment } from "./comment-provider";

export const CommentCollapseButton = () => {
  const { commentId, collapsedComments, collapseComment, expandComment } = useComment();

  const isCollapsed = collapsedComments.includes(commentId);

  const toggleCollapsed = () => {
    if (isCollapsed) {
      expandComment(commentId);
    } else {
      collapseComment(commentId);
    }
  };

  return (
    <button onClick={toggleCollapsed} className="text-sm text-muted-foreground hover:underline">
      [{isCollapsed ? "+" : "-"}]
    </button>
  );
};
