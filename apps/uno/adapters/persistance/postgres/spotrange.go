package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type SpotRangeRepo struct {
	db *Database
}

func (sr *SpotRangeRepo) GetSpotRangesByHappeningId(ctx context.Context, hapId string) (ranges []model.SpotRange, err error) {
	query := `
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	err = sr.db.SelectContext(ctx, &ranges, query, hapId)
	return ranges, err
}

func NewSpotRangeRepo(db *Database) repo.SpotRangeRepo {
	return &SpotRangeRepo{db: db}
}
