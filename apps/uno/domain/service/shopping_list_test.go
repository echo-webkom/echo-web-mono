package service_test

import (
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestShoppingListService_GetShoppingList(t *testing.T) {
	time := time.Now()

	shoppingListItems := []port.ShoppingListItemWithCreator{
		{
			ShoppingListItem: model.ShoppingListItem{
				ID:        "1",
				UserID:    "1",
				Name:      "Ost",
				CreatedAt: time,
			},
			UserName: new("Bob"),
		},
		{
			ShoppingListItem: model.ShoppingListItem{
				ID:        "2",
				UserID:    "2",
				Name:      "Mjölk",
				CreatedAt: time,
			},
			UserName: new("Alice"),
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

	shoppingListService := service.NewShoppingListService(mockShoppingListItemRepo, mockUsersToShoppingListItemRepo)

	shoppingList, err := shoppingListService.GetShoppingList(t.Context())
	assert.NoError(t, err, "Expected GetShoppingList to not return an error")
	assert.NotNil(t, shoppingList, "Expected GetShoppingList to return a non-nil shopping list")

	expectedShoppingList := []service.ShoppingList{
		{
			ID:        "1",
			Name:      "Ost",
			UserID:    "1",
			UserName:  new("Bob"),
			CreatedAt: time,
			Likes:     []string{"2", "3"},
		},
		{
			ID:        "2",
			Name:      "Mjölk",
			UserID:    "2",
			UserName:  new("Alice"),
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

	shoppingListService := service.NewShoppingListService(mockShoppingListItemRepo, nil)

	shoppingList, err := shoppingListService.GetShoppingList(t.Context())
	assert.Error(t, err, "Expected GetShoppingList to return an error")
	assert.Nil(t, shoppingList, "Expected shopping list to be nil on error")
}

func TestShoppingListService_GetShoppingList_UsersToShoppingListItemRepoError(t *testing.T) {
	shoppingList := []port.ShoppingListItemWithCreator{}

	for range 5 {
		shoppingList = append(shoppingList, testutil.NewFakeStruct[port.ShoppingListItemWithCreator]())
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

	shoppingListService := service.NewShoppingListService(
		mockShoppingListItemRepo,
		mockUsersToShoppingListItemRepo,
	)

	list, err := shoppingListService.GetShoppingList(t.Context())
	assert.Error(t, err, "Expected GetShoppingList to return an error")
	assert.Nil(t, list, "Expected shopping list to be nil on error")
}

func TestShoppingListService_CreateShoppingListItem(t *testing.T) {
	mockRepo := mocks.NewShoppingListItemRepo(t)
	shoppingListService := service.NewShoppingListService(mockRepo, nil)

	newItem := testutil.NewFakeStruct[model.NewShoppingListItem]()
	created := testutil.NewFakeStruct[model.ShoppingListItem]()
	mockRepo.EXPECT().CreateShoppingListItem(mock.Anything, newItem).Return(created, nil).Once()

	item, err := shoppingListService.CreateShoppingListItem(t.Context(), newItem)
	assert.NoError(t, err)
	assert.Equal(t, created, item)
}

func TestShoppingListService_DeleteShoppingListItem(t *testing.T) {
	itemID := "item-1"
	mockRepo := mocks.NewShoppingListItemRepo(t)
	shoppingListService := service.NewShoppingListService(mockRepo, nil)

	mockRepo.EXPECT().DeleteShoppingListItem(mock.Anything, itemID).Return(nil).Once()

	err := shoppingListService.DeleteShoppingListItem(t.Context(), itemID)
	assert.NoError(t, err)
}
