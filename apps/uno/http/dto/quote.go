package dto

import (
	"time"
	"uno/domain/model"

	"github.com/google/uuid"
)

type QuoteReactionResponse struct {
	UserID       string `json:"user_id"`
	ReactionType string `json:"reaction_type"`
}

type QuoteResponse struct {
	ID          string                  `json:"id"`
	Text        string                  `json:"text"`
	Context     *string                 `json:"context"`
	Person      string                  `json:"person"`
	SubmittedAt string                  `json:"submitted_at"`
	Reactions   []QuoteReactionResponse `json:"reactions"`
}

func QuoteFromDomain(quote model.Quote) QuoteResponse {
	reactions := make([]QuoteReactionResponse, len(quote.Reactions))
	for i, r := range quote.Reactions {
		reactions[i] = QuoteReactionResponse{
			UserID:       r.UserID,
			ReactionType: string(r.ReactionType),
		}
	}

	return QuoteResponse{
		ID:          quote.ID,
		Text:        quote.Text,
		Context:     quote.Context,
		Person:      quote.Person,
		SubmittedAt: quote.SubmittedAt,
		Reactions:   reactions,
	}
}

func QuotesResponseFromDomainList(quotes []model.Quote) []QuoteResponse {
	quoteDTOs := make([]QuoteResponse, len(quotes))
	for i, quote := range quotes {
		quoteDTOs[i] = QuoteFromDomain(quote)
	}
	return quoteDTOs
}

type QuoteRequest struct {
	Text    string  `json:"text" validate:"required"`
	Context *string `json:"context,omitempty"`
	Person  string  `json:"person" validate:"required"`
}

func (r QuoteRequest) ToDomain() model.Quote {
	return model.Quote{
		ID:          uuid.New().String(),
		SubmittedAt: time.Now().Format(time.RFC3339),
		Text:        r.Text,
		Context:     r.Context,
		Person:      r.Person,
	}
}
