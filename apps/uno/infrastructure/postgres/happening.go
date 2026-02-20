package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"

	"github.com/lib/pq"
)

type HappeningRepo struct {
	db     *Database
	logger port.Logger
}

func NewHappeningRepo(db *Database, logger port.Logger) port.HappeningRepo {
	return &HappeningRepo{db: db, logger: logger}
}

func (h *HappeningRepo) GetAllHappenings(ctx context.Context) ([]model.Happening, error) {
	h.logger.Info(ctx, "getting all happenings")

	dbRes := []record.Happening{}
	query := `--sql
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
	`
	if err := h.db.SelectContext(ctx, &dbRes, query); err != nil {
		h.logger.Error(ctx, "failed to get all happenings",
			"error", err,
		)
		return nil, err
	}

	return record.HappeningsToDomainList(dbRes), nil
}

func (h *HappeningRepo) GetHappeningById(ctx context.Context, id string) (model.Happening, error) {
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
	dbHap := record.Happening{}
	if err := h.db.GetContext(ctx, &dbHap, query, id); err != nil {
		h.logger.Error(ctx, "failed to get happening by ID",
			"error", err,
			"id", id,
		)
		return model.Happening{}, err
	}

	return dbHap.ToDomain(), nil
}

func (h *HappeningRepo) GetHappeningRegistrations(ctx context.Context, happeningID string) (regs []model.HappeningRegistration, err error) {
	h.logger.Info(ctx, "getting happening registrations",
		"happening_id", happeningID,
	)

	var dbRegs []record.HappeningRegistrationDB
	query := `--sql
		SELECT
			r.user_id, r.happening_id, r.status, r.unregister_reason, r.created_at, r.prev_status, r.changed_at, r.changed_by, u.name AS user_name, u.image AS user_image
		FROM registration r
		LEFT JOIN "user" u ON r.user_id = u.id
		WHERE r.happening_id = $1
	`
	if err := h.db.SelectContext(ctx, &dbRegs, query, happeningID); err != nil {
		h.logger.Error(ctx, "failed to get happening registrations",
			"error", err,
			"happening_id", happeningID,
		)
		return nil, err
	}

	regs = record.HappeningRegistrationToPortsList(dbRegs)
	return regs, nil
}

func (h *HappeningRepo) GetHappeningSpotRanges(ctx context.Context, happeningID string) ([]model.SpotRange, error) {
	h.logger.Info(ctx, "getting happening spot ranges",
		"happening_id", happeningID,
	)

	dbRanges := []record.SpotRange{}
	query := `--sql
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	if err := h.db.SelectContext(ctx, &dbRanges, query, happeningID); err != nil {
		h.logger.Error(ctx, "failed to get happening spot ranges",
			"error", err,
			"happening_id", happeningID,
		)
		return nil, err
	}

	return record.SpotRangesToDomainList(dbRanges), nil
}

func (h *HappeningRepo) GetHappeningQuestions(ctx context.Context, happeningID string) ([]model.Question, error) {
	h.logger.Info(ctx, "getting happening questions",
		"happening_id", happeningID,
	)

	dbQs := []record.Question{}
	query := `--sql
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	if err := h.db.SelectContext(ctx, &dbQs, query, happeningID); err != nil {
		h.logger.Error(ctx, "failed to get happening questions",
			"error", err,
			"happening_id", happeningID,
		)
		return nil, err
	}

	return record.QuestionsToDomainList(dbQs), nil
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
	if err := h.db.SelectContext(ctx, &groupIDs, query, happeningID); err != nil {
		h.logger.Error(ctx, "failed to get happening host groups",
			"error", err,
			"happening_id", happeningID,
		)
		return groupIDs, err
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
	var result record.Happening
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
		return model.Happening{}, err
	}

	return result.ToDomain(), nil
}

func (h *HappeningRepo) GetHappeningRegistrationCounts(
	ctx context.Context,
	happeningIDs []string,
) ([]model.RegistrationCount, error) {
	h.logger.Info(ctx, "getting happening registration counts",
		"happening_ids", happeningIDs,
	)

	counts := []record.GroupedRegistrationCount{}
	query := `--sql
		WITH spot_totals AS (
		    SELECT happening_id, SUM(spots) AS max
		    FROM spot_range
		    GROUP BY happening_id
		)
		SELECT
		    h.id AS happening_id,
		    st.max,
		    COUNT(r.user_id) FILTER (WHERE r.status = 'waiting') AS waiting,
		    COUNT(r.user_id) FILTER (WHERE r.status = 'registered') AS registered
		FROM happening h
		LEFT JOIN registration r ON h.id = r.happening_id
		LEFT JOIN spot_totals st ON h.id = st.happening_id
		WHERE h.id = ANY($1)
		GROUP BY h.id, st.max
	`
	if err := h.db.SelectContext(ctx, &counts, query, pq.Array(happeningIDs)); err != nil {
		h.logger.Error(ctx, "failed to get happening registration counts",
			"error", err,
			"happening_ids", happeningIDs,
		)
		return nil, err
	}

	return record.GroupedRegistrationCountsToDomainList(counts), nil
}
