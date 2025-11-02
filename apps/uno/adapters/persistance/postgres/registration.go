package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/repo"
	"uno/domain/services"
)

type RegistrationRepo struct {
	db *Database
}

func (r *RegistrationRepo) GetByUserAndHappening(ctx context.Context, userID, happeningID string) (*model.Registration, error) {
	var reg model.Registration
	query := `--sql
		SELECT
			user_id, happening_id, status, unregister_reason,
			created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE user_id = $1 AND happening_id = $2
	`
	err := r.db.GetContext(ctx, &reg, query, userID, happeningID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &reg, nil
}

func (r *RegistrationRepo) CreateRegistration(
	ctx context.Context,
	userID, happeningID string,
	spotRanges []model.SpotRange,
	hostGroups []string,
	canSkipSpotRange bool,
) (*model.Registration, bool, error) {
	tx, err := r.db.BeginTxx(ctx, &sql.TxOptions{
		Isolation: sql.LevelReadCommitted,
	})
	if err != nil {
		return nil, false, err
	}
	defer func() { _ = tx.Rollback() }()

	// Lock the registration table
	// TODO: Should be a more fine-grained lock if performance becomes an issue
	_, err = tx.ExecContext(ctx, `LOCK TABLE registration IN EXCLUSIVE MODE`)
	if err != nil {
		return nil, false, err
	}

	// Get all existing registrations for this happening
	var existingRegs []model.Registration
	query := `--sql
		SELECT
			user_id, happening_id, status, unregister_reason,
			created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE happening_id = $1
			AND (status = 'registered' OR status = 'waiting')
	`
	err = tx.SelectContext(ctx, &existingRegs, query, happeningID)
	if err != nil {
		return nil, false, err
	}

	// Get user IDs for membership lookup
	userIDs := []string{userID}
	for _, reg := range existingRegs {
		userIDs = append(userIDs, reg.UserID)
	}

	// Get all users with their memberships
	usersByID := make(map[string]*model.User)
	membershipsByUserID := make(map[string][]string)

	for _, uid := range userIDs { // TODO: Fix N+1 query
		var user model.User
		userQuery := `--sql
			SELECT
				id, name, email, image, alternative_email, degree_id, year, type,
				last_sign_in_at, updated_at, created_at, has_read_terms,
				birthday, is_public
			FROM "user"
			WHERE id = $1
		`
		err = tx.GetContext(ctx, &user, userQuery, uid)
		if err != nil && err != sql.ErrNoRows {
			return nil, false, err
		}
		if err == nil {
			usersByID[uid] = &user

			// Get memberships for this user
			var memberships []string
			membershipQuery := `--sql
				SELECT group_id
				FROM users_to_groups
				WHERE user_id = $1
			`
			err = tx.SelectContext(ctx, &memberships, membershipQuery, uid)
			if err != nil && err != sql.ErrNoRows {
				return nil, false, err
			}
			membershipsByUserID[uid] = memberships
		}
	}

	// Check if there's an available spot using the service logic
	currentUser := usersByID[userID]
	if currentUser == nil {
		return nil, false, sql.ErrNoRows
	}

	isRegistered := services.IsAvailableSpot(
		spotRanges,
		existingRegs,
		usersByID,
		membershipsByUserID,
		hostGroups,
		currentUser,
		canSkipSpotRange,
	)

	status := model.RegistrationStatusWaitlisted
	if isRegistered {
		status = model.RegistrationStatusRegistered
	}

	// Insert or update registration
	var registration model.Registration
	upsertQuery := `--sql
		INSERT INTO registration (user_id, happening_id, status, created_at)
		VALUES ($1, $2, $3, NOW())
		ON CONFLICT (user_id, happening_id)
		DO UPDATE SET
			status = EXCLUDED.status,
			changed_at = NOW()
		RETURNING user_id, happening_id, status, unregister_reason,
			created_at, prev_status, changed_at, changed_by
	`
	err = tx.GetContext(ctx, &registration, upsertQuery, userID, happeningID, status)
	if err != nil {
		return nil, false, err
	}

	if err = tx.Commit(); err != nil {
		return nil, false, err
	}

	return &registration, !isRegistered, nil
}

func (r *RegistrationRepo) InsertAnswers(
	ctx context.Context,
	userID, happeningID string,
	questions []model.QuestionAnswer,
) error {
	if len(questions) == 0 {
		return nil
	}

	// Build bulk insert query
	query := `--sql
		INSERT INTO answer (user_id, happening_id, question_id, answer)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id, happening_id, question_id)
		DO UPDATE SET answer = EXCLUDED.answer
	`

	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	for _, q := range questions {
		// Convert json.RawMessage to JSONB for postgres
		var answerJSON any
		if len(q.Answer) > 0 {
			answerJSON = q.Answer
		}

		_, err = tx.ExecContext(ctx, query, userID, happeningID, q.QuestionID, answerJSON)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func NewRegistrationRepo(db *Database) repo.RegistrationRepo {
	return &RegistrationRepo{db: db}
}
