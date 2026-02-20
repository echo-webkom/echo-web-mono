package api

import (
	"errors"
	"net/http"
	"uno/domain/model"
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
	mux.Handle("POST", "/", s.CreateShoppingListItemHandler, admin)
	mux.Handle("POST", "/like", s.ToggleLikeHandler, admin)
	mux.Handle("DELETE", "/{id}", s.RemoveShoppingListItemHandler, admin)

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

// CreateShoppingListItemHandler creates a new shopping list item
// @Summary	     Create shopping list item
// @Tags         shopping_list
// @Accept       json
// @Produce      json
// @Param        request  body  dto.CreateShoppingListItemRequest  true  "Create Shopping List Item Request"
// @Success      200  {string}  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /shopping [post]
func (s *shoppingList) CreateShoppingListItemHandler(ctx *handler.Context) error {
	var req dto.CreateShoppingListItemRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(errors.New("invalid request body"), http.StatusBadRequest)
	}

	newItem := model.NewShoppingListItem{
		Name:   req.Name,
		UserID: req.UserID,
	}

	// Insert the new shopping list item
	item, err := s.shoppingListService.ShoppingListItemRepo().CreateShoppingListItem(ctx.Context(), newItem)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Add a like for the creator of the item
	err = s.shoppingListService.ToggleLike(ctx.Context(), item.ID, req.UserID)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.Ok()
}

// ToggleLikeHandler toggles the like status of a shopping list item
// @Summary	     Toggle like on shopping list item
// @Tags         shopping_list
// @Accept       json
// @Produce      json
// @Param        request  body  dto.UserToShoppingListItemRequest  true  "User to Shopping List Item Request"
// @Success      200  {string}  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /shopping/like [post]
func (s *shoppingList) ToggleLikeHandler(ctx *handler.Context) error {
	var req dto.UserToShoppingListItemRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(errors.New("invalid request body"), http.StatusBadRequest)
	}

	err := s.shoppingListService.ToggleLike(ctx.Context(), req.ItemID, req.UserID)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.Ok()
}

// RemoveShoppingListItemHandler removes an item from the shopping list
// @Summary	     Remove item from shopping list
// @Tags         shopping_list
// @Produce      json
// @Param        id   path  string  true  "Item ID"
// @Success      200  {string}  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /shopping/{id} [delete]
func (s *shoppingList) RemoveShoppingListItemHandler(ctx *handler.Context) error {
	itemID := ctx.PathValue("id")
	if itemID == "" {
		return ctx.Error(errors.New("item ID is required"), http.StatusBadRequest)
	}

	err := s.shoppingListService.ShoppingListItemRepo().DeleteShoppingListItem(ctx.Context(), itemID)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.Ok()
}
