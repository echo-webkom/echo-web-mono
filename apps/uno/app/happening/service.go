package happening

import (
	"context"

	"github.com/echo-webkom/uno/domain/happening"
	"github.com/echo-webkom/uno/repo"
)

type HappeningService struct {
	repo repo.HappeningRepo
}

func NewHappeningService(repo repo.HappeningRepo) *HappeningService {
	return &HappeningService{repo}
}

func (h *HappeningService) GetHappeningByID(ctx context.Context, id string) (happening.Happening, error) {
	return h.repo.GetHappeningByID(ctx, id)
}
