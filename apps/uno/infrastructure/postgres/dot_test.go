package postgres

import (
	"context"
	"testing"
	"time"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestDotRepo_CreateDot(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDotRepo(db, testutil.NewTestLogger())
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

	dot := model.Dot{
		UserID:    createdUser.ID,
		Count:     1,
		Reason:    "Test strike",
		StrikedBy: createdUser.ID,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	createdDot, err := repo.CreateDot(ctx, dot)

	assert.NoError(t, err)
	assert.NotZero(t, createdDot.ID)
	assert.Equal(t, dot.UserID, createdDot.UserID)
	assert.Equal(t, dot.Count, createdDot.Count)
	assert.Equal(t, dot.Reason, createdDot.Reason)
	assert.Equal(t, dot.StrikedBy, createdDot.StrikedBy)
	assert.False(t, createdDot.CreatedAt.IsZero())
}

func TestDotRepo_DeleteExpired(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDotRepo(db, testutil.NewTestLogger())
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

	// Create an expired dot
	expiredDot := model.Dot{
		UserID:    createdUser.ID,
		Count:     1,
		Reason:    "Expired strike",
		StrikedBy: createdUser.ID,
		ExpiresAt: time.Now().Add(-24 * time.Hour), // Expired
	}

	_, err = repo.CreateDot(ctx, expiredDot)
	assert.NoError(t, err)

	// Create a non-expired dot
	activeDot := model.Dot{
		UserID:    createdUser.ID,
		Count:     2,
		Reason:    "Active strike",
		StrikedBy: createdUser.ID,
		ExpiresAt: time.Now().Add(24 * time.Hour), // Not expired
	}

	_, err = repo.CreateDot(ctx, activeDot)
	assert.NoError(t, err)

	// Delete expired
	err = repo.DeleteExpired(ctx)
	assert.NoError(t, err)

	// Verify expired dot is deleted by checking the database
	var count int
	query := `SELECT COUNT(*) FROM dot WHERE user_id = $1 AND reason = $2`
	err = db.GetContext(ctx, &count, query, createdUser.ID, "Expired strike")
	assert.NoError(t, err)
	assert.Equal(t, 0, count)

	// Verify active dot still exists
	var activeCount int
	err = db.GetContext(ctx, &activeCount, query, createdUser.ID, "Active strike")
	assert.NoError(t, err)
	assert.Equal(t, 1, activeCount)
}
