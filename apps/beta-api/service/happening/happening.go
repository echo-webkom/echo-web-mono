package happening

import (
	"context"

	"github.com/echo-webkom/axis/sanity"
	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type HappeningService struct {
	pool   *pgxpool.Pool
	client *sanity.SanityClient
}

func New(pool *pgxpool.Pool, client *sanity.SanityClient) *HappeningService {
	return &HappeningService{
		pool,
		client,
	}
}

// Find happening by its ID
func (s *HappeningService) FindByID(ctx context.Context, id string) (database.Happening, error) {
	query := `--sql
		SELECT id, slug, title, type, date, registration_groups, registration_start_groups, registration_start
		FROM happening
		WHERE id = $1
	`

	row := s.pool.QueryRow(ctx, query, id)

	var happening database.Happening
	if err := row.Scan(
		&happening.ID,
		&happening.Slug,
		&happening.Title,
		&happening.Type,
		&happening.Date,
		&happening.RegistrationGroups,
		&happening.RegistrationStartGroups,
		&happening.RegistrationStart,
	); err != nil {
		return database.Happening{}, err
	}

	return happening, nil
}

// Get all happenings
func (s *HappeningService) GetAllHappenings(ctx context.Context) ([]database.Happening, error) {
	query := `--sql
		SELECT id, title FROM happening
	`

	rows, err := s.pool.Query(ctx, query)
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
