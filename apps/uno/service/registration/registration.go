package registration

import (
	"context"
	"time"

	"github.com/echo-webkom/uno/sanity"
	"github.com/echo-webkom/uno/service/ban"
	"github.com/echo-webkom/uno/service/happening"
	"github.com/echo-webkom/uno/service/question"
	"github.com/echo-webkom/uno/service/spotrange"
	"github.com/echo-webkom/uno/service/user"
	"github.com/echo-webkom/uno/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RegistrationService struct {
	pool *pgxpool.Pool
	us   *user.UserService
	bs   *ban.BanService
	hs   *happening.HappeningService
	srs  *spotrange.SpotRangeService
	qs   *question.QuestionService
}

func New(pool *pgxpool.Pool, client *sanity.SanityClient) *RegistrationService {
	us := user.New(pool)
	bs := ban.New(pool)
	hs := happening.New(pool, client)
	srs := spotrange.New(pool)
	qs := question.New(pool)

	return &RegistrationService{
		pool: pool,
		us:   us,
		bs:   bs,
		hs:   hs,
		srs:  srs,
		qs:   qs,
	}
}

// Count returns the number of registrations for a given event ID.
func (s *RegistrationService) Count(ctx context.Context, happeningID string) (RegistrationCount, error) {
	var count RegistrationCount

	query := `--sql
		SELECT
			COUNT(*) FILTER (WHERE status = 'registered') AS registered,
			COUNT(*) FILTER (WHERE status = 'waiting') AS waitlisted
		FROM registration
		WHERE happening_id = $1
	`

	err := s.pool.QueryRow(ctx, query, happeningID).Scan(&count.Registered, &count.Waitlisted)
	if err != nil {
		return RegistrationCount{}, err
	}
	return count, nil
}

// Finds the registrations for a given happening ID
// Only returns the registrations that are registered and waitlisted
func (s *RegistrationService) FindByHappeningID(ctx context.Context, happeningID string) ([]database.Registration, error) {
	var registrations []database.Registration

	query := `--sql
		SELECT user_id, happening_id, status, unregister_reason, created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE happening_id = $1 AND (status = 'registered' OR status = 'waiting')
	`

	rows, err := s.pool.Query(ctx, query, happeningID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var r database.Registration
		if err := rows.Scan(r.UserID, r.HappeningID, r.Status, r.UnregisterReason, r.CreatedAt, r.PrevStatus, r.ChangedAt, r.ChangedBy); err != nil {
			return nil, err
		}
		registrations = append(registrations, r)
	}

	return registrations, nil
}

// Finds a registration by user ID and happening ID
func (s *RegistrationService) FindByUserIDAndHappeningID(ctx context.Context, userID, happeningID string) (database.Registration, error) {
	var registration database.Registration

	query := `--sql
		SELECT user_id, happening_id, status, unregister_reason, created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE user_id = $1 AND happening_id = $2
	`

	err := s.pool.QueryRow(ctx, query, userID, happeningID).Scan(&registration.UserID, &registration.HappeningID, &registration.Status, &registration.UnregisterReason, &registration.CreatedAt, &registration.PrevStatus, &registration.ChangedAt, &registration.ChangedBy)
	if err != nil {
		return database.Registration{}, err
	}

	return registration, nil
}

// Register a user for a happening.
func (s *RegistrationService) Register(ctx context.Context, userID, happeningID string, answers []Answer) (database.RegistrationStatus, error) {
	user, err := s.us.FindByID(ctx, userID)
	if err != nil {
		return "", ErrUserNotFound
	}

	if !user.IsProfileComplete() {
		return "", ErrUserIncomplete
	}

	event, err := s.hs.FindByID(ctx, happeningID)
	if err != nil {
		return "", ErrHappeningNotFound
	}

	// Check if the user is banned from the event
	isBedpres := event.Type == "bedpres"
	if isBedpres && s.bs.IsBanned(ctx, user.ID) {
		return "", ErrUserBanned
	}

	r, err := s.FindByUserIDAndHappeningID(ctx, user.ID, happeningID)
	if err != nil {
		return "", ErrInternalError
	}

	// Check if the user is already registered
	if r.Status == database.RegistrationStatusRegistered {
		return "", ErrUserAlreadyRegistered
	}
	if r.Status == database.RegistrationStatusWaitlisted {
		return "", ErrUserAlreadyWaitlisted
	}
	if r.Status == database.RegistrationStatusRemoved {
		return "", ErrUserRemoved
	}

	// Check if it is before registrations start
	if event.RegistrationStart != nil && event.RegistrationStart.After(time.Now()) {
		return "", ErrRegistrationNotStarted
	}

	// Check if it is after registrations end
	if event.RegistrationEnd != nil && event.RegistrationEnd.Before(time.Now()) {
		return "", ErrRegistrationClosed
	}

	spotRanges, err := s.srs.FindByHappeningID(ctx, happeningID)
	if err != nil {
		return "", ErrInternalError
	}

	var spotRange database.SpotRange
	for _, sr := range spotRanges {
		if fitsInToSpotRange(sr, user) {
			spotRange = sr
			break
		}
	}

	if spotRange.ID == "" {
		return "", ErrUserIneligible
	}

	questions, err := s.qs.FindByHappeningID(ctx, event.ID)
	if err != nil {
		return "", ErrInternalError
	}

	for _, q := range questions {
		if q.Required && !isAnswered(q, answers) {
			return "", ErrQuestionNotAnswered
		}
	}

	return database.RegistrationStatusRegistered, nil
}

// Find the spot ranges where the user fits
func fitsInToSpotRange(spotRange database.SpotRange, user database.User) bool {
	if user.Year == nil {
		return false
	}
	return *user.Year >= spotRange.MinYear && *user.Year <= spotRange.MaxYear
}

// Checks if the question is answered
func isAnswered(question database.Question, answers []Answer) bool {
	for _, a := range answers {
		if a.QuestionID == question.ID {
			return true
		}
	}
	return false
}
