package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
)

type HappeningRepo struct {
	db     *Database
	logger ports.Logger
}

func NewHappeningRepo(db *Database, logger ports.Logger) ports.HappeningRepo {
	return &HappeningRepo{db: db, logger: logger}
}

func (h *HappeningRepo) GetAllHappenings(ctx context.Context) (res []model.Happening, err error) {
	h.logger.Info(ctx, "getting all happenings")

	res = []model.Happening{}
	query := `--sql
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
	`
	err = h.db.SelectContext(ctx, &res, query)
	if err != nil {
		h.logger.Error(ctx, "failed to get all happenings",
			"error", err,
		)
	}
	return res, nil
}

func (h *HappeningRepo) GetHappeningById(ctx context.Context, id string) (hap model.Happening, err error) {
	h.logger.Info(ctx, "getting happening by ID",
		"id", id,
	)

	query := `--sql
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
		WHERE id = $1
	`
	err = h.db.GetContext(ctx, &hap, query, id)
	if err != nil {
		h.logger.Error(ctx, "failed to get happening by ID",
			"error", err,
			"id", id,
		)
	}
	return hap, nil
}

func (h *HappeningRepo) GetHappeningRegistrations(ctx context.Context, happeningID string) (regs []ports.HappeningRegistration, err error) {
	h.logger.Info(ctx, "getting happening registrations",
		"happening_id", happeningID,
	)

	regs = []ports.HappeningRegistration{}
	query := `--sql
		SELECT
			r.user_id, r.happening_id, r.status, r.unregister_reason, r.created_at, r.prev_status, r.changed_at, r.changed_by, u.name AS user_name, u.image AS user_image
		FROM registration r
		LEFT JOIN "user" u ON r.user_id = u.id
		WHERE r.happening_id = $1
	`
	err = h.db.SelectContext(ctx, &regs, query, happeningID)
	if err != nil {
		h.logger.Error(ctx, "failed to get happening registrations",
			"error", err,
			"happening_id", happeningID,
		)
	}
	return regs, nil
}

func (h *HappeningRepo) GetHappeningSpotRanges(ctx context.Context, happeningID string) (ranges []model.SpotRange, err error) {
	h.logger.Info(ctx, "getting happening spot ranges",
		"happening_id", happeningID,
	)

	ranges = []model.SpotRange{}
	query := `--sql
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &ranges, query, happeningID)
	if err != nil {
		h.logger.Error(ctx, "failed to get happening spot ranges",
			"error", err,
			"happening_id", happeningID,
		)
	}
	return ranges, nil
}

func (h *HappeningRepo) GetHappeningQuestions(ctx context.Context, happeningID string) (qs []model.Question, err error) {
	h.logger.Info(ctx, "getting happening questions",
		"happening_id", happeningID,
	)

	qs = []model.Question{}
	query := `--sql
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &qs, query, happeningID)
	if err != nil {
		h.logger.Error(ctx, "failed to get happening questions",
			"error", err,
			"happening_id", happeningID,
		)
	}
	return qs, nil
}

func (h *HappeningRepo) GetHappeningHostGroups(ctx context.Context, happeningID string) (groupIDs []string, err error) {
	h.logger.Info(ctx, "getting happening host groups",
		"happening_id", happeningID,
	)

	groupIDs = []string{}
	query := `--sql
		SELECT group_id
		FROM happenings_to_groups
		WHERE happening_id = $1
	`
	err = h.db.SelectContext(ctx, &groupIDs, query, happeningID)
	if err != nil {
		h.logger.Error(ctx, "failed to get happening host groups",
			"error", err,
			"happening_id", happeningID,
		)
	}
	return groupIDs, nil
}

func (h *HappeningRepo) CreateHappening(ctx context.Context, happening model.Happening) (model.Happening, error) {
	h.logger.Info(ctx, "creating happening",
		"slug", happening.Slug,
		"title", happening.Title,
		"type", happening.Type,
		"date", happening.Date,
		"registration_groups", happening.RegistrationGroups,
		"registration_start_groups", happening.RegistrationStartGroups,
		"registration_start", happening.RegistrationStart,
		"registration_end", happening.RegistrationEnd,
	)

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
	if err != nil {
		h.logger.Error(ctx, "failed to create happening",
			"error", err,
			"slug", happening.Slug,
			"title", happening.Title,
		)
	}
	return result, nil
}
