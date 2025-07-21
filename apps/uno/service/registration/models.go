package registration

import (
	"errors"
)

type RegistrationCount struct {
	Registered int `json:"registered"`
	Waitlisted int `json:"waitlisted"`
}

var (
	ErrUserIDRequired         = errors.New("userId is required")
	ErrHappeningIDRequired    = errors.New("happeningId is required")
	ErrQuestionsRequired      = errors.New("questions are required")
	ErrQuestionIDRequired     = errors.New("questionId is required")
	ErrHappeningNotFound      = errors.New("happening not found")
	ErrUserNotFound           = errors.New("user not found")
	ErrUserBanned             = errors.New("user is banned")
	ErrUserIneligible         = errors.New("user is ineligible for this event")
	ErrUserRemoved            = errors.New("user has been removed from the event")
	ErrUserIncomplete         = errors.New("user profile is incomplete")
	ErrUserAlreadyRegistered  = errors.New("user is already registered")
	ErrUserAlreadyWaitlisted  = errors.New("user is already waitlisted")
	ErrRegistrationNotStarted = errors.New("registration has not started yet")
	ErrRegistrationClosed     = errors.New("registration is closed")
	ErrQuestionNotAnswered    = errors.New("question has not been answered")
	ErrInternalError          = errors.New("internal server error")
)

type Answer struct {
	QuestionID string `json:"questionId"`
	Answer     any    `json:"answer"` // string or []string
}

type RequestBody struct {
	UserID      string   `json:"userId"`
	HappeningID string   `json:"happeningId"`
	Questions   []Answer `json:"questions"`
}

func (r RequestBody) Validate() error {
	if r.UserID == "" {
		return ErrUserIDRequired
	}
	if r.HappeningID == "" {
		return ErrHappeningIDRequired
	}
	for _, question := range r.Questions {
		if question.QuestionID == "" {
			return ErrQuestionIDRequired
		}
	}
	return nil
}
