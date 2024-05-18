"use client";

import { createContext, useContext, useState } from "react";

export type CommentContextProps = {
  commentId: string;
  postId: string;
  userId: string | null;
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
  isOpen: boolean;
  children: React.ReactNode;
};

export const CommentProvider = ({
  children,
  commentId,
  postId,
  userId,
  isOpen: initialIsOpen = false,
}: CommentProviderProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  return (
    <CommentContext.Provider value={{ commentId, postId, userId, isOpen, setIsOpen }}>
      {children}
    </CommentContext.Provider>
  );
};
