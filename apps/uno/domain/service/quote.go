package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type QuoteService struct {
	quoteRepo port.QuoteRepo
}

func NewQuoteService(quoteRepo port.QuoteRepo) *QuoteService {
	return &QuoteService{
		quoteRepo: quoteRepo,
	}
}

func (s *QuoteService) Repo() port.QuoteRepo {
	return s.quoteRepo
}

func (s *QuoteService) ToggleReaction(
	ctx context.Context,
	quoteID string,
	userID string,
	reactionType model.QuoteReactionType,
) error {
	reactions, err := s.quoteRepo.GetReactions(ctx, quoteID)
	if err != nil {
		return err
	}

	for _, r := range reactions {
		if r.UserID == userID {
			if r.ReactionType == reactionType {
				return s.quoteRepo.RemoveReaction(ctx, quoteID, userID)
			}
			return s.quoteRepo.AddReaction(ctx, quoteID, userID, reactionType)
		}
	}

	return s.quoteRepo.AddReaction(ctx, quoteID, userID, reactionType)
}
