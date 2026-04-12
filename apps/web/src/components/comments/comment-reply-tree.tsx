"use client";

import { type User } from "@echo-webkom/db/schemas";
import Link from "next/link";

import { createProfilePictureUrl } from "@/api/client";
import { type CommentTree } from "@/lib/comment-tree";
import { shortDate } from "@/utils/date";
import { initials } from "@/utils/string";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CommentCollapseButton } from "./comment-collapse-button";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentLikeButton } from "./comment-like-button";
import { CommentProvider, useComment } from "./comment-provider";
import { CommentReplyButton } from "./comment-reply-button";
import { CommentReplyTextarea } from "./comment-reply-textarea";

/**
 * Restrict information about a user to the bare minimum.
 */
type BasicUser = Pick<User, "id" | "name"> & {
  hasImage: boolean;
};

type ReplyTreeProps = {
  comments: CommentTree;
  user: BasicUser | null;
  depth?: number;
};

export const ReplyTree = ({ comments, user, depth = 0 }: ReplyTreeProps) => {
  if (!comments.length) {
    return null;
  }

  const userLink = (userId: string) => `/auth/user/${userId}`;

  return (
    <ul>
      {comments.map((comment) => {
        const showDelete = comment.user && user?.id === comment.user.id;
        const hasReplies = comment.children.length > 0;
        const imageUrl = comment.user?.hasImage
          ? createProfilePictureUrl(comment.user.id)
          : undefined;

        return (
          <li className="py-2" key={comment.id}>
            <CommentProvider
              commentId={comment.id}
              postId={comment.postId}
              userId={comment.user?.id ?? null}
              reactions={comment.reactions}
            >
              <div className="flex gap-2">
                <Avatar className="hidden h-8 w-8 sm:block">
                  <AvatarImage src={imageUrl} />
                  <AvatarFallback title={comment.user?.name ?? "Andreas Aanes"}>
                    {initials(comment.user?.name ?? "AA")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <h3 className="text-sm font-semibold">
                      {comment.user ? (
                        <Link className="hover:underline" href={userLink(comment.user.id)}>
                          {comment.user.name}
                        </Link>
                      ) : (
                        <span>[slettet]</span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground text-xs">
                        {shortDate(comment.createdAt)}
                      </p>
                      {hasReplies && <CommentCollapseButton />}
                    </div>
                  </div>

                  <p className="mb-1 text-sm">{comment.content}</p>

                  <div className="flex gap-4">
                    <CommentLikeButton currentUserId={user?.id ?? null} />
                    <CommentReplyButton />
                    {showDelete && <CommentDeleteButton id={comment.id} />}
                  </div>

                  <CommentReplyTextarea />
                </div>
              </div>

              <CommentReplies comments={comment.children} user={user} depth={depth + 1} />
            </CommentProvider>
          </li>
        );
      })}
    </ul>
  );
};

const CommentReplies = ({ user, depth, comments }: ReplyTreeProps) => {
  const { collapsedComments, commentId } = useComment();

  const isCollapsed = collapsedComments.includes(commentId);

  return (
    <div className={isCollapsed ? "hidden" : "border-muted ml-4 border-l-2 pl-2"}>
      <ReplyTree comments={comments} user={user} depth={depth} />
    </div>
  );
};
