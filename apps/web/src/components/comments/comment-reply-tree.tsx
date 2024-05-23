"use client";

import { useState } from "react";

import { type User } from "@echo-webkom/db/schemas";

import { type CommentTree } from "@/lib/comment-tree";
import { cn } from "@/utils/cn";
import { shortDate } from "@/utils/date";
import { initials } from "@/utils/string";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentProvider } from "./comment-provider";
import { CommentReplyButton } from "./comment-reply-button";
import { CommentReplyTextarea } from "./comment-reply-textarea";

/**
 * Restrict information about a user to the bare minimum.
 */
type BasicUser = Pick<User, "id" | "name" | "image">;

type ReplyTreeProps = {
  comments: CommentTree;
  user: BasicUser | null;
  depth?: number;
};

export const ReplyTree = ({ comments, user, depth = 0 }: ReplyTreeProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  if (!comments.length) {
    return null;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li className="flex gap-4 py-4" key={comment.id}>
          <CommentProvider
            commentId={comment.id}
            postId={comment.postId}
            userId={comment.user?.id ?? null}
            isOpen={false}
          >
            <Avatar className="hidden h-14 w-14 sm:block">
              <AvatarImage src={comment.user?.image ?? ""} />
              <AvatarFallback title={comment.user?.name ?? "Andreas Aanes"}>
                {initials(comment.user?.name ?? "AA")}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn("flex flex-1 flex-col gap-1 sm:pl-0", {
                "pl-0": depth === 0,
                "pl-4": depth === 1,
                "pl-8": depth === 2,
                "pl-12": depth === 3,
                "pl-16": depth === 4,
                "pl-20": depth > 4,
              })}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h3 className="text-lg font-medium">{comment.user?.name ?? "[slettet]"}</h3>
                <p className="text-sm text-muted-foreground">{shortDate(comment.createdAt)}</p>
                <button
                  onClick={toggleCollapsed}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  [{collapsed ? "+" : "-"}]
                </button>
              </div>

              <p className="mb-1">{comment.content}</p>

              <div className="flex gap-4">
                <CommentReplyButton />
                {comment.user && user?.id === comment.user.id && (
                  <CommentDeleteButton id={comment.id} />
                )}
              </div>

              <CommentReplyTextarea />

              <div className={collapsed ? "hidden" : "block"}>
                <ReplyTree comments={comment.children} user={user} depth={depth + 1} />
              </div>
            </div>
          </CommentProvider>
        </li>
      ))}
    </ul>
  );
};
