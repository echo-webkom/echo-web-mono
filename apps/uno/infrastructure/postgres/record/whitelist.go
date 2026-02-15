package record

import (
	"time"

	"uno/domain/model"
)

// WhitelistDB represents the database schema for whitelist table
type WhitelistDB struct {
	Email     string    `db:"email"`
	ExpiresAt time.Time `db:"expires_at"`
	Reason    string    `db:"reason"`
}

// FromDomain converts domain model to database model
func (db *WhitelistDB) FromDomain(wl *model.Whitelist) *WhitelistDB {
	return &WhitelistDB{
		Email:     wl.Email,
		ExpiresAt: wl.ExpiresAt,
		Reason:    wl.Reason,
	}
}

// ToDomain converts database model to domain model
func (db *WhitelistDB) ToDomain() *model.Whitelist {
	return &model.Whitelist{
		Email:     db.Email,
		ExpiresAt: db.ExpiresAt,
		Reason:    db.Reason,
	}
}

// ToWhitelistDomainList converts a slice of database models to domain models
func ToWhitelistDomainList(dbModels []WhitelistDB) []model.Whitelist {
	result := make([]model.Whitelist, len(dbModels))
	for i, dbModel := range dbModels {
		result[i] = *dbModel.ToDomain()
	}
	return result
}
