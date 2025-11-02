package repo

import (
	"context"
	"uno/domain/model"
)

type User struct {
	ID    string
	Name  *string
	Image *string
}

type CommentWithReactionsAndUser struct {
	Comment   model.Comment            `json:"comment"`
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
