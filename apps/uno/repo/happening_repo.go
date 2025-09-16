package repo

import (
	"context"

	"github.com/echo-webkom/uno/models/database"
	"github.com/echo-webkom/uno/storage"
	"gorm.io/gorm"
)

type HappeningRepo interface {
	GetHappeningBySlug(ctx context.Context, slug string) (database.Happening, error)
}

type HappeningRepoImpl struct {
	pg *storage.Postgres
}

func NewHappeningRepo(pg *storage.Postgres) HappeningRepo {
	return &HappeningRepoImpl{pg: pg}
}

func (r *HappeningRepoImpl) GetHappeningBySlug(ctx context.Context, slug string) (database.Happening, error) {
	return gorm.G[database.Happening](r.pg.DB).Where("slug = ?", slug).First(ctx)
}
