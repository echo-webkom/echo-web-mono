package service

import (
	"context"
	"uno/domain/model"
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

func (s *CommentService) GetCommentsByID(ctx context.Context, id string) ([]model.CommentAggregate, error) {
	return s.commentRepo.GetCommentsByID(ctx, id)
}

func (s *CommentService) CreateComment(ctx context.Context, content string, postID string, userID string, parentCommentID *string) error {
	return s.commentRepo.CreateComment(ctx, content, postID, userID, parentCommentID)
}

func (s *CommentService) DeleteComment(ctx context.Context, id string) error {
	return s.commentRepo.DeleteComment(ctx, id)
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
