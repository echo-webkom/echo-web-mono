package postgres

import (
	"context"
	"testing"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestShoppingListRepo_CreateShoppingListItem(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewShoppingListRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create a user first
	userRepo := NewUserRepo(db, testutil.NewTestLogger())
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

	item := model.NewShoppingListItem{
		UserID: createdUser.ID,
		Name:   "Test item",
	}

	createdItem, err := repo.CreateShoppingListItem(ctx, item)

	assert.NoError(t, err)
	assert.NotEmpty(t, createdItem.ID)
	assert.Equal(t, item.UserID, createdItem.UserID)
	assert.Equal(t, item.Name, createdItem.Name)
	assert.False(t, createdItem.CreatedAt.IsZero())
}

func TestShoppingListRepo_GetAllShoppingListItems(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewShoppingListRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create users
	userRepo := NewUserRepo(db, testutil.NewTestLogger())
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

	// Create items
	item1 := model.NewShoppingListItem{
		UserID: createdUser1.ID,
		Name:   "Item 1",
	}
	item2 := model.NewShoppingListItem{
		UserID: createdUser2.ID,
		Name:   "Item 2",
	}

	_, err = repo.CreateShoppingListItem(ctx, item1)
	assert.NoError(t, err)

	_, err = repo.CreateShoppingListItem(ctx, item2)
	assert.NoError(t, err)

	items, err := repo.GetAllShoppingListItems(ctx)

	assert.NoError(t, err)
	assert.Len(t, items, 2)

	names := []string{items[0].Name, items[1].Name}
	assert.Contains(t, names, "Item 1")
	assert.Contains(t, names, "Item 2")
}

func TestShoppingListRepo_DeleteShoppingListItem(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewShoppingListRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create a user first
	userRepo := NewUserRepo(db, testutil.NewTestLogger())
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

	item := model.NewShoppingListItem{
		UserID: createdUser.ID,
		Name:   "Test item",
	}

	createdItem, err := repo.CreateShoppingListItem(ctx, item)
	assert.NoError(t, err)

	// Verify item exists
	items, err := repo.GetAllShoppingListItems(ctx)
	assert.NoError(t, err)
	assert.Len(t, items, 1)

	// Delete item
	err = repo.DeleteShoppingListItem(ctx, createdItem.ID)
	assert.NoError(t, err)

	// Verify item is deleted
	items, err = repo.GetAllShoppingListItems(ctx)
	assert.NoError(t, err)
	assert.Len(t, items, 0)
}

func TestShoppingListRepo_GetAllShoppingListItemsEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewShoppingListRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	items, err := repo.GetAllShoppingListItems(ctx)

	assert.NoError(t, err)
	assert.Len(t, items, 0)
}
