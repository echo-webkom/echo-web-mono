package dto

import (
	"uno/domain/model"
)

type ToggleReactionRequest struct {
	EmojiID int    `json:"emojiId" validate:"required"`
	UserID  string `json:"userId" validate:"required"`
}

type ReactionResponse struct {
	CreatedAt  string `json:"createdAt"`
	UserID     string `json:"userId"`
	ReactToKey string `json:"reactToKey"`
	EmojiID    int    `json:"emojiId"`
}

func ReactionResponsesFromDomain(reactions []model.Reaction) []ReactionResponse {
	dtos := make([]ReactionResponse, len(reactions))
	for i, reaction := range reactions {
		dtos[i] = ReactionResponse{
			CreatedAt:  FormatISO8601(reaction.CreatedAt),
			UserID:     reaction.UserID,
			ReactToKey: reaction.ReactToKey,
			EmojiID:    reaction.EmojiID,
		}
	}
	return dtos
}
