package model

import "time"

type ShoppingListItem struct {
	ID        string    `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"userId"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type UsersToShoppingListItems struct {
	UserID    string    `db:"user_id" json:"userId"`
	ItemID    string    `db:"item_id" json:"itemId"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}
