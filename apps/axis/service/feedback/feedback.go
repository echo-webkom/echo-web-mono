package feedback

import (
	"context"
	"errors"

	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

type FeedbackService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *FeedbackService {
	return &FeedbackService{
		pool,
	}
}

func (s *FeedbackService) SubmitFeedback(ctx context.Context, feedback NewFeedbackRequest) error {
	id, err := gonanoid.New()
	if err != nil {
		return err
	}

	if feedback.Email != nil && !isEmail(*feedback.Email) {
		return errors.New("invalid email")
	}

	_, err = s.pool.Exec(ctx, `
		INSERT INTO site_feedback (id, email, name, message)
		VALUES ($1, $2, $3, $4)`, id, feedback.Email, feedback.Name, feedback.Message)

	return err
}

func (s *FeedbackService) ListFeedback(ctx context.Context) ([]database.SiteFeedback, error) {
	feedbacks := []database.SiteFeedback{}

	rows, err := s.pool.Query(ctx, `
		SELECT id, email, name, message, is_read, created_at
		FROM site_feedback
		ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var f database.SiteFeedback
		if err := rows.Scan(&f.ID, &f.Email, &f.Name, &f.Message, &f.IsRead, &f.CreatedAt); err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, f)
	}

	return feedbacks, rows.Err()
}
