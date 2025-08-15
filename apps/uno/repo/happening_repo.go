package repo

import (
	"context"

	"github.com/echo-webkom/uno/domain/happening"
	"gorm.io/gorm"
)

type HappeningRepo interface {
	GetHappeningByID(ctx context.Context, id string) (happening.Happening, error)
}

func (r *Repo) GetHappeningByID(ctx context.Context, id string) (happening.Happening, error) {
	return gorm.G[happening.Happening](r.db).Where("id = ?", id).First(ctx)
}
