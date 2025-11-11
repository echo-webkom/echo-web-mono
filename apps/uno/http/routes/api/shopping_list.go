package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/router"
	"uno/http/util"
)

// GetShoppingList returns a list of shopping list items
// @Summary	     Get shopping list
// @Tags         shopping_list
// @Produce      json
// @Success      200  {array}  service.ShoppingList  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /shopping [get]
func GetShoppingList(logger port.Logger, shoppingListService *service.ShoppingListService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		shoppingList, err := shoppingListService.GetShoppingList(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, shoppingList)
	}
}
