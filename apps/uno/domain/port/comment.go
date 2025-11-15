package port

import (
	"context"
	"uno/domain/model"
)

// CommentRepo defines the interface for comment persistence operations.
// This is a port in the hexagonal architecture pattern.
type CommentRepo interface {
	GetCommentsByID(ctx context.Context, id string) ([]model.CommentAggregate, error)
	CreateComment(ctx context.Context, content string, postID string, userID string, parentCommentID *string) error
	AddReactionToComment(ctx context.Context, commentID string, userID string) error
	DeleteReactionFromComment(ctx context.Context, commentID string, userID string) error
	IsReactedByUser(ctx context.Context, commentID string, userID string) (bool, error)
}
