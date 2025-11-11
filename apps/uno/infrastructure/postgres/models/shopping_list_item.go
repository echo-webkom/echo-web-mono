package models

import (
	"time"

	"uno/domain/model"
	"uno/domain/ports"
)

// ShoppingListItemDB represents the database schema for shopping_list_item table
type ShoppingListItemDB struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	Name      string    `db:"name"`
	CreatedAt time.Time `db:"created_at"`
}

// ShoppingListItemWithCreatorDB represents the database schema for shopping list items with creator info
type ShoppingListItemWithCreatorDB struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	Name      string    `db:"name"`
	CreatedAt time.Time `db:"created_at"`
	UserName  *string   `db:"user_name"`
}

// ToDomain converts database model to domain model
func (db *ShoppingListItemDB) ToDomain() *model.ShoppingListItem {
	return &model.ShoppingListItem{
		ID:        db.ID,
		UserID:    db.UserID,
		Name:      db.Name,
		CreatedAt: db.CreatedAt,
	}
}

// ToDomain converts database model to ports model
func (db *ShoppingListItemWithCreatorDB) ToDomain() *ports.ShoppingListItemWithCreator {
	return &ports.ShoppingListItemWithCreator{
		ShoppingListItem: model.ShoppingListItem{
			ID:        db.ID,
			UserID:    db.UserID,
			Name:      db.Name,
			CreatedAt: db.CreatedAt,
		},
		UserName: db.UserName,
	}
}
