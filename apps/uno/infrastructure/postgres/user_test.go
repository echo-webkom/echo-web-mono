package postgres

import (
	"context"
	"testing"
	"time"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestUserRepo_CreateUser(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser, err := repo.CreateUser(ctx, user)

	assert.NoError(t, err)
	assert.NotEmpty(t, createdUser.ID)
	assert.Equal(t, email, createdUser.Email)
	assert.Equal(t, name, *createdUser.Name)
	assert.Equal(t, user.Type, createdUser.Type)
}

func TestUserRepo_GetUserByID(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	retrievedUser, err := repo.GetUserByID(ctx, createdUser.ID)

	assert.NoError(t, err)
	assert.Equal(t, createdUser.ID, retrievedUser.ID)
	assert.Equal(t, email, retrievedUser.Email)
	assert.Equal(t, name, *retrievedUser.Name)
}

func TestUserRepo_GetUsersByIDs(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name1 := "John Doe"
	email1 := "john@example.com"
	user1 := model.User{
		Name:         &name1,
		Email:        email1,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	name2 := "Jane Doe"
	email2 := "jane@example.com"
	user2 := model.User{
		Name:         &name2,
		Email:        email2,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser1, err := repo.CreateUser(ctx, user1)
	assert.NoError(t, err)

	createdUser2, err := repo.CreateUser(ctx, user2)
	assert.NoError(t, err)

	userIDs := []string{createdUser1.ID, createdUser2.ID}
	users, err := repo.GetUsersByIDs(ctx, userIDs)

	assert.NoError(t, err)
	assert.Len(t, users, 2)

	ids := []string{users[0].ID, users[1].ID}
	assert.Contains(t, ids, createdUser1.ID)
	assert.Contains(t, ids, createdUser2.ID)
}

func TestUserRepo_GetUsersWithBirthday(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	birthday := time.Date(1990, 5, 15, 0, 0, 0, 0, time.UTC)
	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
		Birthday:     &birthday,
	}

	_, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	// Test date with same month and day
	testDate := time.Date(2024, 5, 15, 0, 0, 0, 0, time.UTC)
	users, err := repo.GetUsersWithBirthday(ctx, testDate)

	assert.NoError(t, err)
	assert.Len(t, users, 1)
	assert.Equal(t, email, users[0].Email)
}

func TestUserRepo_GetUsersWithBirthdayNoMatch(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	birthday := time.Date(1990, 5, 15, 0, 0, 0, 0, time.UTC)
	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
		Birthday:     &birthday,
	}

	_, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	// Test date with different month and day
	testDate := time.Date(2024, 6, 20, 0, 0, 0, 0, time.UTC)
	users, err := repo.GetUsersWithBirthday(ctx, testDate)

	assert.NoError(t, err)
	assert.Len(t, users, 0)
}

func TestUserRepo_GetUserMemberships(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	// Create a group first (required for foreign key constraint)
	groupID := "group-123"
	groupQuery := `INSERT INTO "group" (id, name) VALUES ($1, $2)`
	_, err = db.ExecContext(ctx, groupQuery, groupID, "Test Group")
	assert.NoError(t, err)

	// Create a group membership
	query := `INSERT INTO users_to_groups (user_id, group_id) VALUES ($1, $2)`
	_, err = db.ExecContext(ctx, query, createdUser.ID, groupID)
	assert.NoError(t, err)

	memberships, err := repo.GetUserMemberships(ctx, createdUser.ID)

	assert.NoError(t, err)
	assert.Len(t, memberships, 1)
	assert.Equal(t, groupID, memberships[0])
}

func TestUserRepo_GetUserMembershipsEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	memberships, err := repo.GetUserMemberships(ctx, createdUser.ID)

	assert.NoError(t, err)
	assert.Len(t, memberships, 0)
}

func TestUserRepo_GetUsersWithStrikes(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	// Create a dot (strike) for the user
	query := `INSERT INTO dot (user_id, count, reason, striked_by, expires_at, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`
	_, err = db.ExecContext(ctx, query, createdUser.ID, 1, "Test reason", createdUser.ID, time.Now().Add(24*time.Hour))
	assert.NoError(t, err)

	users, err := repo.GetUsersWithStrikes(ctx)

	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(users), 1)

	// Find our user in the results
	var foundUser bool
	for _, u := range users {
		if u.ID == createdUser.ID {
			foundUser = true
			assert.Greater(t, u.Strikes, 0)
			break
		}
	}
	assert.True(t, foundUser)
}

func TestUserRepo_GetBannedUsers(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewUserRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	name := "John Doe"
	email := "john@example.com"
	user := model.User{
		Name:         &name,
		Email:        email,
		Type:         "student",
		HasReadTerms: false,
		IsPublic:     false,
	}

	createdUser, err := repo.CreateUser(ctx, user)
	assert.NoError(t, err)

	// Create a ban for the user
	banQuery := `INSERT INTO ban_info (user_id, banned_by, reason, expires_at, created_at) VALUES ($1, $2, $3, $4, NOW())`
	_, err = db.ExecContext(ctx, banQuery, createdUser.ID, createdUser.ID, "Test ban", time.Now().Add(24*time.Hour))
	assert.NoError(t, err)

	bannedUsers, err := repo.GetBannedUsers(ctx)

	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(bannedUsers), 1)

	// Find our user in the results
	var foundUser bool
	for _, u := range bannedUsers {
		if u.ID == createdUser.ID {
			foundUser = true
			assert.NotEmpty(t, u.BanInfo.ID)
			assert.Equal(t, "Test ban", u.BanInfo.Reason)
			break
		}
	}
	assert.True(t, foundUser)
}
