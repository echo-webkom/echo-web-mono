package repo

import (
	"context"

	"github.com/echo-webkom/uno/models/database"
	"gorm.io/gorm"
)

type HappeningRepo interface {
	GetHappeningBySlug(ctx context.Context, slug string) (database.Happening, error)
}

func (r *Repo) GetHappeningBySlug(ctx context.Context, slug string) (database.Happening, error) {
	return gorm.G[database.Happening](r.db).Where("slug = ?", slug).First(ctx)
}
