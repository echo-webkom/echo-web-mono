package port

import (
	"context"
	"uno/domain/model"
)

type ReactionRepo interface {
	GetReactionsByID(ctx context.Context, reactToKey string) ([]model.Reaction, error)
	GetReactionsByIDAndUserID(ctx context.Context, reactToKey string, userID string) ([]model.Reaction, error)
	AddReaction(ctx context.Context, reaction model.Reaction) error
	RemoveReaction(ctx context.Context, reactToKey string, emojiID int, userID string) error
}
