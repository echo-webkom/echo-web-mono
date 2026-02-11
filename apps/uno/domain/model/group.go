package model

// Group represents a user group in the domain
type Group struct {
	ID   string
	Name string
}

// NewGroup represents the input for creating a new group
type NewGroup struct {
	ID   string
	Name string
}

// UsersToGroups represents the relationship between users and groups
type UsersToGroups struct {
	UserID   string
	GroupID  string
	IsLeader bool
}
