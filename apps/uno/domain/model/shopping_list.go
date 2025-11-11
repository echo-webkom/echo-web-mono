package model

import "time"

// ShoppingListItem represents a shopping list item in the domain
type ShoppingListItem struct {
	ID        string
	UserID    string
	Name      string
	CreatedAt time.Time
}

// NewShoppingListItem represents the input for creating a shopping list item
type NewShoppingListItem struct {
	UserID string
	Name   string
}

// UsersToShoppingListItems represents the relationship between users and shopping list items
type UsersToShoppingListItems struct {
	UserID    string
	ItemID    string
	CreatedAt time.Time
}
