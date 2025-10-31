package model

import "time"

type ShoppingListItem struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	Name      string    `db:"name"`
	CreatedAt time.Time `db:"created_at"`
}

type UsersToShoppingListItems struct {
	UserID    string    `db:"user_id"`
	ItemID    string    `db:"item_id"`
	CreatedAt time.Time `db:"created_at"`
}
