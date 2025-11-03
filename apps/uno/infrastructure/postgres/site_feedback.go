package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
)

type SiteFeedbackRepo struct {
	db     *Database
	logger ports.Logger
}

func NewSiteFeedbackRepo(db *Database, logger ports.Logger) ports.SiteFeedbackRepo {
	return &SiteFeedbackRepo{db: db, logger: logger}
}

func (p *SiteFeedbackRepo) GetSiteFeedbackByID(ctx context.Context, feedbackID string) (model.SiteFeedback, error) {
	query := `--sql
		SELECT id, name, email, message, category, created_at, is_read
		FROM site_feedback
		WHERE id = $1
	`
	row := p.db.QueryRowContext(ctx, query, feedbackID)

	var feedback model.SiteFeedback
	err := row.Scan(&feedback.ID, &feedback.Name, &feedback.Email, &feedback.Message, &feedback.Category, &feedback.CreatedAt, &feedback.IsRead)
	if err != nil {
		return model.SiteFeedback{}, err
	}
	return feedback, nil
}

func (p *SiteFeedbackRepo) CreateSiteFeedback(ctx context.Context, feedback model.SiteFeedback) (model.SiteFeedback, error) {
	query := `--sql
		INSERT INTO site_feedback (id, name, email, message, category, is_read)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
		RETURNING id, name, email, message, category, created_at, is_read
	`
	var result model.SiteFeedback
	err := p.db.GetContext(ctx, &result, query, feedback.Name, feedback.Email, feedback.Message, feedback.Category, feedback.IsRead)
	return result, err
}

func (p *SiteFeedbackRepo) GetAllSiteFeedbacks(ctx context.Context) ([]model.SiteFeedback, error) {
	query := `--sql
		SELECT id, name, email, message, category, created_at, is_read
		FROM site_feedback
	`
	rows, err := p.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := rows.Close(); closeErr != nil && err == nil {
			err = closeErr
		}
	}()

	feedbacks := []model.SiteFeedback{}
	for rows.Next() {
		var feedback model.SiteFeedback
		if err := rows.Scan(&feedback.ID, &feedback.Name, &feedback.Email, &feedback.Message, &feedback.Category, &feedback.CreatedAt, &feedback.IsRead); err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, feedback)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return feedbacks, nil
}

func (p *SiteFeedbackRepo) MarkSiteFeedbackAsRead(ctx context.Context, feedbackID string) error {
	query := `--sql
		UPDATE site_feedback
		SET is_read = TRUE
		WHERE id = $1
	`
	_, err := p.db.ExecContext(ctx, query, feedbackID)
	return err
}
