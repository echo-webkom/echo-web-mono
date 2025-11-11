package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/ports"
	"uno/domain/services"
	"uno/infrastructure/postgres/models"

	"github.com/jmoiron/sqlx"
)

type RegistrationRepo struct {
	db     *Database
	logger ports.Logger
}

func NewRegistrationRepo(db *Database, logger ports.Logger) ports.RegistrationRepo {
	return &RegistrationRepo{db: db, logger: logger}
}

// GetByUserAndHappening retrieves a registration by user ID and happening ID.
func (r *RegistrationRepo) GetByUserAndHappening(ctx context.Context, userID, happeningID string) (*model.Registration, error) {
	r.logger.Info(ctx, "getting registration by user and happening",
		"user_id", userID,
		"happening_id", happeningID,
	)

	var regDB models.RegistrationDB
	query := `--sql
		SELECT
			user_id, happening_id, status, unregister_reason,
			created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE user_id = $1 AND happening_id = $2
	`
	err := r.db.GetContext(ctx, &regDB, query, userID, happeningID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		r.logger.Error(ctx, "failed to get registration by user and happening",
			"error", err,
			"user_id", userID,
			"happening_id", happeningID,
		)
		return nil, err
	}
	return regDB.ToDomain(), nil
}

// CreateRegistration creates a new registration for a user to a happening.
// It checks for available spots and returns whether the user was waitlisted.
// An error here could be because of an issue with locking the table or a DB error.
func (r *RegistrationRepo) CreateRegistration(
	ctx context.Context,

	userID, happeningID string,
	spotRanges []model.SpotRange,
	hostGroups []string,
	canSkipSpotRange bool,
) (*model.Registration, bool, error) {
	r.logger.Info(ctx, "creating registration",
		"user_id", userID,
		"happening_id", happeningID,
	)

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
		r.logger.Error(ctx, "failed to lock registration table",
			"error", err,
		)
		return nil, false, err
	}

	// Get all existing registrations for this happening
	var existingRegsDB []models.RegistrationDB
	query := `--sql
		SELECT
			user_id, happening_id, status, unregister_reason,
			created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE happening_id = $1
			AND (status = 'registered' OR status = 'waiting')
	`
	err = tx.SelectContext(ctx, &existingRegsDB, query, happeningID)
	if err != nil {
		r.logger.Error(ctx, "failed to get existing registrations for happening",
			"error", err,
			"happening_id", happeningID,
		)
		return nil, false, err
	}
	existingRegs := models.RegistrationToDomainList(existingRegsDB)

	// Get user IDs for membership lookup
	userIDs := []string{userID}
	for _, reg := range existingRegs {
		userIDs = append(userIDs, reg.UserID)
	}

	// Get all users with their memberships
	usersByID := make(map[string]*model.User)
	membershipsByUserID := make(map[string][]string)

	// Bulk fetch all users
	var usersDB []models.UserDB
	userQuery, userArgs, err := sqlx.In(`--sql
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE id IN (?)
	`, userIDs)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch users",
			"error", err,
		)
		return nil, false, err
	}
	userQuery = tx.Rebind(userQuery)
	err = tx.SelectContext(ctx, &usersDB, userQuery, userArgs...)
	if err != nil && err != sql.ErrNoRows {
		return nil, false, err
	}

	// Convert to domain models and map users by ID
	users := models.UserToDomainList(usersDB)
	for i := range users {
		usersByID[users[i].ID] = &users[i]
	}

	// Bulk fetch all memberships
	type membership struct {
		UserID  string `db:"user_id"`
		GroupID string `db:"group_id"`
	}
	memberships := []membership{}
	membershipQuery, membershipArgs, err := sqlx.In(`--sql
		SELECT user_id, group_id
		FROM users_to_groups
		WHERE user_id IN (?)
	`, userIDs)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch memberships",
			"error", err,
		)
		return nil, false, err
	}
	membershipQuery = tx.Rebind(membershipQuery)
	err = tx.SelectContext(ctx, &memberships, membershipQuery, membershipArgs...)
	if err != nil && err != sql.ErrNoRows {
		r.logger.Error(ctx, "failed to select memberships",
			"error", err,
		)
		return nil, false, err
	}

	// Group memberships by user ID
	for _, m := range memberships {
		membershipsByUserID[m.UserID] = append(membershipsByUserID[m.UserID], m.GroupID)
	}

	// Check if there's an available spot using the service logic
	currentUser := usersByID[userID]
	if currentUser == nil {
		r.logger.Error(ctx, "failed to get current user",
			"user_id", userID,
		)
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
	var registrationDB models.RegistrationDB
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
	err = tx.GetContext(ctx, &registrationDB, upsertQuery, userID, happeningID, string(status))
	if err != nil {
		r.logger.Error(ctx, "failed to upsert registration",
			"error", err,
			"user_id", userID,
			"happening_id", happeningID,
		)
		return nil, false, err
	}

	if err = tx.Commit(); err != nil {
		r.logger.Error(ctx, "failed to commit registration transaction",
			"error", err,
		)
		return nil, false, err
	}

	return registrationDB.ToDomain(), !isRegistered, nil
}

// InsertAnswers inserts or updates answers for a user's registration to a happening.
func (r *RegistrationRepo) InsertAnswers(
	ctx context.Context,
	userID, happeningID string,
	questions []model.QuestionAnswer,
) error {
	r.logger.Info(ctx, "inserting answers for happening",
		"user_id", userID,
		"happening_id", happeningID,
	)

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
		r.logger.Error(ctx, "failed to begin transaction for inserting answers",
			"error", err,
		)
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
			r.logger.Error(ctx, "failed to insert answer",
				"error", err,
				"user_id", userID,
				"happening_id", happeningID,
				"question_id", q.QuestionID,
			)
			return err
		}
	}

	return tx.Commit()
}
