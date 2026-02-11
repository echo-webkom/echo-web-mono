package service

import (
	"context"
	"time"
	"uno/domain/port"
)

type ShoppingListService struct {
	shoppingListeItemRepo       port.ShoppingListItemRepo
	usersToShoppingListItemRepo port.UsersToShoppingListItemRepo
}

func NewShoppingListService(
	shoppingListItemRepo port.ShoppingListItemRepo,
	usersToShoppingListItemRepo port.UsersToShoppingListItemRepo,
) *ShoppingListService {
	return &ShoppingListService{
		shoppingListeItemRepo:       shoppingListItemRepo,
		usersToShoppingListItemRepo: usersToShoppingListItemRepo,
	}
}

type ShoppingList struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	UserID    string    `json:"userId"`
	UserName  *string   `json:"userName"`
	CreatedAt time.Time `json:"createdAt"`
	Likes     []string  `json:"likes"`
}

// GetShoppingList retrieves all shopping list items along with their owners and likes.
func (s *ShoppingListService) GetShoppingList(ctx context.Context) ([]ShoppingList, error) {
	items, err := s.shoppingListeItemRepo.GetAllShoppingListItems(ctx)
	if err != nil {
		return nil, err
	}

	userLikes, err := s.usersToShoppingListItemRepo.GetAllUserToShoppingListItems(ctx)
	if err != nil {
		return nil, err
	}

	shoppingLists := []ShoppingList{}
	for _, item := range items {

		likes := []string{}
		for _, like := range userLikes {
			if like.ItemID == item.ID {
				likes = append(likes, like.UserID)
			}
		}

		shoppingLists = append(shoppingLists, ShoppingList{
			ID:        item.ID,
			Name:      item.Name,
			UserID:    item.UserID,
			UserName:  item.UserName,
			CreatedAt: item.CreatedAt,
			Likes:     likes,
		})
	}

	return shoppingLists, nil
}

func (s *ShoppingListService) ShoppingListItemRepo() port.ShoppingListItemRepo {
	return s.shoppingListeItemRepo
}

func (s *ShoppingListService) UsersToShoppingListItemRepo() port.UsersToShoppingListItemRepo {
	return s.usersToShoppingListItemRepo
}
