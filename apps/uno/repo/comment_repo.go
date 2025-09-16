package repo

import (
	"context"

	"github.com/echo-webkom/uno/models/database"
	"github.com/echo-webkom/uno/storage"
	"gorm.io/gorm"
)

type CommentRepo interface {
	GetCommentsByHappeningID(ctx context.Context, id string) ([]database.Comment, error)
}

type CommentRepoImpl struct {
	pg *storage.Postgres
}

func NewCommentRepo(pg *storage.Postgres) CommentRepo {
	return &CommentRepoImpl{pg: pg}
}

func (r *CommentRepoImpl) GetCommentsByHappeningID(ctx context.Context, id string) ([]database.Comment, error) {
	return gorm.G[database.Comment](r.pg.DB).Where("post_id = ?", id).Find(ctx)
}
