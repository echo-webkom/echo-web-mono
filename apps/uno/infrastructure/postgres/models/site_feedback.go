package models

import (
	"time"
	"uno/domain/model"
)

// SiteFeedbackDB represents the database schema for site_feedback table
type SiteFeedbackDB struct {
	ID        string    `db:"id"`
	Name      *string   `db:"name"`
	Email     *string   `db:"email"`
	Message   string    `db:"message"`
	Category  string    `db:"category"`
	IsRead    bool      `db:"is_read"`
	CreatedAt time.Time `db:"created_at"`
}

// ToDomain converts database model to domain model
func (db *SiteFeedbackDB) ToDomain() *model.SiteFeedback {
	return &model.SiteFeedback{
		ID:        db.ID,
		Name:      db.Name,
		Email:     db.Email,
		Message:   db.Message,
		Category:  db.Category,
		IsRead:    db.IsRead,
		CreatedAt: db.CreatedAt,
	}
}
