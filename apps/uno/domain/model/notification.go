package model

import "time"

type Notification struct {
	ID         int
	UserID     string
	Type       string
	Title      string
	Content    *string
	Link       *string
	SeenAt     *time.Time
	ArchivedAt *time.Time
	CreatedAt  time.Time
}
