package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/routes/api"
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

			accessRequestService := service.NewAccessRequestService(mockAccessRequestRepo)
			h := api.GetAccessRequestsHandler(testutil.NewTestLogger(), accessRequestService)

			r := httptest.NewRequest(http.MethodGet, "/access-requests", nil)
			w := httptest.NewRecorder()

			ctx := handler.NewContext(w, r)
			err := h(ctx)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
			assert.Equal(t, tt.expectedStatus, ctx.Status())
		})
	}
}
