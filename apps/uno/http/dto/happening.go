package dto

import (
	"encoding/json"
	"time"
	"uno/domain/model"
)

// HappeningResponse represents the happening data returned in API responses.
type HappeningResponse struct {
	ID                      string           `json:"id"`
	Slug                    string           `json:"slug"`
	Title                   string           `json:"title"`
	Type                    string           `json:"type"`
	Date                    *time.Time       `json:"date"`
	RegistrationGroups      *json.RawMessage `json:"registrationGroups"`
	RegistrationStartGroups *time.Time       `json:"registrationStartGroups"`
	RegistrationStart       *time.Time       `json:"registrationStart"`
	RegistrationEnd         *time.Time       `json:"registrationEnd"`
}

// FromDomain converts a domain Happening model to a HappeningResponse DTO.
func (dto *HappeningResponse) FromDomain(h *model.Happening) HappeningResponse {
	return HappeningResponse{
		ID:                      h.ID,
		Slug:                    h.Slug,
		Title:                   h.Title,
		Type:                    h.Type.String(),
		Date:                    h.Date,
		RegistrationGroups:      h.RegistrationGroups,
		RegistrationStartGroups: h.RegistrationStartGroups,
		RegistrationStart:       h.RegistrationStart,
		RegistrationEnd:         h.RegistrationEnd,
	}
}

// HappeningListFromDomain converts a slice of domain Happening models to HappeningResponse DTOs.
func HappeningListFromDomain(happenings []model.Happening) []HappeningResponse {
	dtos := make([]HappeningResponse, len(happenings))
	for i, happening := range happenings {
		dtos[i] = new(HappeningResponse).FromDomain(&happening)
	}
	return dtos
}

// SpotRangeResponse represents the spot range data returned in API responses.
type SpotRangeResponse struct {
	ID          string `json:"id"`
	HappeningID string `json:"happeningId"`
	Spots       int    `json:"spots"`
	MinYear     int    `json:"minYear"`
	MaxYear     int    `json:"maxYear"`
}

// FromDomain converts a domain SpotRange model to a SpotRangeResponse DTO.
func (dto *SpotRangeResponse) FromDomain(sr model.SpotRange) SpotRangeResponse {
	return SpotRangeResponse{
		ID:          sr.ID,
		HappeningID: sr.HappeningID,
		Spots:       sr.Spots,
		MinYear:     sr.MinYear,
		MaxYear:     sr.MaxYear,
	}
}

// SpotRangeListFromDomain converts a slice of domain SpotRange models to SpotRangeResponse DTOs.
func SpotRangeListFromDomain(spotRanges []model.SpotRange) []SpotRangeResponse {
	dtos := make([]SpotRangeResponse, len(spotRanges))
	for i, spotRange := range spotRanges {
		dtos[i] = new(SpotRangeResponse).FromDomain(spotRange)
	}
	return dtos
}

// QuestionResponse represents the question data returned in API responses.
type QuestionResponse struct {
	ID          string           `json:"id"`
	Title       string           `json:"title"`
	Required    bool             `json:"required"`
	Type        string           `json:"type"`
	IsSensitive bool             `json:"isSensitive"`
	Options     *json.RawMessage `json:"options"`
	HappeningID string           `json:"happeningId"`
}

// FromDomain converts a domain Question model to a QuestionResponse DTO.
func (dto *QuestionResponse) FromDomain(q model.Question) QuestionResponse {
	return QuestionResponse{
		ID:          q.ID,
		Title:       q.Title,
		Required:    q.Required,
		Type:        q.Type,
		IsSensitive: q.IsSensitive,
		Options:     q.Options,
		HappeningID: q.HappeningID,
	}
}

// QuestionListFromDomain converts a slice of domain Question models to QuestionResponse DTOs.
func QuestionListFromDomain(questions []model.Question) []QuestionResponse {
	dtos := make([]QuestionResponse, len(questions))
	for i, question := range questions {
		dtos[i] = new(QuestionResponse).FromDomain(question)
	}
	return dtos
}

// RegistrationAnswerResponse represents an answer to a question in API responses.
type RegistrationAnswerResponse struct {
	QuestionID string           `json:"questionId"`
	Answer     *json.RawMessage `json:"answer"`
}

// FullHappeningRegistrationResponse represents a registration with user info and answers.
type FullHappeningRegistrationResponse struct {
	UserID           string                       `json:"userId"`
	HappeningID      string                       `json:"happeningId"`
	Status           string                       `json:"status"`
	UnregisterReason *string                      `json:"unregisterReason"`
	CreatedAt        time.Time                    `json:"createdAt"`
	PrevStatus       *string                      `json:"prevStatus"`
	ChangedAt        *time.Time                   `json:"changedAt"`
	ChangedBy        *string                      `json:"changedBy"`
	UserName         *string                      `json:"userName"`
	UserEmail        *string                      `json:"userEmail"`
	UserYear         *int                         `json:"userYear"`
	UserDegreeID     *string                      `json:"userDegreeId"`
	UserHasImage     bool                         `json:"userHasImage"`
	Answers          []RegistrationAnswerResponse `json:"answers"`
}

// FullHappeningResponse represents a happening with registrations, questions, and host groups.
type FullHappeningResponse struct {
	ID                      string                              `json:"id"`
	Slug                    string                              `json:"slug"`
	Title                   string                              `json:"title"`
	Type                    string                              `json:"type"`
	Date                    *time.Time                          `json:"date"`
	RegistrationGroups      *json.RawMessage                    `json:"registrationGroups"`
	RegistrationStartGroups *time.Time                          `json:"registrationStartGroups"`
	RegistrationStart       *time.Time                          `json:"registrationStart"`
	RegistrationEnd         *time.Time                          `json:"registrationEnd"`
	Registrations           []FullHappeningRegistrationResponse `json:"registrations"`
	Questions               []QuestionResponse                  `json:"questions"`
	Groups                  []string                            `json:"groups"`
}

// FullRegistrationRowResponse represents a registration row with expanded user and answer details.
type FullRegistrationRowResponse struct {
	UserID           string                                   `json:"userId"`
	HappeningID      string                                   `json:"happeningId"`
	Status           string                                   `json:"status"`
	UnregisterReason *string                                  `json:"unregisterReason"`
	CreatedAt        time.Time                                `json:"createdAt"`
	PrevStatus       *string                                  `json:"prevStatus"`
	ChangedAt        *time.Time                               `json:"changedAt"`
	ChangedBy        *string                                  `json:"changedBy"`
	ChangedByUser    *UserResponse                            `json:"changedByUser"`
	User             UserResponse                             `json:"user"`
	Answers          []RegistrationAnswerWithQuestionResponse `json:"answers"`
}

type RegistrationAnswerWithQuestionResponse struct {
	QuestionID string                     `json:"questionId"`
	Answer     RegistrationAnswerResponse `json:"answer"`
	Question   QuestionResponse           `json:"question"`
}

// DeregisterRequest represents the request body for deregistering from a happening.
type DeregisterRequest struct {
	UserID string `json:"userId"`
	Reason string `json:"reason"`
}

// UpdateRegistrationStatusRequest represents the request body for updating registration status.
type UpdateRegistrationStatusRequest struct {
	Status    string `json:"status"`
	Reason    string `json:"reason"`
	ChangedBy string `json:"changedBy"`
}

// FullRegistrationRowsFromDomain converts full happening domain data to expanded registration rows.
func FullRegistrationRowsFromDomain(h model.FullHappening, usersByID map[string]model.User) []FullRegistrationRowResponse {
	questionByID := make(map[string]model.Question, len(h.Questions))
	for _, q := range h.Questions {
		questionByID[q.ID] = q
	}

	rows := make([]FullRegistrationRowResponse, 0, len(h.Registrations))
	for _, reg := range h.Registrations {
		row := FullRegistrationRowResponse{
			UserID:           reg.UserID,
			HappeningID:      reg.HappeningID,
			Status:           string(reg.Status),
			UnregisterReason: reg.UnregisterReason,
			CreatedAt:        reg.CreatedAt,
			PrevStatus:       reg.PrevStatus,
			ChangedAt:        reg.ChangedAt,
			ChangedBy:        reg.ChangedBy,
			Answers:          []RegistrationAnswerWithQuestionResponse{},
		}

		if user, ok := usersByID[reg.UserID]; ok {
			userResponses := UsersToUserResponses([]model.User{user})
			if len(userResponses) > 0 {
				row.User = userResponses[0]
			}
		}

		if reg.ChangedBy != nil {
			if changedByUser, ok := usersByID[*reg.ChangedBy]; ok {
				changedByResponses := UsersToUserResponses([]model.User{changedByUser})
				if len(changedByResponses) > 0 {
					row.ChangedByUser = &changedByResponses[0]
				}
			}
		}

		for _, a := range reg.Answers {
			q, ok := questionByID[a.QuestionID]
			if !ok {
				continue
			}

			answer := RegistrationAnswerResponse{
				QuestionID: a.QuestionID,
				Answer:     a.Answer,
			}

			row.Answers = append(row.Answers, RegistrationAnswerWithQuestionResponse{
				QuestionID: a.QuestionID,
				Answer:     answer,
				Question:   new(QuestionResponse).FromDomain(q),
			})
		}

		rows = append(rows, row)
	}

	return rows
}

// FullHappeningFromDomain converts a domain FullHappening model to a FullHappeningResponse DTO.
func FullHappeningFromDomain(h model.FullHappening) FullHappeningResponse {
	regs := make([]FullHappeningRegistrationResponse, len(h.Registrations))
	for i, reg := range h.Registrations {
		answers := make([]RegistrationAnswerResponse, len(reg.Answers))
		for j, a := range reg.Answers {
			answers[j] = RegistrationAnswerResponse{
				QuestionID: a.QuestionID,
				Answer:     a.Answer,
			}
		}
		regs[i] = FullHappeningRegistrationResponse{
			UserID:           reg.UserID,
			HappeningID:      reg.HappeningID,
			Status:           string(reg.Status),
			UnregisterReason: reg.UnregisterReason,
			CreatedAt:        reg.CreatedAt,
			PrevStatus:       reg.PrevStatus,
			ChangedAt:        reg.ChangedAt,
			ChangedBy:        reg.ChangedBy,
			UserName:         reg.UserName,
			UserEmail:        reg.UserEmail,
			UserYear:         reg.UserYear,
			UserDegreeID:     reg.UserDegreeID,
			UserHasImage:     reg.UserHasImage,
			Answers:          answers,
		}
	}
	return FullHappeningResponse{
		ID:                      h.ID,
		Slug:                    h.Slug,
		Title:                   h.Title,
		Type:                    h.Type.String(),
		Date:                    h.Date,
		RegistrationGroups:      h.RegistrationGroups,
		RegistrationStartGroups: h.RegistrationStartGroups,
		RegistrationStart:       h.RegistrationStart,
		RegistrationEnd:         h.RegistrationEnd,
		Registrations:           regs,
		Questions:               QuestionListFromDomain(h.Questions),
		Groups:                  h.Groups,
	}
}
