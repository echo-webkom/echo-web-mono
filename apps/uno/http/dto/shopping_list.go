package dto

import (
	"uno/domain/service"
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
			CreatedAt: FormatISO8601(item.CreatedAt),
			Likes:     item.Likes,
		})
	}

	return response
}
