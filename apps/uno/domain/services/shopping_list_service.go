package services

import (
	"context"
	"time"
	"uno/domain/repo"
)

type ShoppingListService struct {
	shoppingListeItemRepo       repo.ShoppingListItemRepo
	usersToShoppingListItemRepo repo.UsersToShoppingListItemRepo
	userRepo                    repo.UserRepo
}

func NewShoppingListService(
	shoppingListeItemRepo repo.ShoppingListItemRepo,
	usersToShoppingListItemRepo repo.UsersToShoppingListItemRepo,
	userRepo repo.UserRepo,
) *ShoppingListService {
	return &ShoppingListService{
		shoppingListeItemRepo:       shoppingListeItemRepo,
		usersToShoppingListItemRepo: usersToShoppingListItemRepo,
		userRepo:                    userRepo,
	}
}

type ShoppingList struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	UserID    string    `json:"user_id"`
	UserName  *string   `json:"user_name,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	Likes     []string  `json:"likes,omitempty"`
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

	var shoppingLists []ShoppingList
	for _, item := range items {

		var likes []string
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

func (s *ShoppingListService) ShoppingListItemRepo() repo.ShoppingListItemRepo {
	return s.shoppingListeItemRepo
}

func (s *ShoppingListService) UsersToShoppingListItemRepo() repo.UsersToShoppingListItemRepo {
	return s.usersToShoppingListItemRepo
}
