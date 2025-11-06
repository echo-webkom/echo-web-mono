package postgres

import (
	"context"
	"testing"
	"uno/domain/model"

	"github.com/stretchr/testify/assert"
)

func TestUsersToShoppingListItemRepo_AddUserToShoppingListItem(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUsersToShoppingListItemRepo(db, NewTestLogger())
	ctx := context.Background()

	// Create a user and shopping list item
	userRepo := NewUserRepo(db, NewTestLogger())
	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}
	createdUser, err := userRepo.CreateUser(ctx, user)
	assert.NoError(t, err)

	shoppingListRepo := NewShoppingListRepo(db, NewTestLogger())
	item := model.ShoppingListItem{
		UserID: createdUser.ID,
		Name:   "Test item",
	}
	createdItem, err := shoppingListRepo.CreateShoppingListItem(ctx, item)
	assert.NoError(t, err)

	// Add user to shopping list item
	err = repo.AddUserToShoppingListItem(ctx, createdUser.ID, createdItem.ID)
	assert.NoError(t, err)

	// Verify it was added
	items, err := repo.GetAllUserToShoppingListItems(ctx)
	assert.NoError(t, err)
	assert.Len(t, items, 1)
	assert.Equal(t, createdUser.ID, items[0].UserID)
	assert.Equal(t, createdItem.ID, items[0].ItemID)
}

func TestUsersToShoppingListItemRepo_GetAllUserToShoppingListItems(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUsersToShoppingListItemRepo(db, NewTestLogger())
	ctx := context.Background()

	// Create users and items
	userRepo := NewUserRepo(db, NewTestLogger())
	name1 := "John Doe"
	email1 := "john@example.com"
	user1 := model.User{
		Name:         &name1,
		Email:        email1,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}
	createdUser1, err := userRepo.CreateUser(ctx, user1)
	assert.NoError(t, err)

	name2 := "Jane Doe"
	email2 := "jane@example.com"
	user2 := model.User{
		Name:         &name2,
		Email:        email2,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}
	createdUser2, err := userRepo.CreateUser(ctx, user2)
	assert.NoError(t, err)

	shoppingListRepo := NewShoppingListRepo(db, NewTestLogger())
	item1 := model.ShoppingListItem{
		UserID: createdUser1.ID,
		Name:   "Item 1",
	}
	createdItem1, err := shoppingListRepo.CreateShoppingListItem(ctx, item1)
	assert.NoError(t, err)

	item2 := model.ShoppingListItem{
		UserID: createdUser2.ID,
		Name:   "Item 2",
	}
	createdItem2, err := shoppingListRepo.CreateShoppingListItem(ctx, item2)
	assert.NoError(t, err)

	// Add users to items
	err = repo.AddUserToShoppingListItem(ctx, createdUser1.ID, createdItem1.ID)
	assert.NoError(t, err)

	err = repo.AddUserToShoppingListItem(ctx, createdUser2.ID, createdItem2.ID)
	assert.NoError(t, err)

	items, err := repo.GetAllUserToShoppingListItems(ctx)

	assert.NoError(t, err)
	assert.Len(t, items, 2)

	userIDs := []string{items[0].UserID, items[1].UserID}
	assert.Contains(t, userIDs, createdUser1.ID)
	assert.Contains(t, userIDs, createdUser2.ID)
}

func TestUsersToShoppingListItemRepo_DeleteUserToShoppingListItem(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUsersToShoppingListItemRepo(db, NewTestLogger())
	ctx := context.Background()

	// Create a user and shopping list item
	userRepo := NewUserRepo(db, NewTestLogger())
	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}
	createdUser, err := userRepo.CreateUser(ctx, user)
	assert.NoError(t, err)

	shoppingListRepo := NewShoppingListRepo(db, NewTestLogger())
	item := model.ShoppingListItem{
		UserID: createdUser.ID,
		Name:   "Test item",
	}
	createdItem, err := shoppingListRepo.CreateShoppingListItem(ctx, item)
	assert.NoError(t, err)

	// Add user to shopping list item
	err = repo.AddUserToShoppingListItem(ctx, createdUser.ID, createdItem.ID)
	assert.NoError(t, err)

	// Verify it was added
	items, err := repo.GetAllUserToShoppingListItems(ctx)
	assert.NoError(t, err)
	assert.Len(t, items, 1)

	// Delete the relationship
	err = repo.DeleteUserToShoppingListItem(ctx, createdUser.ID, createdItem.ID)
	assert.NoError(t, err)

	// Verify it was deleted
	items, err = repo.GetAllUserToShoppingListItems(ctx)
	assert.NoError(t, err)
	assert.Len(t, items, 0)
}

func TestUsersToShoppingListItemRepo_GetAllUserToShoppingListItemsEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUsersToShoppingListItemRepo(db, NewTestLogger())
	ctx := context.Background()

	items, err := repo.GetAllUserToShoppingListItems(ctx)

	assert.NoError(t, err)
	assert.Len(t, items, 0)
}
