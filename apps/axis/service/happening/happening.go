package happening

import (
	"context"

	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type HappeningService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *HappeningService {
	return &HappeningService{
		pool,
	}
}

func (s *HappeningService) GetHappeningById(ctx context.Context, id string) (*database.Happening, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, title FROM happening WHERE id = ?`, id)

	var evt database.Happening
	if err := row.Scan(&evt.ID, &evt.Title); err != nil {
		return nil, err
	}

	return &evt, nil
}

func (s *HappeningService) GetAllHappenings(ctx context.Context) ([]database.Happening, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT id, title FROM happening`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	happenings := []database.Happening{}
	for rows.Next() {
		var evt database.Happening
		if err := rows.Scan(&evt.ID, &evt.Title); err != nil {
			return nil, err
		}
		happenings = append(happenings, evt)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return happenings, nil
}
