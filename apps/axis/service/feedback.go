package service

import (
	"database/sql"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type FeedbackService struct {
	db *sql.DB
}

func NewFeedbackService(db *sql.DB) *FeedbackService {
	return &FeedbackService{db: db}
}

type NewFeedbackRequest struct {
	Email   *string `json:"email,omitempty"`
	Name    *string `json:"name,omitempty"`
	Message string  `json:"message"`
}

func (fs *FeedbackService) SubmitFeedback(feedback NewFeedbackRequest) error {
	id, err := gonanoid.New()
	if err != nil {
		return err
	}

	_, err = fs.db.Exec(`
INSERT INTO site_feedback (id, email, name, message)
VALUES ($1, $2, $3, $4)`, id, feedback.Email, feedback.Name, feedback.Message)

	return err
}
