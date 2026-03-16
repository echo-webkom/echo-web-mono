package port

import (
	"context"
	"uno/domain/model"
)

type QuoteRepo interface {
	GetQuotes(ctx context.Context) ([]model.Quote, error)
	CreateQuote(ctx context.Context, quote model.Quote, submittedBy string) error
	DeleteQuote(ctx context.Context, quoteID string) error
}
