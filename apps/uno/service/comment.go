package service

import (
	"context"

	"github.com/echo-webkom/uno/models/database"
	"github.com/echo-webkom/uno/repo"
)

type CommentService struct {
	cr repo.CommentRepo
}

func NewCommentService(repo repo.CommentRepo) *CommentService {
	return &CommentService{repo}
}

func (cs *CommentService) GetCommentsByHappeningID(ctx context.Context, id string) ([]database.Comment, error) {
	return cs.cr.GetCommentsByHappeningID(ctx, id)
}
