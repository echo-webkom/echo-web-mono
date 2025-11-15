package api_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/routes/api"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetCommentsByIDHandler(t *testing.T) {
	tests := []struct {
		name           string
		commentID      string
		setupMocks     func(*mocks.CommentRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:      "success",
			commentID: "comment123",
			setupMocks: func(mockRepo *mocks.CommentRepo) {
				comments := []model.CommentAggregate{}
				mockRepo.EXPECT().
					GetCommentsByID(mock.Anything, "comment123").
					Return(comments, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:           "missing id",
			commentID:      "",
			setupMocks:     func(mockRepo *mocks.CommentRepo) {},
			expectedStatus: http.StatusMethodNotAllowed,
			expectError:    false,
		},
		{
			name:      "error from repo",
			commentID: "comment123",
			setupMocks: func(mockRepo *mocks.CommentRepo) {
				mockRepo.EXPECT().
					GetCommentsByID(mock.Anything, "comment123").
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockCommentRepo := mocks.NewCommentRepo(t)
			tt.setupMocks(mockCommentRepo)

			commentService := service.NewCommentService(mockCommentRepo)
			mux := api.NewCommentMux(testutil.NewTestLogger(), commentService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/"+tt.commentID, nil)
			r.SetPathValue("id", tt.commentID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestCreateCommentHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    dto.CreateCommentRequest
		setupMocks     func(*mocks.CommentRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			requestBody: dto.CreateCommentRequest{
				Content:         "Test comment",
				PostID:          "post123",
				UserID:          "user123",
				ParentCommentID: nil,
			},
			setupMocks: func(mockRepo *mocks.CommentRepo) {
				mockRepo.EXPECT().
					CreateComment(mock.Anything, "Test comment", "post123", "user123", (*string)(nil)).
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:           "invalid json",
			requestBody:    dto.CreateCommentRequest{},
			setupMocks:     func(mockRepo *mocks.CommentRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name: "error from repo",
			requestBody: dto.CreateCommentRequest{
				Content:         "Test comment",
				PostID:          "post123",
				UserID:          "user123",
				ParentCommentID: nil,
			},
			setupMocks: func(mockRepo *mocks.CommentRepo) {
				mockRepo.EXPECT().
					CreateComment(mock.Anything, "Test comment", "post123", "user123", (*string)(nil)).
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockCommentRepo := mocks.NewCommentRepo(t)
			tt.setupMocks(mockCommentRepo)

			commentService := service.NewCommentService(mockCommentRepo)
			mux := api.NewCommentMux(testutil.NewTestLogger(), commentService, handler.NoMiddleware)

			var r *http.Request
			if tt.name == "invalid json" {
				r = httptest.NewRequest(http.MethodPost, "/", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				r = httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
			}
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestReactToCommentHandler(t *testing.T) {
	tests := []struct {
		name           string
		commentID      string
		requestBody    dto.ReactToCommentRequest
		setupMocks     func(*mocks.CommentRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:      "success",
			commentID: "comment123",
			requestBody: dto.ReactToCommentRequest{
				CommentID: "comment123",
				UserID:    "user123",
			},
			setupMocks: func(mockRepo *mocks.CommentRepo) {
				mockRepo.EXPECT().
					IsReactedByUser(mock.Anything, "comment123", "user123").
					Return(false, nil).
					Once()
				mockRepo.EXPECT().
					AddReactionToComment(mock.Anything, "comment123", "user123").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:           "missing comment id",
			commentID:      "",
			requestBody:    dto.ReactToCommentRequest{},
			setupMocks:     func(mockRepo *mocks.CommentRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    false,
		},
		{
			name:           "invalid json",
			commentID:      "comment123",
			requestBody:    dto.ReactToCommentRequest{},
			setupMocks:     func(mockRepo *mocks.CommentRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:      "error from service",
			commentID: "comment123",
			requestBody: dto.ReactToCommentRequest{
				CommentID: "comment123",
				UserID:    "user123",
			},
			setupMocks: func(mockRepo *mocks.CommentRepo) {
				mockRepo.EXPECT().
					IsReactedByUser(mock.Anything, "comment123", "user123").
					Return(false, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockCommentRepo := mocks.NewCommentRepo(t)
			tt.setupMocks(mockCommentRepo)

			commentService := service.NewCommentService(mockCommentRepo)
			mux := api.NewCommentMux(testutil.NewTestLogger(), commentService, handler.NoMiddleware)

			var r *http.Request
			if tt.name == "invalid json" {
				r = httptest.NewRequest(http.MethodGet, "/"+tt.commentID+"/reaction", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				r = httptest.NewRequest(http.MethodGet, "/"+tt.commentID+"/reaction", bytes.NewReader(body))
			}
			r.SetPathValue("id", tt.commentID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
