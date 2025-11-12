package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
)

// GetShoppingList returns a list of shopping list items
// @Summary	     Get shopping list
// @Tags         shopping_list
// @Produce      json
// @Success      200  {array}  service.ShoppingList  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /shopping [get]
func GetShoppingList(logger port.Logger, shoppingListService *service.ShoppingListService) handler.Handler {
	return func(ctx *handler.Context) error {
		shoppingList, err := shoppingListService.GetShoppingList(ctx.Context())
		if err != nil {
			return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
		}
		return ctx.JSON(shoppingList)
	}
}
