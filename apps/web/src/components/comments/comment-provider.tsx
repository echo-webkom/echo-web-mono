"use client";

import { createContext, useContext, useState } from "react";

export type CommentContextProps = {
  commentId: string;
  postId: string;
  userId: string | null;
  collapsedComments: Array<string>;
  collapseComment: (commentId: string) => void;
  expandComment: (commentId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const CommentContext = createContext<CommentContextProps | undefined>(undefined);

export const useComment = () => {
  const comment = useContext(CommentContext);

  if (!comment) {
    throw new Error("useComment must be used within a CommentProvider");
  }

  return comment;
};

export type CommentProviderProps = {
  commentId: string;
  postId: string;
  userId: string | null;
  children: React.ReactNode;
};

export const CommentProvider = ({ children, commentId, postId, userId }: CommentProviderProps) => {
  const [collapsedComments, setCollapsedComments] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState(false);

  const collapseComment = (commentId: string) => {
    setCollapsedComments((prev) => [...prev, commentId]);
  };

  const expandComment = (commentId: string) => {
    setCollapsedComments((prev) => prev.filter((id) => id !== commentId));
  };

  return (
    <CommentContext.Provider
      value={{
        commentId,
        postId,
        userId,
        collapsedComments,
        collapseComment,
        expandComment,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
