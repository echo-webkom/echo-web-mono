package postgres

import (
	"context"
	"encoding/json"
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
		"happening_id", id,
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
			"happening_id", id,
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

func (h *HappeningRepo) GetFullHappeningBySlug(ctx context.Context, slug string) (model.FullHappening, error) {
	h.logger.Info(ctx, "getting full happening by slug",
		"slug", slug,
	)

	// 1. Get happening by slug
	var dbHap record.Happening
	query := `--sql
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
		WHERE slug = $1
	`
	if err := h.db.GetContext(ctx, &dbHap, query, slug); err != nil {
		h.logger.Error(ctx, "failed to get happening by slug",
			"error", err,
			"slug", slug,
		)
		return model.FullHappening{}, err
	}
	happening := dbHap.ToDomain()

	// 2. Get registrations with user info
	var dbRegs []record.HappeningRegistrationDB
	regsQuery := `--sql
		SELECT
			r.user_id, r.happening_id, r.status, r.unregister_reason, r.created_at,
			r.prev_status, r.changed_at, r.changed_by, u.name AS user_name,
			COALESCE(u.alternative_email, u.email) AS user_email, u.year AS user_year,
			u.degree_id AS user_degree_id, u.image AS user_image
		FROM registration r
		LEFT JOIN "user" u ON r.user_id = u.id
		WHERE r.happening_id = $1
	`
	if err := h.db.SelectContext(ctx, &dbRegs, regsQuery, happening.ID); err != nil {
		h.logger.Error(ctx, "failed to get registrations for full happening",
			"error", err,
			"happening_id", happening.ID,
		)
		return model.FullHappening{}, err
	}
	regs := record.HappeningRegistrationToPortsList(dbRegs)

	// 3. Get answers grouped by user
	type answerDB struct {
		UserID     string           `db:"user_id"`
		QuestionID string           `db:"question_id"`
		Answer     *json.RawMessage `db:"answer"`
	}
	var dbAnswers []answerDB
	answersQuery := `--sql
		SELECT user_id, question_id, answer
		FROM answer
		WHERE happening_id = $1
	`
	if err := h.db.SelectContext(ctx, &dbAnswers, answersQuery, happening.ID); err != nil {
		h.logger.Error(ctx, "failed to get answers for full happening",
			"error", err,
			"happening_id", happening.ID,
		)
		return model.FullHappening{}, err
	}
	answersByUserID := make(map[string][]model.Answer)
	for _, a := range dbAnswers {
		answersByUserID[a.UserID] = append(answersByUserID[a.UserID], model.Answer{
			UserID:      a.UserID,
			HappeningID: happening.ID,
			QuestionID:  a.QuestionID,
			Answer:      a.Answer,
		})
	}

	// 4. Combine registrations with answers
	fullRegs := make([]model.FullHappeningRegistration, len(regs))
	for i, reg := range regs {
		fullRegs[i] = model.FullHappeningRegistration{
			HappeningRegistration: reg,
			Answers:               answersByUserID[reg.UserID],
		}
	}

	// 5. Get questions
	questions, err := h.GetHappeningQuestions(ctx, happening.ID)
	if err != nil {
		return model.FullHappening{}, err
	}

	// 6. Get host groups
	groups, err := h.GetHappeningHostGroups(ctx, happening.ID)
	if err != nil {
		groups = []string{}
	}

	return model.FullHappening{
		Happening:     happening,
		Registrations: fullRegs,
		Questions:     questions,
		Groups:        groups,
	}, nil
}

func (h *HappeningRepo) UpsertHappening(ctx context.Context, happening model.Happening) error {
	h.logger.Info(ctx, "upserting happening",
		"happening_id", happening.ID,
		"slug", happening.Slug,
	)

	query := `--sql
		INSERT INTO happening (id, slug, title, type, date, registration_groups, registration_start_groups, registration_start, registration_end)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		ON CONFLICT (id) DO UPDATE SET
			slug = EXCLUDED.slug,
			title = EXCLUDED.title,
			type = EXCLUDED.type,
			date = EXCLUDED.date,
			registration_groups = EXCLUDED.registration_groups,
			registration_start_groups = EXCLUDED.registration_start_groups,
			registration_start = EXCLUDED.registration_start,
			registration_end = EXCLUDED.registration_end
	`
	_, err := h.db.ExecContext(ctx, query,
		happening.ID,
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
		h.logger.Error(ctx, "failed to upsert happening",
			"error", err,
			"happening_id", happening.ID,
		)
		return err
	}

	return nil
}

func (h *HappeningRepo) DeleteHappening(ctx context.Context, id string) error {
	h.logger.Info(ctx, "deleting happening",
		"happening_id", id,
	)

	query := `--sql
		DELETE FROM happening WHERE id = $1
	`
	_, err := h.db.ExecContext(ctx, query, id)
	if err != nil {
		h.logger.Error(ctx, "failed to delete happening",
			"error", err,
			"happening_id", id,
		)
		return err
	}

	return nil
}

func (h *HappeningRepo) ReplaceHappeningGroups(ctx context.Context, happeningID string, groupIDs []string) error {
	h.logger.Info(ctx, "replacing happening groups",
		"happening_id", happeningID,
		"group_ids", groupIDs,
	)

	tx, err := h.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	_, err = tx.ExecContext(ctx, `--sql
		DELETE FROM happenings_to_groups WHERE happening_id = $1
	`, happeningID)
	if err != nil {
		h.logger.Error(ctx, "failed to delete existing happening groups",
			"error", err,
			"happening_id", happeningID,
		)
		return err
	}

	if len(groupIDs) > 0 {
		for _, groupID := range groupIDs {
			_, err = tx.ExecContext(ctx, `--sql
				INSERT INTO happenings_to_groups (happening_id, group_id) VALUES ($1, $2)
			`, happeningID, groupID,
			)
			if err != nil {
				h.logger.Error(ctx, "failed to insert happening group",
					"error", err,
					"happening_id", happeningID,
					"group_id", groupID,
				)
				return err
			}
		}
	}

	return tx.Commit()
}

func (h *HappeningRepo) ReplaceSpotRanges(ctx context.Context, happeningID string, spotRanges []model.SpotRange) error {
	h.logger.Info(ctx, "replacing spot ranges",
		"happening_id", happeningID,
	)

	tx, err := h.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	_, err = tx.ExecContext(ctx, `--sql
		DELETE FROM spot_range WHERE happening_id = $1`, happeningID)
	if err != nil {
		h.logger.Error(ctx, "failed to delete existing spot ranges",
			"error", err,
			"happening_id", happeningID,
		)
		return err
	}

	for _, sr := range spotRanges {
		_, err = tx.ExecContext(ctx, `--sql
			INSERT INTO spot_range (id, happening_id, spots, min_year, max_year) VALUES (gen_random_uuid(), $1, $2, $3, $4)
		`, happeningID, sr.Spots, sr.MinYear, sr.MaxYear,
		)
		if err != nil {
			h.logger.Error(ctx, "failed to insert spot range",
				"error", err,
				"happening_id", happeningID,
			)
			return err
		}
	}

	return tx.Commit()
}

// SyncQuestions compares the existing questions for a happening with the new incoming list.
// The function:
//   - Deletes questions that are in the existing list but not in the incoming list
//   - Updates questions that are in both lists
//   - Inserts questions that are in the incoming list but not in the existing list.
func (h *HappeningRepo) SyncQuestions(ctx context.Context, happeningID string, incoming []model.Question) error {
	h.logger.Info(ctx, "syncing questions",
		"happening_id", happeningID,
	)

	existing, err := h.GetHappeningQuestions(ctx, happeningID)
	if err != nil {
		return err
	}

	existingIDs := make(map[string]bool)
	for _, q := range existing {
		existingIDs[q.ID] = true
	}

	incomingIDs := make(map[string]bool)
	for _, q := range incoming {
		incomingIDs[q.ID] = true
	}

	// Delete questions that are in existing but not in incoming
	for _, q := range existing {
		if !incomingIDs[q.ID] {
			_, err := h.db.ExecContext(ctx, `--sql
				DELETE FROM question WHERE id = $1 AND happening_id = $2`,
				q.ID, happeningID,
			)
			if err != nil {
				h.logger.Error(ctx, "failed to delete question",
					"error", err,
					"question_id", q.ID,
				)
				return err
			}
		}
	}

	// Insert new questions and update existing ones
	for _, q := range incoming {
		if existingIDs[q.ID] {
			// Update
			_, err := h.db.ExecContext(ctx, `--sql
				UPDATE question SET title = $1, required = $2, type = $3, is_sensitive = $4, options = $5 WHERE id = $6 AND happening_id = $7`,
				q.Title, q.Required, q.Type, q.IsSensitive, q.Options, q.ID, happeningID,
			)
			if err != nil {
				h.logger.Error(ctx, "failed to update question",
					"error", err,
					"question_id", q.ID,
				)
				return err
			}
		} else {
			// Insert
			_, err := h.db.ExecContext(ctx, `--sql
				INSERT INTO question (id, happening_id, title, required, type, is_sensitive, options) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
				q.ID, happeningID, q.Title, q.Required, q.Type, q.IsSensitive, q.Options,
			)
			if err != nil {
				h.logger.Error(ctx, "failed to insert question",
					"error", err,
					"question_id", q.ID,
				)
				return err
			}
		}
	}

	return nil
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
