package feedback

import (
	"context"

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

	_, err = s.pool.Exec(ctx, `
		INSERT INTO site_feedback (id, email, name, message)
		VALUES ($1, $2, $3, $4)`, id, feedback.Email, feedback.Name, feedback.Message)

	return err
}
