package postgres

import (
	"context"
	"encoding/json"
	"testing"
	"time"
	"uno/domain/model"

	"github.com/stretchr/testify/assert"
)

func TestHappeningRepo_CreateHappening(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	registrationGroups := json.RawMessage(`["group1", "group2"]`)
	registrationStart := time.Now()
	registrationEnd := time.Now().Add(48 * time.Hour)

	happening := model.Happening{
		Slug:                    "test-happening",
		Title:                   "Test Happening",
		Type:                    "event",
		Date:                    &date,
		RegistrationGroups:      &registrationGroups,
		RegistrationStartGroups: &registrationStart,
		RegistrationStart:       &registrationStart,
		RegistrationEnd:         &registrationEnd,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)

	assert.NoError(t, err)
	assert.NotEmpty(t, createdHappening.ID)
	assert.Equal(t, happening.Slug, createdHappening.Slug)
	assert.Equal(t, happening.Title, createdHappening.Title)
	assert.Equal(t, happening.Type, createdHappening.Type)
}

func TestHappeningRepo_GetHappeningById(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	retrievedHappening, err := repo.GetHappeningById(ctx, createdHappening.ID)

	assert.NoError(t, err)
	assert.Equal(t, createdHappening.ID, retrievedHappening.ID)
	assert.Equal(t, happening.Slug, retrievedHappening.Slug)
	assert.Equal(t, happening.Title, retrievedHappening.Title)
}

func TestHappeningRepo_GetAllHappenings(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date1 := time.Now().Add(24 * time.Hour)
	happening1 := model.Happening{
		Slug:  "test-happening-1",
		Title: "Test Happening 1",
		Type:  "event",
		Date:  &date1,
	}

	date2 := time.Now().Add(48 * time.Hour)
	happening2 := model.Happening{
		Slug:  "test-happening-2",
		Title: "Test Happening 2",
		Type:  "event",
		Date:  &date2,
	}

	_, err := repo.CreateHappening(ctx, happening1)
	assert.NoError(t, err)

	_, err = repo.CreateHappening(ctx, happening2)
	assert.NoError(t, err)

	happenings, err := repo.GetAllHappenings(ctx)

	assert.NoError(t, err)
	assert.Len(t, happenings, 2)

	slugs := []string{happenings[0].Slug, happenings[1].Slug}
	assert.Contains(t, slugs, "test-happening-1")
	assert.Contains(t, slugs, "test-happening-2")
}

func TestHappeningRepo_GetHappeningSpotRanges(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create spot ranges
	spotRange1 := model.SpotRange{
		ID:          "spot-range-1",
		HappeningID: createdHappening.ID,
		Spots:       10,
		MinYear:     1,
		MaxYear:     3,
	}

	spotRange2 := model.SpotRange{
		ID:          "spot-range-2",
		HappeningID: createdHappening.ID,
		Spots:       5,
		MinYear:     4,
		MaxYear:     5,
	}

	query := `INSERT INTO spot_range (id, happening_id, spots, min_year, max_year) VALUES ($1, $2, $3, $4, $5)`
	_, err = db.ExecContext(ctx, query, spotRange1.ID, spotRange1.HappeningID, spotRange1.Spots, spotRange1.MinYear, spotRange1.MaxYear)
	assert.NoError(t, err)

	_, err = db.ExecContext(ctx, query, spotRange2.ID, spotRange2.HappeningID, spotRange2.Spots, spotRange2.MinYear, spotRange2.MaxYear)
	assert.NoError(t, err)

	spotRanges, err := repo.GetHappeningSpotRanges(ctx, createdHappening.ID)

	assert.NoError(t, err)
	assert.Len(t, spotRanges, 2)

	ids := []string{spotRanges[0].ID, spotRanges[1].ID}
	assert.Contains(t, ids, spotRange1.ID)
	assert.Contains(t, ids, spotRange2.ID)
}

func TestHappeningRepo_GetHappeningQuestions(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create questions
	question1 := model.Question{
		ID:          "question-1",
		HappeningID: createdHappening.ID,
		Title:       "Question 1",
		Required:    true,
		Type:        "text",
		IsSensitive: false,
	}

	question2 := model.Question{
		ID:          "question-2",
		HappeningID: createdHappening.ID,
		Title:       "Question 2",
		Required:    false,
		Type:        "text",
		IsSensitive: false,
	}

	query := `INSERT INTO question (id, happening_id, title, required, type, is_sensitive) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = db.ExecContext(ctx, query, question1.ID, question1.HappeningID, question1.Title, question1.Required, question1.Type, question1.IsSensitive)
	assert.NoError(t, err)

	_, err = db.ExecContext(ctx, query, question2.ID, question2.HappeningID, question2.Title, question2.Required, question2.Type, question2.IsSensitive)
	assert.NoError(t, err)

	questions, err := repo.GetHappeningQuestions(ctx, createdHappening.ID)

	assert.NoError(t, err)
	assert.Len(t, questions, 2)

	ids := []string{questions[0].ID, questions[1].ID}
	assert.Contains(t, ids, question1.ID)
	assert.Contains(t, ids, question2.ID)
}

func TestHappeningRepo_GetHappeningHostGroups(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create groups first (required for foreign key constraint)
	group1 := "group-1"
	group2 := "group-2"

	groupQuery := `INSERT INTO "group" (id, name) VALUES ($1, $2)`
	_, err = db.ExecContext(ctx, groupQuery, group1, "Group 1")
	assert.NoError(t, err)

	_, err = db.ExecContext(ctx, groupQuery, group2, "Group 2")
	assert.NoError(t, err)

	// Create host groups
	query := `INSERT INTO happenings_to_groups (happening_id, group_id) VALUES ($1, $2)`
	_, err = db.ExecContext(ctx, query, createdHappening.ID, group1)
	assert.NoError(t, err)

	_, err = db.ExecContext(ctx, query, createdHappening.ID, group2)
	assert.NoError(t, err)

	groupIDs, err := repo.GetHappeningHostGroups(ctx, createdHappening.ID)

	assert.NoError(t, err)
	assert.Len(t, groupIDs, 2)
	assert.Contains(t, groupIDs, group1)
	assert.Contains(t, groupIDs, group2)
}

func TestHappeningRepo_GetHappeningRegistrations(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	// Create user and happening
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

	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)
	assert.NoError(t, err)

	// Create registration
	query := `INSERT INTO registration (user_id, happening_id, status, created_at) VALUES ($1, $2, $3, NOW())`
	_, err = db.ExecContext(ctx, query, createdUser.ID, createdHappening.ID, "registered")
	assert.NoError(t, err)

	registrations, err := repo.GetHappeningRegistrations(ctx, createdHappening.ID)

	assert.NoError(t, err)
	assert.Len(t, registrations, 1)
	assert.Equal(t, createdUser.ID, registrations[0].UserID)
	assert.Equal(t, createdHappening.ID, registrations[0].HappeningID)
	assert.Equal(t, "registered", string(registrations[0].Status))
}

func TestHappeningRepo_GetHappeningRegistrationCounts(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewHappeningRepo(db, NewTestLogger())
	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening := model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	}

	createdHappening, err := repo.CreateHappening(ctx, happening)
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

	// Create registrations
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

	regQuery := `INSERT INTO registration (user_id, happening_id, status, created_at) VALUES ($1, $2, $3, NOW())`
	_, err = db.ExecContext(ctx, regQuery, createdUser1.ID, createdHappening.ID, "registered")
	assert.NoError(t, err)

	_, err = db.ExecContext(ctx, regQuery, createdUser2.ID, createdHappening.ID, "waiting")
	assert.NoError(t, err)

	counts, err := repo.GetHappeningRegistrationCounts(ctx, []string{createdHappening.ID})

	assert.NoError(t, err)
	assert.Len(t, counts, 1)
	assert.Equal(t, createdHappening.ID, counts[0].HappeningID)
	assert.NotNil(t, counts[0].Max)
	assert.Equal(t, 10, *counts[0].Max)
	assert.Equal(t, 1, counts[0].Registered)
	assert.Equal(t, 1, counts[0].Waiting)
}
