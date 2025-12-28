package api_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/services"
	"uno/infrastructure/postgres"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for shopping list tests
func setupShoppingListTest(t *testing.T) (*postgres.Database, *services.ShoppingListService, *services.UserService) {
	db := postgres.SetupTestDB(t)
	shoppingListItemRepo := postgres.NewShoppingListRepo(db, nil)
	usersToShoppingListItemRepo := postgres.NewUsersToShoppingListItemRepo(db, nil)
	userRepo := postgres.NewUserRepo(db, nil)
	userService := services.NewUserService(userRepo)
	shoppingListService := services.NewShoppingListService(shoppingListItemRepo, usersToShoppingListItemRepo, userRepo)
	return db, shoppingListService, userService
}

// Test getting shopping list when empty
func TestGetShoppingList_Empty(t *testing.T) {
	db, shoppingListService, _ := setupShoppingListTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetShoppingList(nil, shoppingListService)

	req := httptest.NewRequest(http.MethodGet, "/shopping", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var shoppingList []services.ShoppingList
	err = json.NewDecoder(w.Body).Decode(&shoppingList)
	assert.NoError(t, err)
	assert.Len(t, shoppingList, 0)
}

// Test getting shopping list with items
func TestGetShoppingList_WithData(t *testing.T) {
	db, shoppingListService, userService := setupShoppingListTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create a user first
	user, _ := userService.UserRepo().CreateUser(ctx, model.User{
		Email: "test@example.com",
		Type:  "student",
	})

	// Create shopping list items
	item1, _ := shoppingListService.ShoppingListItemRepo().CreateShoppingListItem(ctx, model.ShoppingListItem{
		UserID: user.ID,
		Name:   "Item 1",
	})
	item2, _ := shoppingListService.ShoppingListItemRepo().CreateShoppingListItem(ctx, model.ShoppingListItem{
		UserID: user.ID,
		Name:   "Item 2",
	})

	// Link items to users
	_ = shoppingListService.UsersToShoppingListItemRepo().AddUserToShoppingListItem(ctx, user.ID, item1.ID)
	_ = shoppingListService.UsersToShoppingListItemRepo().AddUserToShoppingListItem(ctx, user.ID, item2.ID)

	handler := api.GetShoppingList(nil, shoppingListService)

	req := httptest.NewRequest(http.MethodGet, "/shopping", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var shoppingList []services.ShoppingList
	err = json.NewDecoder(w.Body).Decode(&shoppingList)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(shoppingList), 0)
}
