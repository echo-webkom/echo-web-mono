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
	res = []model.Happening{}
	query := `--sql
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
	`
	err = h.db.SelectContext(ctx, &res, query)
	return res, err
}

func (h *HappeningRepo) GetHappeningById(ctx context.Context, id string) (hap model.Happening, err error) {
	query := `--sql
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
		WHERE id = $1
	`
	err = h.db.GetContext(ctx, &hap, query, id)
	return hap, err
}

func (h *HappeningRepo) GetHappeningRegistrations(ctx context.Context, happeningID string) (regs []repo.HappeningRegistration, err error) {
	regs = []repo.HappeningRegistration{}
	query := `--sql
		SELECT
			r.user_id, r.happening_id, r.status, r.unregister_reason, r.created_at, r.prev_status, r.changed_at, r.changed_by, u.name AS user_name, u.image AS user_image
		FROM registration r
		LEFT JOIN "user" u ON r.user_id = u.id
		WHERE r.happening_id = $1
	`
	err = h.db.SelectContext(ctx, &regs, query, happeningID)
	return regs, err
}

func (h *HappeningRepo) GetHappeningSpotRanges(ctx context.Context, happeningID string) (ranges []model.SpotRange, err error) {
	ranges = []model.SpotRange{}
	query := `--sql
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &ranges, query, happeningID)
	return ranges, err
}

func (h *HappeningRepo) GetHappeningQuestions(ctx context.Context, happeningID string) (qs []model.Question, err error) {
	qs = []model.Question{}
	query := `--sql
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &qs, query, happeningID)
	return qs, err
}

func (h *HappeningRepo) GetHappeningHostGroups(ctx context.Context, happeningID string) (groupIDs []string, err error) {
	groupIDs = []string{}
	query := `--sql
		SELECT group_id
		FROM happenings_to_groups
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &groupIDs, query, happeningID)
	return groupIDs, err
}

func (h *HappeningRepo) CreateHappening(ctx context.Context, happening model.Happening) (model.Happening, error) {
	query := `--sql
		INSERT INTO happening (id, slug, title, type, date, registration_groups, registration_start_groups, registration_start, registration_end)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, slug, title, type, date, registration_groups, registration_start_groups, registration_start, registration_end
	`
	var result model.Happening
	err := h.db.GetContext(ctx, &result, query,
		happening.Slug,
		happening.Title,
		happening.Type,
		happening.Date,
		happening.RegistrationGroups,
		happening.RegistrationStartGroups,
		happening.RegistrationStart,
		happening.RegistrationEnd,
	)
	return result, err
}

func NewHappeningRepo(db *Database) repo.HappeningRepo {
	return &HappeningRepo{db: db}
}
