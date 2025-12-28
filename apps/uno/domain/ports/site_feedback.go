package ports

import (
	"context"
	"uno/domain/model"
)

type SiteFeedbackRepo interface {
	GetAllSiteFeedbacks(ctx context.Context) ([]model.SiteFeedback, error)
	GetSiteFeedbackByID(ctx context.Context, feedbackID string) (model.SiteFeedback, error)
	CreateSiteFeedback(ctx context.Context, feedback model.SiteFeedback) (model.SiteFeedback, error)
	MarkSiteFeedbackAsRead(ctx context.Context, feedbackID string) error
}
