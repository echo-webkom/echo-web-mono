package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
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
			handler := api.GetSiteFeedbacksHandler(testutil.NewTestLogger(), siteFeedbackService)

			req := httptest.NewRequest(http.MethodGet, "/feedbacks", nil)
			w := httptest.NewRecorder()

			status, err := handler(w, req)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
			assert.Equal(t, tt.expectedStatus, status)
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
				feedback := testutil.NewFakeStruct[model.SiteFeedback](func(f *model.SiteFeedback) {
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
			name:           "missing id",
			feedbackID:     "",
			setupMocks:     func(mockRepo *mocks.SiteFeedbackRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
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
			handler := api.GetSiteFeedbackByIDHandler(testutil.NewTestLogger(), siteFeedbackService)

			req := httptest.NewRequest(http.MethodGet, "/feedbacks/"+tt.feedbackID, nil)
			req.SetPathValue("id", tt.feedbackID)
			w := httptest.NewRecorder()

			status, err := handler(w, req)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
			assert.Equal(t, tt.expectedStatus, status)
		})
	}
}
