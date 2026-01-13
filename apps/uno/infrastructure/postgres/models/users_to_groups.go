package models

import (
	"uno/domain/model"
)

// UsersToGroupsDB represents the database schema for users_to_groups table
type UsersToGroupsDB struct {
	UserID   string `db:"user_id"`
	GroupID  string `db:"group_id"`
	IsLeader bool   `db:"is_leader"`
}

// ToDomain converts database model to domain model
func (db *UsersToGroupsDB) ToDomain() *model.UsersToGroups {
	return &model.UsersToGroups{
		UserID:   db.UserID,
		GroupID:  db.GroupID,
		IsLeader: db.IsLeader,
	}
}
