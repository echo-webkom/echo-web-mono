package postgres

import (
	"context"
	"testing"
	"time"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestBanInfoRepo_CreateBan(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewBanInfoRepo(db, testutil.NewTestLogger())
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

	ban := model.NewBanInfo{
		UserID:    createdUser.ID,
		BannedBy:  createdUser.ID,
		Reason:    "Test ban",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	createdBan, err := repo.CreateBan(ctx, ban)

	assert.NoError(t, err)
	assert.NotZero(t, createdBan.ID)
	assert.Equal(t, ban.UserID, createdBan.UserID)
	assert.Equal(t, ban.BannedBy, createdBan.BannedBy)
	assert.Equal(t, ban.Reason, createdBan.Reason)
	assert.False(t, createdBan.CreatedAt.IsZero())
}

func TestBanInfoRepo_GetBanInfoByUserID(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewBanInfoRepo(db, testutil.NewTestLogger())
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

	ban := model.NewBanInfo{
		UserID:    createdUser.ID,
		BannedBy:  createdUser.ID,
		Reason:    "Test ban",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	_, err = repo.CreateBan(ctx, ban)
	assert.NoError(t, err)

	retrievedBan, err := repo.GetBanInfoByUserID(ctx, createdUser.ID)

	assert.NoError(t, err)
	assert.NotNil(t, retrievedBan)
	assert.Equal(t, ban.UserID, retrievedBan.UserID)
	assert.Equal(t, ban.Reason, retrievedBan.Reason)
}

func TestBanInfoRepo_GetBanInfoByUserIDNotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewBanInfoRepo(db, testutil.NewTestLogger())
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

	retrievedBan, err := repo.GetBanInfoByUserID(ctx, createdUser.ID)

	assert.NoError(t, err)
	assert.Nil(t, retrievedBan)
}

func TestBanInfoRepo_DeleteExpired(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewBanInfoRepo(db, testutil.NewTestLogger())
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

	// Create an expired ban
	expiredBan := model.NewBanInfo{
		UserID:    createdUser.ID,
		BannedBy:  createdUser.ID,
		Reason:    "Expired ban",
		ExpiresAt: time.Now().Add(-24 * time.Hour), // Expired
	}

	_, err = repo.CreateBan(ctx, expiredBan)
	assert.NoError(t, err)

	// Create a non-expired ban
	activeBan := model.NewBanInfo{
		UserID:    createdUser.ID,
		BannedBy:  createdUser.ID,
		Reason:    "Active ban",
		ExpiresAt: time.Now().Add(24 * time.Hour), // Not expired
	}

	_, err = repo.CreateBan(ctx, activeBan)
	assert.NoError(t, err)

	// Delete expired
	err = repo.DeleteExpired(ctx)
	assert.NoError(t, err)

	// Verify expired ban is deleted, but active ban remains
	retrievedBan, err := repo.GetBanInfoByUserID(ctx, createdUser.ID)
	assert.NoError(t, err)
	assert.NotNil(t, retrievedBan)
	assert.Equal(t, "Active ban", retrievedBan.Reason)
}
