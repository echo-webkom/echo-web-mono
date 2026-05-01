package dto

import (
	"time"
	"uno/domain/model"
)

type NotificationResponse struct {
	ID         int        `json:"id"`
	UserID     string     `json:"userId"`
	Type       string     `json:"type"`
	Title      string     `json:"title"`
	Content    *string    `json:"content"`
	Link       *string    `json:"link"`
	SeenAt     *time.Time `json:"seenAt"`
	ArchivedAt *time.Time `json:"archivedAt"`
	CreatedAt  time.Time  `json:"createdAt"`
}

func NotificationFromDomain(n model.Notification) NotificationResponse {
	return NotificationResponse{
		ID:         n.ID,
		UserID:     n.UserID,
		Type:       n.Type,
		Title:      n.Title,
		Content:    n.Content,
		Link:       n.Link,
		SeenAt:     n.SeenAt,
		ArchivedAt: n.ArchivedAt,
		CreatedAt:  n.CreatedAt,
	}
}

func NotificationsFromDomainList(ns []model.Notification) []NotificationResponse {
	result := make([]NotificationResponse, len(ns))
	for i, n := range ns {
		result[i] = NotificationFromDomain(n)
	}
	return result
}
