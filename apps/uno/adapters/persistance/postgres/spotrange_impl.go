package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresSpotRangeImpl struct {
	db *Database
}

func NewPostgresSpotRangeImpl(db *Database) repo.SpotRangeRepo {
	return &PostgresSpotRangeImpl{db: db}
}

func (sr *PostgresSpotRangeImpl) GetSpotRangesByHappeningId(ctx context.Context, hapId string) (ranges []model.SpotRange, err error) {
	query := `
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	err = sr.db.SelectContext(ctx, &ranges, query, hapId)
	return ranges, err
}
