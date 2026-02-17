package port

import (
	"context"
	"uno/domain/model"
)

type UsersToShoppingListItemRepo interface {
	GetAllUserToShoppingListItems(ctx context.Context) ([]model.UsersToShoppingListItems, error)
	GetUserToShoppingListItem(ctx context.Context, userID string, itemID string) (*model.UsersToShoppingListItems, error)
	AddUserToShoppingListItem(ctx context.Context, userID string, itemID string) error
	DeleteUserToShoppingListItem(ctx context.Context, userID string, itemID string) error
}
