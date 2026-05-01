package port

import (
	"context"
	"uno/domain/model"
)

type NotificationRepo interface {
	GetByUserID(ctx context.Context, userID string) ([]model.Notification, error)
	Create(ctx context.Context, userID, notifType, title string, content, link *string) error
	Archive(ctx context.Context, id int, userID string) error
	MarkSeen(ctx context.Context, id int, userID string) error
}
