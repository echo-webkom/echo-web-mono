package model

import (
	"strconv"
	"strings"
)

// IsBoardID checks if a string matches the board slug pattern (e.g. "2023/2024").
func IsBoardID(s string) bool {
	parts := strings.SplitN(s, "/", 2)
	if len(parts) != 2 {
		return false
	}
	_, err1 := strconv.Atoi(parts[0])
	_, err2 := strconv.Atoi(parts[1])
	return err1 == nil && err2 == nil
}

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
	Email    string
	IsLeader bool
}
