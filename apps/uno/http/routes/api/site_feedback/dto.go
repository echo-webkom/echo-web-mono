package sitefeedback

import (
	"errors"
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
func NewSiteFeedbackResponseFromDomain(feedback *model.SiteFeedback) *SiteFeedbackResponse {
	return &SiteFeedbackResponse{
		ID:        feedback.ID,
		Name:      feedback.Name,
		Email:     feedback.Email.StringPtr(),
		Message:   feedback.Message,
		Category:  feedback.Category.String(),
		IsRead:    feedback.IsRead,
		CreatedAt: feedback.CreatedAt,
	}
}

// SiteFeedbacksFromDomainList converts a slice of domain models to DTOs
func SiteFeedbacksFromDomainList(feedbacks []model.SiteFeedback) []SiteFeedbackResponse {
	dtos := make([]SiteFeedbackResponse, len(feedbacks))
	for i, feedback := range feedbacks {
		dtos[i] = *NewSiteFeedbackResponseFromDomain(&feedback)
	}
	return dtos
}

type CreateSiteFeedbackRequest struct {
	Name     *string `json:"name" validate:"omitempty"`
	Email    *string `json:"email" validate:"omitempty,email"`
	Message  string  `json:"message" validate:"required"`
	Category string  `json:"category" validate:"required"`
}

func (r *CreateSiteFeedbackRequest) Valid() error {
	if r.Message == "" {
		return errors.New("message is required")
	}
	if r.Category == "" {
		return errors.New("category is required")
	}
	return nil
}

func (r *CreateSiteFeedbackRequest) ToNewSiteFeedback() (model.NewSiteFeedback, error) {
	var email *model.Email
	if r.Email != nil {
		e, err := model.NewEmail(*r.Email)
		if err != nil {
			return model.NewSiteFeedback{}, err
		}
		email = &e
	}

	category, err := model.NewSiteFeedbackCategory(r.Category)
	if err != nil {
		return model.NewSiteFeedback{}, err
	}

	return model.NewSiteFeedback{
		Name:     r.Name,
		Email:    email,
		Message:  r.Message,
		Category: category,
	}, nil
}
