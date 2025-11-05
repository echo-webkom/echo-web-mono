package services_test

import (
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/ports"
	"uno/domain/ports/mocks"
	"uno/domain/services"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestShoppingListService_GetShoppingList(t *testing.T) {
	time := time.Now()

	shoppingListItems := []ports.ShoppingListItemWithCreator{
		{
			ShoppingListItem: model.ShoppingListItem{
				ID:        "1",
				UserID:    "1",
				Name:      "Ost",
				CreatedAt: time,
			},
			UserName: strPtr("Bob"),
		},
		{
			ShoppingListItem: model.ShoppingListItem{
				ID:        "2",
				UserID:    "2",
				Name:      "Mjölk",
				CreatedAt: time,
			},
			UserName: strPtr("Alice"),
		},
		{
			ShoppingListItem: model.ShoppingListItem{
				ID:        "3",
				UserID:    "3",
				Name:      "Bröd",
				CreatedAt: time,
			},
			UserName: nil,
		},
	}

	usersToShoppingListItem := []model.UsersToShoppingListItems{
		{
			UserID:    "1",
			ItemID:    "2",
			CreatedAt: time,
		},
		{
			UserID:    "2",
			ItemID:    "1",
			CreatedAt: time,
		},
		{
			UserID:    "3",
			ItemID:    "1",
			CreatedAt: time,
		},
	}

	mockShoppingListItemRepo := mocks.NewShoppingListItemRepo(t)
	mockShoppingListItemRepo.EXPECT().
		GetAllShoppingListItems(mock.Anything).
		Return(shoppingListItems, nil).
		Once()

	mockUsersToShoppingListItemRepo := mocks.NewUsersToShoppingListItemRepo(t)
	mockUsersToShoppingListItemRepo.EXPECT().
		GetAllUserToShoppingListItems(mock.Anything).
		Return(usersToShoppingListItem, nil).
		Once()

	shoppingListService := services.NewShoppingListService(mockShoppingListItemRepo, mockUsersToShoppingListItemRepo, nil)

	shoppingList, err := shoppingListService.GetShoppingList(t.Context())
	assert.NoError(t, err, "Expected GetShoppingList to not return an error")
	assert.NotNil(t, shoppingList, "Expected GetShoppingList to return a non-nil shopping list")

	expectedShoppingList := []services.ShoppingList{
		{
			ID:        "1",
			Name:      "Ost",
			UserID:    "1",
			UserName:  strPtr("Bob"),
			CreatedAt: time,
			Likes:     []string{"2", "3"},
		},
		{
			ID:        "2",
			Name:      "Mjölk",
			UserID:    "2",
			UserName:  strPtr("Alice"),
			CreatedAt: time,
			Likes:     []string{"1"},
		},
		{
			ID:        "3",
			Name:      "Bröd",
			UserID:    "3",
			UserName:  nil,
			CreatedAt: time,
			Likes:     []string{},
		},
	}

	assert.Equal(t, expectedShoppingList, shoppingList, "Expected shopping list to match the expected value")
}

func TestShoppingListService_GetShoppingList_ShoppingListItemRepoError(t *testing.T) {
	mockShoppingListItemRepo := mocks.NewShoppingListItemRepo(t)
	mockShoppingListItemRepo.EXPECT().
		GetAllShoppingListItems(mock.Anything).
		Return(nil, assert.AnError).
		Once()

	shoppingListService := services.NewShoppingListService(mockShoppingListItemRepo, nil, nil)

	shoppingList, err := shoppingListService.GetShoppingList(t.Context())
	assert.Error(t, err, "Expected GetShoppingList to return an error")
	assert.Nil(t, shoppingList, "Expected shopping list to be nil on error")
}

func TestShoppingListService_GetShoppingList_UsersToShoppingListItemRepoError(t *testing.T) {
	shoppingList := []ports.ShoppingListItemWithCreator{}

	for range 5 {
		shoppingList = append(shoppingList, testutil.NewFakeStruct[ports.ShoppingListItemWithCreator]())
	}

	mockShoppingListItemRepo := mocks.NewShoppingListItemRepo(t)
	mockShoppingListItemRepo.EXPECT().
		GetAllShoppingListItems(mock.Anything).
		Return(shoppingList, nil).
		Once()

	mockUsersToShoppingListItemRepo := mocks.NewUsersToShoppingListItemRepo(t)
	mockUsersToShoppingListItemRepo.EXPECT().
		GetAllUserToShoppingListItems(mock.Anything).
		Return(nil, assert.AnError).
		Once()

	shoppingListService := services.NewShoppingListService(
		mockShoppingListItemRepo,
		mockUsersToShoppingListItemRepo,
		nil,
	)

	list, err := shoppingListService.GetShoppingList(t.Context())
	assert.Error(t, err, "Expected GetShoppingList to return an error")
	assert.Nil(t, list, "Expected shopping list to be nil on error")
}

func TestShoppingListService_ShoppingListItemRepo(t *testing.T) {
	mockRepo := mocks.NewShoppingListItemRepo(t)
	shoppingListService := services.NewShoppingListService(mockRepo, nil, nil)

	shoppingListItemRepo := shoppingListService.ShoppingListItemRepo()
	assert.NotNil(t, shoppingListItemRepo, "Expected ShoppingListItemRepo to be non-nil")
}

func TestShoppingListService_UsersToShoppingListItemRepo(t *testing.T) {
	mockRepo := mocks.NewUsersToShoppingListItemRepo(t)
	shoppingListService := services.NewShoppingListService(nil, mockRepo, nil)

	usersToShoppingListItemRepo := shoppingListService.UsersToShoppingListItemRepo()
	assert.NotNil(t, usersToShoppingListItemRepo, "Expected UsersToShoppingListItemRepo to be non-nil")
}

// Helper function to create a string pointer
func strPtr(s string) *string {
	return &s
}
