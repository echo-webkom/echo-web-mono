package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type shoppingList struct {
	logger              port.Logger
	shoppingListService *service.ShoppingListService
}

func NewShoppingListMux(logger port.Logger, shoppingListService *service.ShoppingListService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	s := shoppingList{logger, shoppingListService}

	// Admin
	mux.Handle("GET", "/", s.GetShoppingListHandler, admin)

	return mux
}

// GetShoppingList returns a list of shopping list items
// @Summary	     Get shopping list
// @Tags         shopping_list
// @Produce      json
// @Success      200  {array}  service.ShoppingList  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /shopping [get]
func (s *shoppingList) GetShoppingListHandler(ctx *handler.Context) error {
	shoppingList, err := s.shoppingListService.GetShoppingList(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := dto.ShoppingListFromDomainList(shoppingList)

	return ctx.JSON(response)
}
