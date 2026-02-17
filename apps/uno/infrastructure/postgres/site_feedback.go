package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type SiteFeedbackRepo struct {
	db     *Database
	logger port.Logger
}

func NewSiteFeedbackRepo(db *Database, logger port.Logger) port.SiteFeedbackRepo {
	return &SiteFeedbackRepo{db: db, logger: logger}
}

func (p *SiteFeedbackRepo) GetSiteFeedbackByID(ctx context.Context, feedbackID string) (model.SiteFeedback, error) {
	p.logger.Info(ctx, "getting site feedback by ID",
		"feedback_id", feedbackID,
	)

	query := `--sql
		SELECT id, name, email, message, category, created_at, is_read
		FROM site_feedback
		WHERE id = $1
	`
	var dbModel record.SiteFeedback
	err := p.db.GetContext(ctx, &dbModel, query, feedbackID)

	if err != nil {
		p.logger.Error(ctx, "failed to get site feedback by ID",
			"error", err,
			"feedback_id", feedbackID,
		)
		return model.SiteFeedback{}, err
	}
	return *dbModel.ToDomain(), nil
}

func (p *SiteFeedbackRepo) CreateSiteFeedback(ctx context.Context, feedback model.NewSiteFeedback) (model.SiteFeedback, error) {
	p.logger.Info(ctx, "creating site feedback")

	query := `--sql
		INSERT INTO site_feedback (id, name, email, message, category, is_read)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
		RETURNING id, name, email, message, category, created_at, is_read
	`
	var dbModel record.SiteFeedback
	err := p.db.GetContext(ctx, &dbModel, query, feedback.Name, feedback.Email.StringPtr(), feedback.Message, feedback.Category, false)
	if err != nil {
		p.logger.Error(ctx, "failed to create site feedback",
			"error", err,
		)
		return model.SiteFeedback{}, err
	}
	return *dbModel.ToDomain(), nil
}

func (p *SiteFeedbackRepo) GetAllSiteFeedbacks(ctx context.Context) ([]model.SiteFeedback, error) {
	p.logger.Info(ctx, "getting all site feedbacks")

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

	feedbacks := []record.SiteFeedback{}
	for rows.Next() {
		var feedback record.SiteFeedback
		if err := rows.Scan(&feedback.ID, &feedback.Name, &feedback.Email, &feedback.Message, &feedback.Category, &feedback.CreatedAt, &feedback.IsRead); err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, feedback)
	}
	if err := rows.Err(); err != nil {
		p.logger.Error(ctx, "failed to get all site feedbacks",
			"error", err,
		)
		return nil, err
	}
	return record.SiteFeedbacksToDomainList(feedbacks), nil
}

func (p *SiteFeedbackRepo) MarkSiteFeedbackAsRead(ctx context.Context, feedbackID string) error {
	p.logger.Info(ctx, "marking site feedback as read",
		"feedback_id", feedbackID,
	)

	query := `--sql
		UPDATE site_feedback
		SET is_read = TRUE
		WHERE id = $1
	`
	_, err := p.db.ExecContext(ctx, query, feedbackID)
	if err != nil {
		p.logger.Error(ctx, "failed to mark site feedback as read",
			"error", err,
			"feedback_id", feedbackID,
		)
		return err
	}
	return nil
}
