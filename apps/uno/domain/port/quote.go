package port

import (
	"context"
	"uno/domain/model"
)

type QuoteRepo interface {
	GetQuotes(ctx context.Context) ([]model.Quote, error)
	GetQuoteByID(ctx context.Context, quoteID string) (*model.Quote, error)
	CreateQuote(ctx context.Context, quote model.Quote, submittedBy string) error
	DeleteQuote(ctx context.Context, quoteID string) error
	GetReactions(ctx context.Context, quoteID string) ([]model.QuoteReaction, error)
	AddReaction(ctx context.Context, quoteID string, userID string, reactionType model.QuoteReactionType) error
	RemoveReaction(ctx context.Context, quoteID string, userID string) error
}
