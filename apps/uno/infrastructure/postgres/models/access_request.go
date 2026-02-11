package models

import (
	"time"

	"uno/domain/model"
)

// AccessRequestDB represents the database schema for access_request table
type AccessRequestDB struct {
	ID        string    `db:"id"`
	Email     string    `db:"email"`
	Reason    string    `db:"reason"`
	CreatedAt time.Time `db:"created_at"`
}

// FromDomain converts domain model to database model
func (db *AccessRequestDB) FromDomain(ar *model.AccessRequest) *AccessRequestDB {
	return &AccessRequestDB{
		ID:        ar.ID,
		Email:     ar.Email,
		Reason:    ar.Reason,
		CreatedAt: ar.CreatedAt,
	}
}

// ToDomain converts database model to domain model
func (db *AccessRequestDB) ToDomain() *model.AccessRequest {
	return &model.AccessRequest{
		ID:        db.ID,
		Email:     db.Email,
		Reason:    db.Reason,
		CreatedAt: db.CreatedAt,
	}
}

// ToDomainList converts a slice of database models to domain models
func ToDomainList(dbModels []AccessRequestDB) []model.AccessRequest {
	result := make([]model.AccessRequest, len(dbModels))
	for i, dbModel := range dbModels {
		result[i] = *dbModel.ToDomain()
	}
	return result
}
