package record

import (
	"time"

	"uno/domain/model"
)

// UsersToShoppingListItemsDB represents the database schema for users_to_shopping_list_items table
type UsersToShoppingListItemsDB struct {
	UserID    string    `db:"user_id"`
	ItemID    string    `db:"item_id"`
	CreatedAt time.Time `db:"created_at"`
}

// ToDomain converts database model to domain model
// TODO: This should maybe not return a pointer?
func (db *UsersToShoppingListItemsDB) ToDomain() *model.UsersToShoppingListItems {
	return &model.UsersToShoppingListItems{
		UserID:    db.UserID,
		ItemID:    db.ItemID,
		CreatedAt: db.CreatedAt,
	}
}
