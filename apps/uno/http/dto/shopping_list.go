package dto

import (
	"uno/domain/service"
)

type ShoppingListItemResponse struct {
	ID        string   `json:"id" validate:"required"`
	Name      string   `json:"name" validate:"required"`
	UserID    string   `json:"userId" validate:"required"`
	UserName  *string  `json:"userName" validate:"required"`
	CreatedAt string   `json:"createdAt" validate:"required"`
	Likes     []string `json:"likes" validate:"required"`
}

func ShoppingListFromDomainList(items []service.ShoppingList) []ShoppingListItemResponse {
	response := []ShoppingListItemResponse{}
	for _, item := range items {
		response = append(response, ShoppingListItemResponse{
			ID:        item.ID,
			Name:      item.Name,
			UserID:    item.UserID,
			UserName:  item.UserName,
			CreatedAt: FormatISO8601(item.CreatedAt),
			Likes:     item.Likes,
		})
	}

	return response
}

type UserToShoppingListItemRequest struct {
	UserID string `json:"userId" validate:"required"`
	ItemID string `json:"itemId" validate:"required"`
}

type CreateShoppingListItemRequest struct {
	Name   string `json:"name" validate:"required"`
	UserID string `json:"userId" validate:"required"`
}
