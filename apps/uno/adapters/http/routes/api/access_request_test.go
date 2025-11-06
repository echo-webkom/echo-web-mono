package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/ports/mocks"
	"uno/domain/services"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetAccessRequestsHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.AccessRequestRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				requests := []model.AccessRequest{
					testutil.NewFakeStruct[model.AccessRequest](),
				}
				mockRepo.EXPECT().
					GetAccessRequests(mock.Anything).
					Return(requests, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				mockRepo.EXPECT().
					GetAccessRequests(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockAccessRequestRepo := mocks.NewAccessRequestRepo(t)
			tt.setupMocks(mockAccessRequestRepo)

			accessRequestService := services.NewAccessRequestService(mockAccessRequestRepo)
			handler := api.GetAccessRequestsHandler(testutil.NewTestLogger(), accessRequestService)

			req := httptest.NewRequest(http.MethodGet, "/access-requests", nil)
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

