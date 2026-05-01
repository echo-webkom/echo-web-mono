package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type NotificationService struct {
	notificationRepo port.NotificationRepo
}

func NewNotificationService(notificationRepo port.NotificationRepo) *NotificationService {
	return &NotificationService{notificationRepo: notificationRepo}
}

func (s *NotificationService) GetByUserID(ctx context.Context, userID string) ([]model.Notification, error) {
	return s.notificationRepo.GetByUserID(ctx, userID)
}

func (s *NotificationService) Archive(ctx context.Context, id int, userID string) error {
	return s.notificationRepo.Archive(ctx, id, userID)
}

func (s *NotificationService) MarkSeen(ctx context.Context, id int, userID string) error {
	return s.notificationRepo.MarkSeen(ctx, id, userID)
}
