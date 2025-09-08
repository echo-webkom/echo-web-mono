package happening

import (
	"context"

	"github.com/echo-webkom/uno/models/database"
	"github.com/echo-webkom/uno/repo"
)

type HappeningService struct {
	hr repo.HappeningRepo
}

func NewHappeningService(repo repo.HappeningRepo) *HappeningService {
	return &HappeningService{repo}
}

func (hs *HappeningService) GetHappeningBySlug(ctx context.Context, slug string) (database.Happening, error) {
	return hs.hr.GetHappeningBySlug(ctx, slug)
}
