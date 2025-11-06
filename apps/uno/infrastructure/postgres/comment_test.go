package postgres

import (
	"context"
	"testing"
	"uno/domain/model"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestCommentRepo_CreateComment(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
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

	postID := "post-456"
	content := "This is a test comment"

	err = repo.CreateComment(ctx, content, postID, createdUser.ID, nil)

	assert.NoError(t, err)
}

func TestCommentRepo_CreateCommentWithParent(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
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

	postID := "post-456"
	content := "This is a reply"
	parentID := "parent-comment-789"

	err = repo.CreateComment(ctx, content, postID, createdUser.ID, &parentID)

	assert.NoError(t, err)
}

func TestCommentRepo_GetCommentsByID(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
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

	postID := "post-456"
	content1 := "First comment"
	content2 := "Second comment"

	err = repo.CreateComment(ctx, content1, postID, createdUser.ID, nil)
	assert.NoError(t, err)

	err = repo.CreateComment(ctx, content2, postID, createdUser.ID, nil)
	assert.NoError(t, err)

	comments, err := repo.GetCommentsByID(ctx, postID)

	assert.NoError(t, err)
	assert.Len(t, comments, 2)

	contents := []string{comments[0].Content, comments[1].Content}
	assert.Contains(t, contents, content1)
	assert.Contains(t, contents, content2)
}

func TestCommentRepo_GetCommentsByIDEmpty(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	postID := "non-existent-post"

	comments, err := repo.GetCommentsByID(ctx, postID)

	assert.NoError(t, err)
	assert.Len(t, comments, 0)
}

func TestCommentRepo_AddReactionToComment(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create users first
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

	postID := "post-456"
	content := "Test comment"

	err = repo.CreateComment(ctx, content, postID, createdUser1.ID, nil)
	assert.NoError(t, err)

	comments, err := repo.GetCommentsByID(ctx, postID)
	assert.NoError(t, err)
	assert.Len(t, comments, 1)

	commentID := comments[0].ID

	err = repo.AddReactionToComment(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)

	// Verify reaction was added
	comments, err = repo.GetCommentsByID(ctx, postID)
	assert.NoError(t, err)
	assert.Len(t, comments, 1)
	assert.Len(t, comments[0].Reactions, 1)
	assert.Equal(t, createdUser2.ID, comments[0].Reactions[0].UserID)
}

func TestCommentRepo_IsReactedByUser(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create users first
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

	postID := "post-456"
	content := "Test comment"

	err = repo.CreateComment(ctx, content, postID, createdUser1.ID, nil)
	assert.NoError(t, err)

	comments, err := repo.GetCommentsByID(ctx, postID)
	assert.NoError(t, err)
	assert.Len(t, comments, 1)

	commentID := comments[0].ID

	// Initially not reacted
	isReacted, err := repo.IsReactedByUser(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)
	assert.False(t, isReacted)

	// Add reaction
	err = repo.AddReactionToComment(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)

	// Now should be reacted
	isReacted, err = repo.IsReactedByUser(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)
	assert.True(t, isReacted)
}

func TestCommentRepo_DeleteReactionFromComment(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewCommentRepo(db, testutil.NewTestLogger())
	ctx := context.Background()

	// Create users first
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

	postID := "post-456"
	content := "Test comment"

	err = repo.CreateComment(ctx, content, postID, createdUser1.ID, nil)
	assert.NoError(t, err)

	comments, err := repo.GetCommentsByID(ctx, postID)
	assert.NoError(t, err)
	assert.Len(t, comments, 1)

	commentID := comments[0].ID

	// Add reaction
	err = repo.AddReactionToComment(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)

	// Verify reaction exists
	isReacted, err := repo.IsReactedByUser(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)
	assert.True(t, isReacted)

	// Delete reaction
	err = repo.DeleteReactionFromComment(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)

	// Verify reaction is gone
	isReacted, err = repo.IsReactedByUser(ctx, commentID, createdUser2.ID)
	assert.NoError(t, err)
	assert.False(t, isReacted)
}

