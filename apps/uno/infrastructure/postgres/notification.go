package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type NotificationRepo struct {
	db     *Database
	logger port.Logger
}

func NewNotificationRepo(db *Database, logger port.Logger) port.NotificationRepo {
	return &NotificationRepo{db: db, logger: logger}
}

func (r *NotificationRepo) GetByUserID(ctx context.Context, userID string) ([]model.Notification, error) {
	r.logger.Info(ctx, "getting notifications for user", "user_id", userID)

	query := `--sql
		SELECT id, user_id, type, title, content, link, seen_at, archived_at, created_at
		FROM notification
		WHERE user_id = $1 AND archived_at IS NULL
		ORDER BY created_at DESC;
	`

	var rows []record.NotificationDB
	if err := r.db.SelectContext(ctx, &rows, query, userID); err != nil {
		r.logger.Error(ctx, "failed to get notifications", "error", err, "user_id", userID)
		return nil, err
	}

	notifications := make([]model.Notification, len(rows))
	for i, n := range rows {
		notifications[i] = n.ToDomain()
	}

	return notifications, nil
}

func (r *NotificationRepo) Archive(ctx context.Context, id int, userID string) error {
	r.logger.Info(ctx, "archiving notification", "id", id, "user_id", userID)

	// Also set seen_at if it is currently NULL.
	query := `--sql
		UPDATE notification
		SET archived_at = NOW(), seen_at = COALESCE(seen_at, NOW())
		WHERE id = $1 AND user_id = $2;
	`

	if _, err := r.db.ExecContext(ctx, query, id, userID); err != nil {
		r.logger.Error(ctx, "failed to archive notification", "error", err, "id", id, "user_id", userID)
		return err
	}

	return nil
}

func (r *NotificationRepo) MarkSeen(ctx context.Context, id int, userID string) error {
	r.logger.Info(ctx, "marking notification as seen", "id", id, "user_id", userID)

	// We only update seen_at if it is currently NULL.
	// Because we don't want to "re-see" a notification that has already been seen.
	query := `--sql
		UPDATE notification
		SET seen_at = NOW()
		WHERE id = $1 AND user_id = $2 AND seen_at IS NULL;
	`

	if _, err := r.db.ExecContext(ctx, query, id, userID); err != nil {
		r.logger.Error(ctx, "failed to mark notification as seen", "error", err, "id", id, "user_id", userID)
		return err
	}

	return nil
}
