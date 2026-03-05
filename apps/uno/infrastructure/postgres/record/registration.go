package record

import (
	"time"

	"uno/domain/model"
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

// UserRegistrationDB represents the database schema for a registration joined with its happening.
type UserRegistrationDB struct {
	RegistrationDB
	HappeningSlug  string              `db:"happening_slug"`
	HappeningTitle string              `db:"happening_title"`
	HappeningType  model.HappeningType `db:"happening_type"`
	HappeningDate  *time.Time          `db:"happening_date"`
}

func (db *UserRegistrationDB) ToDomain() model.RegistrationWithHappening {
	return model.RegistrationWithHappening{
		Registration: *db.RegistrationDB.ToDomain(),
		Happening: model.Happening{
			ID:    db.HappeningID,
			Slug:  db.HappeningSlug,
			Title: db.HappeningTitle,
			Type:  db.HappeningType,
			Date:  db.HappeningDate,
		},
	}
}

func UserRegistrationToDomainList(dbRegs []UserRegistrationDB) []model.RegistrationWithHappening {
	regs := make([]model.RegistrationWithHappening, len(dbRegs))
	for i, dbReg := range dbRegs {
		regs[i] = dbReg.ToDomain()
	}
	return regs
}

// HappeningRegistrationDB represents the database schema for registration with user info.
type HappeningRegistrationDB struct {
	RegistrationDB
	UserName  *string `db:"user_name"`
	UserImage *string `db:"user_image"`
}

func (db *HappeningRegistrationDB) UserHasImage() bool {
	return db.UserImage != nil
}

// ToPorts converts a HappeningRegistrationDB to a port.HappeningRegistration.
func (db *HappeningRegistrationDB) ToPorts() *model.HappeningRegistration {
	return &model.HappeningRegistration{
		UserID:           db.UserID,
		HappeningID:      db.HappeningID,
		Status:           model.RegistrationStatus(db.Status),
		UnregisterReason: db.UnregisterReason,
		CreatedAt:        db.CreatedAt,
		PrevStatus:       db.PrevStatus,
		ChangedAt:        db.ChangedAt,
		ChangedBy:        db.ChangedBy,
		UserName:         db.UserName,
		UserHasImage:     db.UserHasImage(),
	}
}

// HappeningRegistrationToPortsList converts a slice of HappeningRegistrationDB to port.HappeningRegistration.
func HappeningRegistrationToPortsList(dbRegs []HappeningRegistrationDB) []model.HappeningRegistration {
	regs := make([]model.HappeningRegistration, len(dbRegs))
	for i, dbReg := range dbRegs {
		regs[i] = *dbReg.ToPorts()
	}
	return regs
}
