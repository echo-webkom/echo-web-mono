package service

import (
	"context"
	"uno/domain/port"
)

type CommentService struct {
	commentRepo port.CommentRepo
}

func NewCommentService(commentRepo port.CommentRepo) *CommentService {
	return &CommentService{
		commentRepo: commentRepo,
	}
}

func (s *CommentService) CommentRepo() port.CommentRepo {
	return s.commentRepo
}

func (s *CommentService) ReactToComment(ctx context.Context, commentID string, userID string) error {
	exists, err := s.commentRepo.IsReactedByUser(ctx, commentID, userID)
	if err != nil {
		return err
	}
	if exists {
		return s.commentRepo.DeleteReactionFromComment(ctx, commentID, userID)
	}
	return s.commentRepo.AddReactionToComment(ctx, commentID, userID)
}
