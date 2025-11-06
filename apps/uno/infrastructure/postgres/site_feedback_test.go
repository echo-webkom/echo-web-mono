package postgres

import (
	"context"
	"testing"
	"uno/domain/model"

	"github.com/stretchr/testify/assert"
)

func TestSiteFeedbackRepo_CreateSiteFeedback(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewSiteFeedbackRepo(db, NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	feedback := model.SiteFeedback{
		Name:     &name,
		Email:    &email,
		Message:  "This is a test feedback",
		Category: "bug",
		IsRead:   false,
	}

	createdFeedback, err := repo.CreateSiteFeedback(ctx, feedback)

	assert.NoError(t, err)
	assert.NotEmpty(t, createdFeedback.ID)
	assert.Equal(t, feedback.Message, createdFeedback.Message)
	assert.Equal(t, feedback.Category, createdFeedback.Category)
	assert.Equal(t, feedback.IsRead, createdFeedback.IsRead)
	assert.False(t, createdFeedback.CreatedAt.IsZero())
}

func TestSiteFeedbackRepo_GetSiteFeedbackByID(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewSiteFeedbackRepo(db, NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	feedback := model.SiteFeedback{
		Name:     &name,
		Email:    &email,
		Message:  "Test message",
		Category: "feature",
		IsRead:   false,
	}

	createdFeedback, err := repo.CreateSiteFeedback(ctx, feedback)
	assert.NoError(t, err)

	retrievedFeedback, err := repo.GetSiteFeedbackByID(ctx, createdFeedback.ID)

	assert.NoError(t, err)
	assert.Equal(t, createdFeedback.ID, retrievedFeedback.ID)
	assert.Equal(t, feedback.Message, retrievedFeedback.Message)
	assert.Equal(t, feedback.Category, retrievedFeedback.Category)
}

func TestSiteFeedbackRepo_GetAllSiteFeedbacks(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewSiteFeedbackRepo(db, NewTestLogger())
	ctx := context.Background()

	name1 := "John Doe"
	email1 := "john@example.com"
	feedback1 := model.SiteFeedback{
		Name:     &name1,
		Email:    &email1,
		Message:  "First feedback",
		Category: "bug",
		IsRead:   false,
	}

	name2 := "Jane Doe"
	email2 := "jane@example.com"
	feedback2 := model.SiteFeedback{
		Name:     &name2,
		Email:    &email2,
		Message:  "Second feedback",
		Category: "feature",
		IsRead:   true,
	}

	_, err := repo.CreateSiteFeedback(ctx, feedback1)
	assert.NoError(t, err)

	_, err = repo.CreateSiteFeedback(ctx, feedback2)
	assert.NoError(t, err)

	feedbacks, err := repo.GetAllSiteFeedbacks(ctx)

	assert.NoError(t, err)
	assert.Len(t, feedbacks, 2)

	messages := []string{feedbacks[0].Message, feedbacks[1].Message}
	assert.Contains(t, messages, "First feedback")
	assert.Contains(t, messages, "Second feedback")
}

func TestSiteFeedbackRepo_MarkSiteFeedbackAsRead(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewSiteFeedbackRepo(db, NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	feedback := model.SiteFeedback{
		Name:     &name,
		Email:    &email,
		Message:  "Test message",
		Category: "bug",
		IsRead:   false,
	}

	createdFeedback, err := repo.CreateSiteFeedback(ctx, feedback)
	assert.NoError(t, err)
	assert.False(t, createdFeedback.IsRead)

	err = repo.MarkSiteFeedbackAsRead(ctx, createdFeedback.ID)
	assert.NoError(t, err)

	retrievedFeedback, err := repo.GetSiteFeedbackByID(ctx, createdFeedback.ID)
	assert.NoError(t, err)
	assert.True(t, retrievedFeedback.IsRead)
}

func TestSiteFeedbackRepo_GetAllSiteFeedbacksEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewSiteFeedbackRepo(db, NewTestLogger())
	ctx := context.Background()

	feedbacks, err := repo.GetAllSiteFeedbacks(ctx)

	assert.NoError(t, err)
	assert.Len(t, feedbacks, 0)
}
