package postgres

import (
	"context"
	"encoding/json"
	"testing"
	"time"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestRegistrationRepo_GetByUserAndHappening(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewRegistrationRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create user and happening
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

	happeningRepo := NewHappeningRepo(db, testutil.NewTestLogger())
	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := happeningRepo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create registration
	query := `INSERT INTO registration (user_id, happening_id, status, created_at) VALUES ($1, $2, $3, NOW())`
	_, err = db.ExecContext(ctx, query, createdUser.ID, createdHappening.ID, "registered")
	assert.NoError(t, err)

	registration, err := repo.GetByUserAndHappening(ctx, createdUser.ID, createdHappening.ID)

	assert.NoError(t, err)
	assert.NotNil(t, registration)
	assert.Equal(t, createdUser.ID, registration.UserID)
	assert.Equal(t, createdHappening.ID, registration.HappeningID)
	assert.Equal(t, "registered", string(registration.Status))
}

func TestRegistrationRepo_GetByUserAndHappeningNotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewRegistrationRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create user and happening
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

	happeningRepo := NewHappeningRepo(db, testutil.NewTestLogger())
	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := happeningRepo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	registration, err := repo.GetByUserAndHappening(ctx, createdUser.ID, createdHappening.ID)

	assert.NoError(t, err)
	assert.Nil(t, registration)
}

func TestRegistrationRepo_InsertAnswers(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewRegistrationRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create user and happening
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

	happeningRepo := NewHappeningRepo(db, testutil.NewTestLogger())
	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := happeningRepo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create question
	questionID := "question-1"
	query := `INSERT INTO question (id, happening_id, title, required, type, is_sensitive) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = db.ExecContext(ctx, query, questionID, createdHappening.ID, "Test Question", true, "text", false)
	assert.NoError(t, err)

	// Insert answers
	answer := json.RawMessage(`"Test answer"`)
	questions := []model.QuestionAnswer{
		{
			QuestionID: questionID,
			Answer:     answer,
		},
	}

	err = repo.InsertAnswers(ctx, createdUser.ID, createdHappening.ID, questions)
	assert.NoError(t, err)

	// Verify answer was inserted
	var retrievedAnswer json.RawMessage
	answerQuery := `SELECT answer FROM answer WHERE user_id = $1 AND happening_id = $2 AND question_id = $3`
	err = db.GetContext(ctx, &retrievedAnswer, answerQuery, createdUser.ID, createdHappening.ID, questionID)
	assert.NoError(t, err)
	assert.Equal(t, answer, retrievedAnswer)
}

func TestRegistrationRepo_InsertAnswersEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewRegistrationRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create user and happening
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

	happeningRepo := NewHappeningRepo(db, testutil.NewTestLogger())
	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := happeningRepo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Insert empty answers
	err = repo.InsertAnswers(ctx, createdUser.ID, createdHappening.ID, []model.QuestionAnswer{})
	assert.NoError(t, err)
}

func TestRegistrationRepo_CreateRegistration(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewRegistrationRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create user with year
	userRepo := NewUserRepo(db, testutil.NewTestLogger())
	name := "John Doe"
	email := "john@example.com"
	year := 2
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
		Year:         &year,
	}
	createdUser, err := userRepo.CreateUser(ctx, user)
	assert.NoError(t, err)

	// Create happening
	happeningRepo := NewHappeningRepo(db, testutil.NewTestLogger())
	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := happeningRepo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create spot range
	spotRange := model.SpotRange{
		ID:          "spot-range-1",
		HappeningID: createdHappening.ID,
		Spots:       10,
		MinYear:     1,
		MaxYear:     5,
	}

	query := `INSERT INTO spot_range (id, happening_id, spots, min_year, max_year) VALUES ($1, $2, $3, $4, $5)`
	_, err = db.ExecContext(ctx, query, spotRange.ID, spotRange.HappeningID, spotRange.Spots, spotRange.MinYear, spotRange.MaxYear)
	assert.NoError(t, err)

	// Create registration
	registration, isWaitlisted, err := repo.CreateRegistration(
		ctx,
		createdUser.ID,
		createdHappening,
		[]model.SpotRange{spotRange},
		[]string{},
		false,
	)

	assert.NoError(t, err)
	assert.NotNil(t, registration)
	assert.Equal(t, createdUser.ID, registration.UserID)
	assert.Equal(t, createdHappening.ID, registration.HappeningID)
	assert.False(t, isWaitlisted) // Should be registered since spot is available
	assert.Equal(t, "registered", string(registration.Status))
}

func TestRegistrationRepo_CreateRegistrationWaitlisted(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewRegistrationRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create users with year
	userRepo := NewUserRepo(db, testutil.NewTestLogger())
	year1 := 2
	name1 := "John Doe"
	email1 := "john@example.com"
	user1 := model.User{
		Name:         &name1,
		Email:        email1,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
		Year:         &year1,
	}
	createdUser1, err := userRepo.CreateUser(ctx, user1)
	assert.NoError(t, err)

	year2 := 2
	name2 := "Jane Doe"
	email2 := "jane@example.com"
	user2 := model.User{
		Name:         &name2,
		Email:        email2,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
		Year:         &year2,
	}
	createdUser2, err := userRepo.CreateUser(ctx, user2)
	assert.NoError(t, err)

	// Create happening
	happeningRepo := NewHappeningRepo(db, testutil.NewTestLogger())
	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := happeningRepo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create spot range with only 1 spot
	spotRange := model.SpotRange{
		ID:          "spot-range-1",
		HappeningID: createdHappening.ID,
		Spots:       1,
		MinYear:     1,
		MaxYear:     5,
	}

	query := `INSERT INTO spot_range (id, happening_id, spots, min_year, max_year) VALUES ($1, $2, $3, $4, $5)`
	_, err = db.ExecContext(ctx, query, spotRange.ID, spotRange.HappeningID, spotRange.Spots, spotRange.MinYear, spotRange.MaxYear)
	assert.NoError(t, err)

	// Register first user (should be registered)
	_, isWaitlisted1, err := repo.CreateRegistration(
		ctx,
		createdUser1.ID,
		createdHappening,
		[]model.SpotRange{spotRange},
		[]string{},
		false,
	)
	assert.NoError(t, err)
	assert.False(t, isWaitlisted1)

	// Register second user (should be waitlisted)
	registration2, isWaitlisted2, err := repo.CreateRegistration(
		ctx,
		createdUser2.ID,
		createdHappening,
		[]model.SpotRange{spotRange},
		[]string{},
		false,
	)

	assert.NoError(t, err)
	assert.NotNil(t, registration2)
	assert.True(t, isWaitlisted2) // Should be waitlisted since no spots available
	assert.Equal(t, "waiting", string(registration2.Status))
}
