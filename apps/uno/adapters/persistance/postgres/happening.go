package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type HappeningRepo struct {
	db *Database
}

func (h *HappeningRepo) GetAllHappenings(ctx context.Context) (res []model.Happening, err error) {
	query := `
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
	`
	err = h.db.SelectContext(ctx, &res, query)
	return res, err
}

func (h *HappeningRepo) GetHappeningById(ctx context.Context, id string) (hap model.Happening, err error) {
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

func (h *HappeningRepo) GetHappeningRegistrations(ctx context.Context, happeningID string) (regs []model.Registration, err error) {
	query := `
		SELECT
			user_id, happening_id, status, unregister_reason, created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &regs, query, happeningID)
	return regs, err
}

func (h *HappeningRepo) GetHappeningSpotRanges(ctx context.Context, happeningID string) (ranges []model.SpotRange, err error) {
	query := `
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &ranges, query, happeningID)
	return ranges, err
}

func (h *HappeningRepo) GetHappeningQuestions(ctx context.Context, happeningID string) (qs []model.Question, err error) {
	query := `
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &qs, query, happeningID)
	return qs, err
}

func NewHappeningRepo(db *Database) repo.HappeningRepo {
	return &HappeningRepo{db: db}
}
