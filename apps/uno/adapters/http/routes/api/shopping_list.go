package api

import (
	"encoding/json"
	"net/http"
	"uno/adapters/http/router"
	"uno/services"
)

// GetShoppingList returns a list of shopping list items
// @Summary	     Get shopping list
// @Tags         shopping_list
// @Produce      json
// @Success      200  {array}  services.ShoppingList  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /shopping [get]
func GetShoppingList(shoppingListService *services.ShoppingListService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbacks, err := shoppingListService.GetShoppingList(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return http.StatusOK, json.NewEncoder(w).Encode(feedbacks)
	}
}
