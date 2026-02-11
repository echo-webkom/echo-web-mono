package model

import (
	"time"
)

// RegistrationStatus represents the current state of a user's registration
// for a happening.
type RegistrationStatus string

const (
	RegistrationStatusRegistered   RegistrationStatus = "registered"
	RegistrationStatusWaitlisted   RegistrationStatus = "waiting"
	RegistrationStatusUnregistered RegistrationStatus = "unregistered"
	RegistrationStatusPending      RegistrationStatus = "pending"
	RegistrationStatusRemoved      RegistrationStatus = "removed"
)

// Registration represents a user's registration for a happening.
// This is a domain model focused on business logic and rules.
type Registration struct {
	UserID           string
	HappeningID      string
	Status           RegistrationStatus
	UnregisterReason *string
	CreatedAt        time.Time
	PrevStatus       *string
	ChangedAt        *time.Time
	ChangedBy        *string
}

// IsActive checks if the registration is in an active state
// (either registered or waitlisted).
func (r *Registration) IsActive() bool {
	return r.Status == RegistrationStatusRegistered || r.Status == RegistrationStatusWaitlisted
}

// IsRegistered checks if the user is successfully registered
// (not waitlisted).
func (r *Registration) IsRegistered() bool {
	return r.Status == RegistrationStatusRegistered
}

// IsWaitlisted checks if the user is on the waitlist.
func (r *Registration) IsWaitlisted() bool {
	return r.Status == RegistrationStatusWaitlisted
}

// IsUnregistered checks if the user has unregistered.
func (r *Registration) IsUnregistered() bool {
	return r.Status == RegistrationStatusUnregistered
}

// IsRemoved checks if the registration has been removed.
func (r *Registration) IsRemoved() bool {
	return r.Status == RegistrationStatusRemoved
}

// IsPending checks if the registration is pending approval.
func (r *Registration) IsPending() bool {
	return r.Status == RegistrationStatusPending
}

// CanUnregister checks if the user can unregister from the happening.
func (r *Registration) CanUnregister() bool {
	return r.IsActive() || r.IsPending()
}

// Unregister marks the registration as unregistered with a reason.
func (r *Registration) Unregister(reason string, changedBy string, now time.Time) {
	r.PrevStatus = stringPtr(string(r.Status))
	r.Status = RegistrationStatusUnregistered
	r.UnregisterReason = &reason
	r.ChangedAt = &now
	r.ChangedBy = &changedBy
}

// Remove marks the registration as removed by an admin.
func (r *Registration) Remove(changedBy string, now time.Time) {
	r.PrevStatus = stringPtr(string(r.Status))
	r.Status = RegistrationStatusRemoved
	r.ChangedAt = &now
	r.ChangedBy = &changedBy
}

// ChangeStatus updates the registration status with audit information.
func (r *Registration) ChangeStatus(newStatus RegistrationStatus, changedBy string, now time.Time) {
	r.PrevStatus = stringPtr(string(r.Status))
	r.Status = newStatus
	r.ChangedAt = &now
	r.ChangedBy = &changedBy
}

// HasStatusChanged checks if the status has been changed since creation.
func (r *Registration) HasStatusChanged() bool {
	return r.PrevStatus != nil && r.ChangedAt != nil
}

// Helper function to create a string pointer
func stringPtr(s string) *string {
	return &s
}
