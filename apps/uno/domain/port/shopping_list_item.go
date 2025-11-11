package port

import (
	"context"
	"uno/domain/model"
)

type ShoppingListItemRepo interface {
	GetAllShoppingListItems(ctx context.Context) ([]ShoppingListItemWithCreator, error)
	CreateShoppingListItem(ctx context.Context, item model.NewShoppingListItem) (model.ShoppingListItem, error)
	DeleteShoppingListItem(ctx context.Context, itemID string) error
}

// ShoppingListItemWithCreator represents a shopping list item along with the creator's username.
// The user's name can be nil.
type ShoppingListItemWithCreator struct {
	model.ShoppingListItem
	UserName *string `db:"user_name"`
}
