package port

import (
	"context"
	"uno/domain/model"
)

type CMSTrophyRepo interface {
	GetTrophyByTitleAndAmount(ctx context.Context, title string, amount int) (*model.CMSTrophy, error)
}
