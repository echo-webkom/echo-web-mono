package repo

import (
	"context"
	"uno/domain/model"
)

type User struct {
	ID    string  `json:"id"`
	Name  *string `json:"name"`
	Image *string `json:"image"`
}

type CommentWithReactionsAndUser struct {
	model.Comment
	Reactions []model.CommentsReaction `json:"reactions"`
	User      *User                    `json:"user"`
}

type CommentRepo interface {
	GetCommentsByID(ctx context.Context, id string) ([]CommentWithReactionsAndUser, error)
	CreateComment(ctx context.Context, content string, postID string, userID string, parentCommentID *string) error
	AddReactionToComment(ctx context.Context, commentID string, userID string) error
	DeleteReactionFromComment(ctx context.Context, commentID string, userID string) error
	IsReactedByUser(ctx context.Context, commentID string, userID string) (bool, error)
}
