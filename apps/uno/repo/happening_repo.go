package repo

import (
	"context"

	"github.com/echo-webkom/uno/domain/happening"
	"gorm.io/gorm"
)

type HappeningRepo interface {
	GetHappeningBySlug(ctx context.Context, slug string) (happening.Happening, error)
}

func (r *Repo) GetHappeningBySlug(ctx context.Context, slug string) (happening.Happening, error) {
	return gorm.G[happening.Happening](r.db).Where("slug = ?", slug).First(ctx)
}
