package dto

import (
	"time"
	"uno/domain/model"
)

type CreateCommentRequest struct {
	Content         string  `json:"content"`
	PostID          string  `json:"postId"`
	UserID          string  `json:"userId"`
	ParentCommentID *string `json:"parentCommentId"`
}

type ReactToCommentRequest struct {
	CommentID string `json:"commentId"`
	UserID    string `json:"userId"`
}

// UserSummaryResponse represents minimal user information in API responses
type UserSummaryResponse struct {
	ID    string  `json:"id"`
	Name  *string `json:"name"`
	Image *string `json:"image"`
}

// FromDomain converts domain UserSummary to DTO
func (u *UserSummaryResponse) FromDomain(user *model.UserSummary) *UserSummaryResponse {
	return &UserSummaryResponse{
		ID:    user.ID,
		Name:  user.Name,
		Image: user.Image,
	}
}

// CommentsReactionResponse represents a comment reaction in API responses
type CommentsReactionResponse struct {
	CommentID string    `json:"commentId"`
	UserID    string    `json:"userId"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"createdAt"`
}

// FromDomain converts domain CommentsReaction to DTO
func (r *CommentsReactionResponse) FromDomain(reaction *model.CommentsReaction) *CommentsReactionResponse {
	return &CommentsReactionResponse{
		CommentID: reaction.CommentID,
		UserID:    reaction.UserID,
		Type:      reaction.Type,
		CreatedAt: reaction.CreatedAt,
	}
}

// CommentResponse represents a comment in API responses
type CommentResponse struct {
	ID              string                     `json:"id"`
	PostID          string                     `json:"postId"`
	ParentCommentID *string                    `json:"parentCommentId"`
	UserID          *string                    `json:"userId"`
	Content         string                     `json:"content"`
	CreatedAt       time.Time                  `json:"createdAt"`
	UpdatedAt       time.Time                  `json:"updatedAt"`
	Reactions       []CommentsReactionResponse `json:"reactions"`
	User            *UserSummaryResponse       `json:"user"`
}

// FromDomain converts domain CommentAggregate to DTO
func (c *CommentResponse) FromDomain(aggregate *model.CommentAggregate) *CommentResponse {
	reactions := make([]CommentsReactionResponse, len(aggregate.Reactions))
	for i, r := range aggregate.Reactions {
		reactions[i] = *new(CommentsReactionResponse).FromDomain(&r)
	}

	var user *UserSummaryResponse
	if aggregate.User != nil {
		user = new(UserSummaryResponse).FromDomain(aggregate.User)
	}

	return &CommentResponse{
		ID:              aggregate.ID,
		PostID:          aggregate.PostID,
		ParentCommentID: aggregate.ParentCommentID,
		UserID:          aggregate.UserID,
		Content:         aggregate.Content,
		CreatedAt:       aggregate.CreatedAt,
		UpdatedAt:       aggregate.UpdatedAt,
		Reactions:       reactions,
		User:            user,
	}
}

// CommentsFromDomainList converts a slice of domain CommentAggregates to DTOs
func CommentsFromDomainList(aggregates []model.CommentAggregate) []CommentResponse {
	dtos := make([]CommentResponse, len(aggregates))
	for i, aggregate := range aggregates {
		dtos[i] = *new(CommentResponse).FromDomain(&aggregate)
	}
	return dtos
}
