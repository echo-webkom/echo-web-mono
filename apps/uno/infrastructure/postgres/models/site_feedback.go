package models

import (
	"time"
	"uno/domain/model"
)

// SiteFeedback represents the database schema for site_feedback table
type SiteFeedback struct {
	ID        string    `db:"id"`
	Name      *string   `db:"name"`
	Email     *string   `db:"email"`
	Message   string    `db:"message"`
	Category  string    `db:"category"`
	IsRead    bool      `db:"is_read"`
	CreatedAt time.Time `db:"created_at"`
}

// ToDomain converts database model to domain model
func (db *SiteFeedback) ToDomain() *model.SiteFeedback {
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

func SiteFeedbacksToDomainList(dbModels []SiteFeedback) []model.SiteFeedback {
	domainModels := make([]model.SiteFeedback, len(dbModels))
	for i, dbModel := range dbModels {
		domainModels[i] = *dbModel.ToDomain()
	}
	return domainModels
}
