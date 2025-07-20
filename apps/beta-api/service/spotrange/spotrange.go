package spotrange

import (
	"context"

	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SpotRangeService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *SpotRangeService {
	return &SpotRangeService{
		pool: pool,
	}
}

// GetSpotRange returns the spot range for a given happening ID.
func (s *SpotRangeService) FindByHappeningID(ctx context.Context, happeningID string) ([]database.SpotRange, error) {
	var spotRanges []database.SpotRange

	query := `--sql
		SELECT id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`

	rows, err := s.pool.Query(ctx, query, happeningID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var sr database.SpotRange
		if err := rows.Scan(&sr.ID, &sr.HappeningID, &sr.Spots, &sr.MinYear, &sr.MaxYear); err != nil {
			return nil, err
		}
		spotRanges = append(spotRanges, sr)
	}

	return spotRanges, nil
}
