package models

import (
	"time"

	"uno/domain/model"
	"uno/domain/port"
)

// RegistrationDB represents the database schema for the registration table.
// It contains database-specific tags and structure.
type RegistrationDB struct {
	UserID           string     `db:"user_id"`
	HappeningID      string     `db:"happening_id"`
	Status           string     `db:"status"`
	UnregisterReason *string    `db:"unregister_reason"`
	CreatedAt        time.Time  `db:"created_at"`
	PrevStatus       *string    `db:"prev_status"`
	ChangedAt        *time.Time `db:"changed_at"`
	ChangedBy        *string    `db:"changed_by"`
}

// FromDomain converts a domain Registration model to a database RegistrationDB model.
func (db *RegistrationDB) FromDomain(r *model.Registration) *RegistrationDB {
	return &RegistrationDB{
		UserID:           r.UserID,
		HappeningID:      r.HappeningID,
		Status:           string(r.Status),
		UnregisterReason: r.UnregisterReason,
		CreatedAt:        r.CreatedAt,
		PrevStatus:       r.PrevStatus,
		ChangedAt:        r.ChangedAt,
		ChangedBy:        r.ChangedBy,
	}
}

// ToDomain converts a database RegistrationDB model to a domain Registration model.
func (db *RegistrationDB) ToDomain() *model.Registration {
	return &model.Registration{
		UserID:           db.UserID,
		HappeningID:      db.HappeningID,
		Status:           model.RegistrationStatus(db.Status),
		UnregisterReason: db.UnregisterReason,
		CreatedAt:        db.CreatedAt,
		PrevStatus:       db.PrevStatus,
		ChangedAt:        db.ChangedAt,
		ChangedBy:        db.ChangedBy,
	}
}

// RegistrationToDomainList converts a slice of database RegistrationDB models to domain Registration models.
func RegistrationToDomainList(dbRegistrations []RegistrationDB) []model.Registration {
	registrations := make([]model.Registration, len(dbRegistrations))
	for i, dbReg := range dbRegistrations {
		registrations[i] = *dbReg.ToDomain()
	}
	return registrations
}

// HappeningRegistrationDB represents the database schema for registration with user info.
type HappeningRegistrationDB struct {
	RegistrationDB
	UserName  *string `db:"user_name"`
	UserImage *string `db:"user_image"`
}

// ToPorts converts a HappeningRegistrationDB to a port.HappeningRegistration.
func (db *HappeningRegistrationDB) ToPorts() *port.HappeningRegistration {
	return &port.HappeningRegistration{
		UserID:           db.UserID,
		HappeningID:      db.HappeningID,
		Status:           model.RegistrationStatus(db.Status),
		UnregisterReason: db.UnregisterReason,
		CreatedAt:        db.CreatedAt,
		PrevStatus:       db.PrevStatus,
		ChangedAt:        db.ChangedAt,
		ChangedBy:        db.ChangedBy,
		UserName:         db.UserName,
		UserImage:        db.UserImage,
	}
}

// HappeningRegistrationToPortsList converts a slice of HappeningRegistrationDB to port.HappeningRegistration.
func HappeningRegistrationToPortsList(dbRegs []HappeningRegistrationDB) []port.HappeningRegistration {
	regs := make([]port.HappeningRegistration, len(dbRegs))
	for i, dbReg := range dbRegs {
		regs[i] = *dbReg.ToPorts()
	}
	return regs
}
