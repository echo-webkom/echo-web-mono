package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresHappeningImpl struct {
	db *Database
}

func NewPostgresHappeningImpl(db *Database) repo.HappeningRepo {
	return &PostgresHappeningImpl{db: db}
}

func (h *PostgresHappeningImpl) GetAllHappenings(ctx context.Context) (res []model.Happening, err error) {
	query := `
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
	`
	err = h.db.SelectContext(ctx, &res, query)
	return res, err
}

func (h *PostgresHappeningImpl) GetHappeningById(ctx context.Context, id string) (hap model.Happening, err error) {
	query := `
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
		WHERE id = $1
	`
	err = h.db.GetContext(ctx, &hap, query, id)
	return hap, err
}
