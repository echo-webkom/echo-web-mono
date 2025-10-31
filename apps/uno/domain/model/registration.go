package model

import (
	"time"
)

type RegistrationStatus string

const (
	RegistrationStatusRegistered   RegistrationStatus = "registered"
	RegistrationStatusWaitlisted   RegistrationStatus = "waiting"
	RegistrationStatusUnregistered RegistrationStatus = "unregistered"
	RegistrationStatusPending      RegistrationStatus = "pending"
	RegistrationStatusRemoved      RegistrationStatus = "removed"
)

type Registration struct {
	UserID           string             `db:"user_id"`
	HappeningID      string             `db:"happening_id"`
	Status           RegistrationStatus `db:"status"`
	UnregisterReason *string            `db:"unregister_reason"`
	CreatedAt        time.Time          `db:"created_at"`
	PrevStatus       *string            `db:"prev_status"`
	ChangedAt        *time.Time         `db:"changed_at"`
	ChangedBy        *string            `db:"changed_by"`
}
