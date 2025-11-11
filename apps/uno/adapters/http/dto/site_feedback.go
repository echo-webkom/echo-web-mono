package dto

import (
	"time"
	"uno/domain/model"
)

type SiteFeedbackResponse struct {
	ID        string    `json:"id"`
	Name      *string   `json:"name"`
	Email     *string   `json:"email"`
	Message   string    `json:"message"`
	Category  string    `json:"category"`
	IsRead    bool      `json:"isRead"`
	CreatedAt time.Time `json:"createdAt"`
}

// FromDomain converts domain model to SiteFeedbackResponse DTO
func (r *SiteFeedbackResponse) FromDomain(feedback *model.SiteFeedback) *SiteFeedbackResponse {
	return &SiteFeedbackResponse{
		ID:        feedback.ID,
		Name:      feedback.Name,
		Email:     feedback.Email,
		Message:   feedback.Message,
		Category:  feedback.Category,
		IsRead:    feedback.IsRead,
		CreatedAt: feedback.CreatedAt,
	}
}

// SiteFeedbacksFromDomainList converts a slice of domain models to DTOs
func SiteFeedbacksFromDomainList(feedbacks []model.SiteFeedback) []SiteFeedbackResponse {
	dtos := make([]SiteFeedbackResponse, len(feedbacks))
	for i, feedback := range feedbacks {
		dtos[i] = *new(SiteFeedbackResponse).FromDomain(&feedback)
	}
	return dtos
}
