package repo

import (
	"context"
	"uno/domain/model"
)

type ShoppingListItemRepo interface {
	GetAllShoppingListItems(ctx context.Context) ([]ShoppingListItemWithCreator, error)
	CreateShoppingListItem(ctx context.Context, item model.ShoppingListItem) (model.ShoppingListItem, error)
	DeleteShoppingListItem(ctx context.Context, itemID string) error
}

type ShoppingListItemWithCreator struct {
	model.ShoppingListItem
	UserName *string `db:"user_name" json:"userName"`
}
