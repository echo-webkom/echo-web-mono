package record

import (
	"time"
	"uno/domain/model"
)

type NotificationDB struct {
	ID         int        `db:"id"`
	UserID     string     `db:"user_id"`
	Type       string     `db:"type"`
	Title      string     `db:"title"`
	Content    *string    `db:"content"`
	Link       *string    `db:"link"`
	SeenAt     *time.Time `db:"seen_at"`
	ArchivedAt *time.Time `db:"archived_at"`
	CreatedAt  time.Time  `db:"created_at"`
}

func (db *NotificationDB) ToDomain() *model.Notification {
	return &model.Notification{
		ID:         db.ID,
		UserID:     db.UserID,
		Type:       db.Type,
		Title:      db.Title,
		Content:    db.Content,
		Link:       db.Link,
		SeenAt:     db.SeenAt,
		ArchivedAt: db.ArchivedAt,
		CreatedAt:  db.CreatedAt,
	}
}
