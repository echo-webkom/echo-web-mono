package api_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/services"
	"uno/infrastructure/postgres"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for comment tests
func setupCommentTest(t *testing.T) (*postgres.Database, *services.CommentService, *services.UserService) {
	db := postgres.SetupTestDB(t)
	commentRepo := postgres.NewCommentRepo(db, nil)
	userRepo := postgres.NewUserRepo(db, nil)
	commentService := services.NewCommentService(commentRepo)
	userService := services.NewUserService(userRepo)
	return db, commentService, userService
}

// Test getting comments by ID when none exist
func TestGetCommentsByIDHandler_Empty(t *testing.T) {
	db, commentService, _ := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetCommentsByIDHandler(nil, commentService)

	req := httptest.NewRequest(http.MethodGet, "/comments/post123", nil)
	req.SetPathValue("id", "post123")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}

// Test getting comments by ID with missing ID
func TestGetCommentsByIDHandler_MissingID(t *testing.T) {
	db, commentService, _ := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetCommentsByIDHandler(nil, commentService)

	req := httptest.NewRequest(http.MethodGet, "/comments/", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test creating a comment
func TestCreateCommentHandler_Success(t *testing.T) {
	db, commentService, userService := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create a user first
	user, _ := userService.UserRepo().CreateUser(ctx, model.User{
		Email: "test@example.com",
		Type:  "student",
	})

	handler := api.CreateCommentHandler(nil, commentService)

	requestBody := api.CreateCommentRequest{
		Content: "This is a test comment",
		PostID:  "post123",
		UserID:  user.ID,
	}

	body, _ := json.Marshal(requestBody)
	req := httptest.NewRequest(http.MethodPost, "/comments", bytes.NewReader(body))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var response map[string]bool
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.True(t, response["success"])
}

// Test creating a comment with invalid JSON
func TestCreateCommentHandler_InvalidJSON(t *testing.T) {
	db, commentService, _ := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.CreateCommentHandler(nil, commentService)

	req := httptest.NewRequest(http.MethodPost, "/comments", bytes.NewReader([]byte("invalid json")))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test reacting to a comment
func TestReactToCommentHandler_Success(t *testing.T) {
	db, commentService, userService := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create a user first
	user, _ := userService.UserRepo().CreateUser(ctx, model.User{
		Email: "test@example.com",
		Type:  "student",
	})

	// Create a comment
	_ = commentService.CommentRepo().CreateComment(ctx, "Test comment", "post123", user.ID, nil)

	// Get the comment to get its ID
	comments, _ := commentService.CommentRepo().GetCommentsByID(ctx, "post123")
	if len(comments) == 0 {
		t.Skip("No comments created")
	}
	commentID := comments[0].ID

	handler := api.ReactToCommentHandler(nil, commentService)

	requestBody := map[string]string{
		"comment_id": commentID,
		"user_id":    user.ID,
	}

	body, _ := json.Marshal(requestBody)
	req := httptest.NewRequest(http.MethodPost, "/comments/"+commentID+"/reaction", bytes.NewReader(body))
	req.SetPathValue("id", commentID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var response map[string]bool
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.True(t, response["success"])
}

// Test reacting to a comment with missing ID
func TestReactToCommentHandler_MissingID(t *testing.T) {
	db, commentService, _ := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.ReactToCommentHandler(nil, commentService)

	requestBody := map[string]string{
		"user_id": "user123",
	}

	body, _ := json.Marshal(requestBody)
	req := httptest.NewRequest(http.MethodPost, "/comments//reaction", bytes.NewReader(body))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test reacting to a comment with invalid JSON
func TestReactToCommentHandler_InvalidJSON(t *testing.T) {
	db, commentService, _ := setupCommentTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.ReactToCommentHandler(nil, commentService)

	req := httptest.NewRequest(http.MethodPost, "/comments/comment123/reaction", bytes.NewReader([]byte("invalid")))
	req.SetPathValue("id", "comment123")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}
