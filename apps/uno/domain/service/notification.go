package service

import (
	"context"
	"strings"
	"uno/domain/model"
	"uno/domain/port"
)

const (
	NotificationTypeCommentReply = "comment_reply"
)

type NotificationService struct {
	notificationRepo port.NotificationRepo
	commentRepo      port.CommentRepo
	happeningRepo    port.HappeningRepo
}

func NewNotificationService(notificationRepo port.NotificationRepo, commentRepo port.CommentRepo, happeningRepo port.HappeningRepo) *NotificationService {
	return &NotificationService{
		notificationRepo: notificationRepo,
		commentRepo:      commentRepo,
		happeningRepo:    happeningRepo,
	}
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

// CreateReplyNotifications notifies everyone up the comment ancestor chain that
// a new reply was posted. The replier is excluded from notifications.
func (s *NotificationService) CreateReplyNotifications(ctx context.Context, parentCommentID string, replierUserID string, postSlug string) error {
	ancestorUserIDs, err := s.commentRepo.GetAncestorUserIDs(ctx, parentCommentID)
	if err != nil {
		return err
	}

	link := s.resolvePostLink(ctx, postSlug)
	title := "Noen svarte på kommentaren din"

	// Create a set of seen user IDs to avoid sending duplicate notifications to the same user.
	// Initialize with the replier's user ID to exclude them from notifications.
	seen := map[string]bool{replierUserID: true}

	for _, userID := range ancestorUserIDs {
		if seen[userID] {
			continue
		}
		seen[userID] = true

		if err := s.notificationRepo.Create(ctx, userID, NotificationTypeCommentReply, title, nil, &link); err != nil {
			return err
		}
	}

	return nil
}

// knownPrefixes are stripped from post IDs before slug lookup and URL construction.
// post_<sanity-slug> -> blog post, event_<sanity-slug> -> happening (event or bedpres)
var knownPrefixes = []string{"event_", "post_"}

func stripPostIDPrefix(postID string) string {
	for _, prefix := range knownPrefixes {
		if after, ok := strings.CutPrefix(postID, prefix); ok {
			return after
		}
	}
	return postID
}

// resolvePostLink returns the correct frontend URL for a given post ID.
// If the slug belongs to a happening it returns /arrangementer/{slug} or /bedpres/{slug};
// otherwise it falls back to /for-studenter/innlegg/{slug}.
func (s *NotificationService) resolvePostLink(ctx context.Context, slug string) string {
	slug = stripPostIDPrefix(slug)
	happening, err := s.happeningRepo.GetHappeningBySlug(ctx, slug)
	if err != nil {
		return "/for-studenter/innlegg/" + slug
	}

	if happening.IsBedpres() {
		return "/bedpres/" + slug
	}

	return "/arrangementer/" + slug
}
