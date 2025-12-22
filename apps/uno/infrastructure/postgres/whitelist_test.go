package postgres

import (
	"context"
	"testing"
	"time"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestWhitelistRepo_CreateWhitelist(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewWhitelistRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	whitelist := model.NewWhitelist{
		Email:     "test@example.com",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Reason:    "Test whitelist",
	}

	createdWhitelist, err := repo.CreateWhitelist(ctx, whitelist)

	assert.NoError(t, err)
	assert.Equal(t, whitelist.Email, createdWhitelist.Email)
	assert.Equal(t, whitelist.Reason, createdWhitelist.Reason)
}

func TestWhitelistRepo_GetWhitelistByEmail(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewWhitelistRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	email := "test@example.com"
	whitelist := model.NewWhitelist{
		Email:     email,
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Reason:    "Test whitelist",
	}

	_, err := repo.CreateWhitelist(ctx, whitelist)
	assert.NoError(t, err)

	retrievedWhitelist, err := repo.GetWhitelistByEmail(ctx, email)

	assert.NoError(t, err)
	assert.Equal(t, whitelist.Email, retrievedWhitelist.Email)
	assert.Equal(t, whitelist.Reason, retrievedWhitelist.Reason)
}

func TestWhitelistRepo_GetWhitelist(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewWhitelistRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	whitelist1 := model.NewWhitelist{
		Email:     "test1@example.com",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Reason:    "First whitelist",
	}

	whitelist2 := model.NewWhitelist{
		Email:     "test2@example.com",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Reason:    "Second whitelist",
	}

	// Create expired whitelist (should not appear in results)
	expiredWhitelist := model.NewWhitelist{
		Email:     "expired@example.com",
		ExpiresAt: time.Now().Add(-24 * time.Hour),
		Reason:    "Expired whitelist",
	}

	_, err := repo.CreateWhitelist(ctx, whitelist1)
	assert.NoError(t, err)

	_, err = repo.CreateWhitelist(ctx, whitelist2)
	assert.NoError(t, err)

	_, err = repo.CreateWhitelist(ctx, expiredWhitelist)
	assert.NoError(t, err)

	whitelists, err := repo.GetWhitelist(ctx)

	assert.NoError(t, err)
	assert.Len(t, whitelists, 2)

	emails := []string{whitelists[0].Email, whitelists[1].Email}
	assert.Contains(t, emails, "test1@example.com")
	assert.Contains(t, emails, "test2@example.com")
}

func TestWhitelistRepo_IsWhitelisted(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewWhitelistRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	email := "test@example.com"
	whitelist := model.NewWhitelist{
		Email:     email,
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Reason:    "Test whitelist",
	}

	// Initially not whitelisted
	isWhitelisted, err := repo.IsWhitelisted(ctx, email)
	assert.NoError(t, err)
	assert.False(t, isWhitelisted)

	// Create whitelist
	_, err = repo.CreateWhitelist(ctx, whitelist)
	assert.NoError(t, err)

	// Now should be whitelisted
	isWhitelisted, err = repo.IsWhitelisted(ctx, email)
	assert.NoError(t, err)
	assert.True(t, isWhitelisted)
}

func TestWhitelistRepo_GetWhitelistEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewWhitelistRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	whitelists, err := repo.GetWhitelist(ctx)

	assert.NoError(t, err)
	assert.Len(t, whitelists, 0)
}
