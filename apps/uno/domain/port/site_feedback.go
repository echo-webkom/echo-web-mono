package port

import (
	"context"
	"uno/domain/model"
)

type SiteFeedbackRepo interface {
	GetAllSiteFeedbacks(ctx context.Context) ([]model.SiteFeedback, error)
	GetSiteFeedbackByID(ctx context.Context, feedbackID string) (model.SiteFeedback, error)
	CreateSiteFeedback(ctx context.Context, feedback model.NewSiteFeedback) (model.SiteFeedback, error)
	MarkSiteFeedbackAsRead(ctx context.Context, feedbackID string) error
}
