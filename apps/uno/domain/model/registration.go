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
	UserID           string             `db:"user_id" json:"userId"`
	HappeningID      string             `db:"happening_id" json:"happeningId"`
	Status           RegistrationStatus `db:"status" json:"status"`
	UnregisterReason *string            `db:"unregister_reason" json:"unregisterReason"`
	CreatedAt        time.Time          `db:"created_at" json:"createdAt"`
	PrevStatus       *string            `db:"prev_status" json:"prevStatus"`
	ChangedAt        *time.Time         `db:"changed_at" json:"changedAt"`
	ChangedBy        *string            `db:"changed_by" json:"changedBy"`
}
