package dto

import (
	"time"
	"uno/domain/model"
)

type CreateCommentRequest struct {
	Content         string  `json:"content" validate:"required"`
	PostID          string  `json:"postId" validate:"required"`
	UserID          string  `json:"userId" validate:"required"`
	ParentCommentID *string `json:"parentCommentId" validate:"required"`
}

type ReactToCommentRequest struct {
	CommentID string `json:"commentId" validate:"required"`
	UserID    string `json:"userId" validate:"required"`
}

// UserSummaryResponse represents minimal user information in API responses
type UserSummaryResponse struct {
	ID       string  `json:"id" validate:"required"`
	Name     *string `json:"name" validate:"required"`
	HasImage bool    `json:"hasImage" validate:"required"`
}

// FromDomain converts domain UserSummary to DTO
func (u *UserSummaryResponse) FromDomain(user *model.UserSummary) *UserSummaryResponse {
	return &UserSummaryResponse{
		ID:       user.ID,
		Name:     user.Name,
		HasImage: user.HasImage,
	}
}

// CommentsReactionResponse represents a comment reaction in API responses
type CommentsReactionResponse struct {
	CommentID string    `json:"commentId" validate:"required"`
	UserID    string    `json:"userId" validate:"required"`
	Type      string    `json:"type" validate:"required"`
	CreatedAt time.Time `json:"createdAt" validate:"required"`
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
	ID              string                     `json:"id" validate:"required"`
	PostID          string                     `json:"postId" validate:"required"`
	ParentCommentID *string                    `json:"parentCommentId" validate:"required"`
	UserID          *string                    `json:"userId" validate:"required"`
	Content         string                     `json:"content" validate:"required"`
	CreatedAt       time.Time                  `json:"createdAt" validate:"required"`
	UpdatedAt       time.Time                  `json:"updatedAt" validate:"required"`
	Reactions       []CommentsReactionResponse `json:"reactions" validate:"required"`
	User            *UserSummaryResponse       `json:"user" validate:"required"`
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
