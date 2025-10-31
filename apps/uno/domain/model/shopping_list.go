package model

import "time"

type ShoppingListItem struct {
	ID        string    `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"user_id"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type UsersToShoppingListItems struct {
	UserID    string    `db:"user_id" json:"user_id"`
	ItemID    string    `db:"item_id" json:"item_id"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
