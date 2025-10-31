package repo

import (
	"context"
	"uno/domain/model"
)

type UsersToShoppingListItemRepo interface {
	GetAllUserToShoppingListItems(ctx context.Context) ([]model.UsersToShoppingListItems, error)
	AddUserToShoppingListItem(ctx context.Context, userItem model.UsersToShoppingListItems) error
	DeleteUserToShoppingListItem(ctx context.Context, userID string, itemID string) error
}
