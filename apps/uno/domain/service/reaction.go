package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type ReactionService struct {
	reactionRepo port.ReactionRepo
}

func NewReactionService(reactionRepo port.ReactionRepo) *ReactionService {
	return &ReactionService{
		reactionRepo: reactionRepo,
	}
}

// ToggleReaction toggles a reaction for a given reactToKey, emojiID, and userID.
func (s *ReactionService) ToggleReaction(ctx context.Context, reaction model.NewReaction) error {
	// Check if the reaction already exists for the given reactToKey, emojiID, and userID
	existingReactions, err := s.reactionRepo.GetReactionsByIDAndUserID(ctx, reaction.ReactToKey, reaction.UserID)
	if err != nil {
		return err
	}

	// If reaction already exists for this emoji, remove it
	alreadyReacted := false
	for _, r := range existingReactions {
		if r.EmojiID == reaction.EmojiID {
			alreadyReacted = true
			break
		}
	}

	if alreadyReacted {
		return s.reactionRepo.RemoveReaction(ctx, reaction.ReactToKey, reaction.EmojiID, reaction.UserID)
	}

	// Otherwise, add the new reaction
	return s.reactionRepo.AddReaction(ctx, model.Reaction{
		ReactToKey: reaction.ReactToKey,
		EmojiID:    reaction.EmojiID,
		UserID:     reaction.UserID,
	})
}

func (s *ReactionService) ReactionRepo() port.ReactionRepo {
	return s.reactionRepo
}
