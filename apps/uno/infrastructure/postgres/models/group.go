package models

import (
	"uno/domain/model"
)

// GroupDB represents the database schema for group table
type GroupDB struct {
	ID   string `db:"id"`
	Name string `db:"name"`
}

// ToDomain converts database model to domain model
func (db *GroupDB) ToDomain() *model.Group {
	return &model.Group{
		ID:   db.ID,
		Name: db.Name,
	}
}
