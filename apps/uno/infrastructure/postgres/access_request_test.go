package postgres

import (
	"context"
	"testing"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestAccessRequestRepo_CreateAccessRequest(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewAccessRequestRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	ar := model.NewAccessRequest{
		Email:  "test@example.com",
		Reason: "I want to join",
	}

	createdAR, err := repo.CreateAccessRequest(ctx, ar)

	assert.NoError(t, err)
	assert.NotEmpty(t, createdAR.ID)
	assert.Equal(t, ar.Email, createdAR.Email)
	assert.Equal(t, ar.Reason, createdAR.Reason)
	assert.False(t, createdAR.CreatedAt.IsZero())
}

func TestAccessRequestRepo_GetAccessRequests(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewAccessRequestRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	ar1 := model.NewAccessRequest{
		Email:  "test1@example.com",
		Reason: "Reason 1",
	}
	ar2 := model.NewAccessRequest{
		Email:  "test2@example.com",
		Reason: "Reason 2",
	}

	_, err := repo.CreateAccessRequest(ctx, ar1)
	assert.NoError(t, err)

	_, err = repo.CreateAccessRequest(ctx, ar2)
	assert.NoError(t, err)

	requests, err := repo.GetAccessRequests(ctx)

	assert.NoError(t, err)
	assert.Len(t, requests, 2)

	emails := []string{requests[0].Email, requests[1].Email}
	assert.Contains(t, emails, "test1@example.com")
	assert.Contains(t, emails, "test2@example.com")
}

func TestAccessRequestRepo_GetAccessRequestsEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewAccessRequestRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	requests, err := repo.GetAccessRequests(ctx)

	assert.NoError(t, err)
	assert.Len(t, requests, 0)
}
