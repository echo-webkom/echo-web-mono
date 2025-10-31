package repo

import (
	"context"
	"uno/domain/model"
)

type SpotRangeRepo interface {
	GetSpotRangesByHappeningId(ctx context.Context, hapId string) ([]model.SpotRange, error)
}
