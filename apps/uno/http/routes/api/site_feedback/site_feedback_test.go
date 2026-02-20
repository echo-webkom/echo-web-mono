package sitefeedback_test

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
	"uno/http/handler"
	sitefeedback "uno/http/routes/api/site_feedback"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetSiteFeedbacksHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.SiteFeedbackRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				feedbacks := []model.SiteFeedback{
					testutil.NewFakeStruct[model.SiteFeedback](),
				}
				mockRepo.EXPECT().
					GetAllSiteFeedbacks(mock.Anything).
					Return(feedbacks, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				mockRepo.EXPECT().
					GetAllSiteFeedbacks(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSiteFeedbackRepo := mocks.NewSiteFeedbackRepo(t)
			tt.setupMocks(mockSiteFeedbackRepo)

			siteFeedbackService := service.NewSiteFeedbackService(mockSiteFeedbackRepo)
			mux := sitefeedback.NewMux(testutil.NewTestLogger(), siteFeedbackService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestGetSiteFeedbackByIDHandler(t *testing.T) {
	tests := []struct {
		name           string
		feedbackID     string
		setupMocks     func(*mocks.SiteFeedbackRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:       "success",
			feedbackID: "feedback123",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				feedback := testutil.NewFakeStruct(func(f *model.SiteFeedback) {
					f.ID = "feedback123"
				})
				mockRepo.EXPECT().
					GetSiteFeedbackByID(mock.Anything, "feedback123").
					Return(feedback, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:       "missing id",
			feedbackID: "",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				// When ID is empty, route "/" matches GetAllSiteFeedbacks
				mockRepo.EXPECT().
					GetAllSiteFeedbacks(mock.Anything).
					Return([]model.SiteFeedback{}, nil).
					Once()
			},
			expectedStatus: http.StatusOK, // Gets all feedback instead
			expectError:    false,
		},
		{
			name:       "error from repo",
			feedbackID: "feedback123",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				mockRepo.EXPECT().
					GetSiteFeedbackByID(mock.Anything, "feedback123").
					Return(model.SiteFeedback{}, errors.New("not found")).
					Once()
			},
			expectedStatus: http.StatusNotFound,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSiteFeedbackRepo := mocks.NewSiteFeedbackRepo(t)
			tt.setupMocks(mockSiteFeedbackRepo)

			siteFeedbackService := service.NewSiteFeedbackService(mockSiteFeedbackRepo)
			mux := sitefeedback.NewMux(testutil.NewTestLogger(), siteFeedbackService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/"+tt.feedbackID, nil)
			r.SetPathValue("id", tt.feedbackID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestCreateSiteFeedbackHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    any
		useInvalidJSON bool
		setupMocks     func(*mocks.SiteFeedbackRepo)
		expectedStatus int
	}{
		{
			name: "success",
			requestBody: map[string]any{
				"name":     "Bob",
				"email":    "bob@example.com",
				"message":  "This is a test feedback",
				"category": "bug",
			},
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				mockRepo.EXPECT().
					CreateSiteFeedback(mock.Anything, mock.AnythingOfType("model.NewSiteFeedback")).
					Return(testutil.NewFakeStruct[model.SiteFeedback](), nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "invalid json",
			useInvalidJSON: true,
			setupMocks:     func(mockRepo *mocks.SiteFeedbackRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "error from repo",
			requestBody: map[string]any{
				"message":  "This is a test feedback",
				"category": "bug",
			},
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				mockRepo.EXPECT().
					CreateSiteFeedback(mock.Anything, mock.AnythingOfType("model.NewSiteFeedback")).
					Return(model.SiteFeedback{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSiteFeedbackRepo := mocks.NewSiteFeedbackRepo(t)
			tt.setupMocks(mockSiteFeedbackRepo)

			siteFeedbackService := service.NewSiteFeedbackService(mockSiteFeedbackRepo)
			mux := sitefeedback.NewMux(testutil.NewTestLogger(), siteFeedbackService, handler.NoMiddleware)

			var r *http.Request
			if tt.useInvalidJSON {
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

func TestMarkSiteFeedbackAsSeen(t *testing.T) {
	tests := []struct {
		name           string
		feedbackID     string
		setupMocks     func(*mocks.SiteFeedbackRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:       "success",
			feedbackID: "feedback123",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				mockRepo.EXPECT().
					MarkSiteFeedbackAsRead(mock.Anything, "feedback123").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:       "feedback not found",
			feedbackID: "nonexistent",
			setupMocks: func(mockRepo *mocks.SiteFeedbackRepo) {
				mockRepo.EXPECT().
					MarkSiteFeedbackAsRead(mock.Anything, "nonexistent").
					Return(errors.New("not found")).
					Once()
			},
			expectedStatus: http.StatusNotFound,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSiteFeedbackRepo := mocks.NewSiteFeedbackRepo(t)
			tt.setupMocks(mockSiteFeedbackRepo)

			siteFeedbackService := service.NewSiteFeedbackService(mockSiteFeedbackRepo)
			mux := sitefeedback.NewMux(testutil.NewTestLogger(), siteFeedbackService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodPut, "/"+tt.feedbackID+"/seen", nil)
			r.SetPathValue("id", tt.feedbackID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
