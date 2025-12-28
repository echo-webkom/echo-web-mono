package services

import (
	"context"
	"uno/domain/ports"
)

type CommentService struct {
	commentRepo ports.CommentRepo
}

func NewCommentService(commentRepo ports.CommentRepo) *CommentService {
	return &CommentService{
		commentRepo: commentRepo,
	}
}

func (s *CommentService) CommentRepo() ports.CommentRepo {
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
