package model

// Group represents a user group in the domain
type Group struct {
	ID       string
	Name     string
	IsLeader bool
}

// NewGroup represents the input for creating a new group
type NewGroup struct {
	ID   *string
	Name string
}

// UsersToGroups represents the relationship between users and groups
type UsersToGroups struct {
	UserID   string
	GroupID  string
	IsLeader bool
}

// GroupMember represents a member of a group with their leadership status
type GroupMember struct {
	ID       string
	Name     *string
	IsLeader bool
}
