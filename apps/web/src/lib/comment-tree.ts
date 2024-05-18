import { type getCommentsById } from "@/data/comments/queries";

type Comment = Awaited<ReturnType<typeof getCommentsById>>[number];

export type CommentTree = Array<
  Comment & {
    children: CommentTree;
  }
>;

/**
 * Build a comment tree from a flat list of comments
 * recursively
 */
export const buildCommentTreeFrom = (
  comments: Array<Comment>,
  parentId: string | null = null,
): CommentTree => {
  const foo = comments
    .filter((comment) => comment.parentCommentId === parentId)
    .map((comment) => ({
      ...comment,
      children: buildCommentTreeFrom(comments, comment.id),
    }));

  return foo;
};
