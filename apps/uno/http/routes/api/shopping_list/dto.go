package shoppinglist

import (
	"uno/domain/service"
	"uno/http/routes/api"
)

type ShoppingListItemResponse struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	UserID    string   `json:"userId"`
	UserName  *string  `json:"userName"`
	CreatedAt string   `json:"createdAt"`
	Likes     []string `json:"likes"`
}

func ShoppingListFromDomainList(items []service.ShoppingList) []ShoppingListItemResponse {
	response := []ShoppingListItemResponse{}
	for _, item := range items {
		response = append(response, ShoppingListItemResponse{
			ID:        item.ID,
			Name:      item.Name,
			UserID:    item.UserID,
			UserName:  item.UserName,
			CreatedAt: api.FormatISO8601(item.CreatedAt),
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
