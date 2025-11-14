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

func TestGetWhitelistHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.WhitelistRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				whitelist := []model.Whitelist{
					testutil.NewFakeStruct[model.Whitelist](),
				}
				mockRepo.EXPECT().
					GetWhitelist(mock.Anything).
					Return(whitelist, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				mockRepo.EXPECT().
					GetWhitelist(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockWhitelistRepo := mocks.NewWhitelistRepo(t)
			tt.setupMocks(mockWhitelistRepo)

			whitelistService := service.NewWhitelistService(mockWhitelistRepo)
			mux := api.NewWhitelistMux(testutil.NewTestLogger(), whitelistService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestGetWhitelistByEmailHandler(t *testing.T) {
	tests := []struct {
		name           string
		email          string
		setupMocks     func(*mocks.WhitelistRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:  "success",
			email: "test@example.com",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				whitelist := testutil.NewFakeStruct[model.Whitelist](func(w *model.Whitelist) {
					w.Email = "test@example.com"
				})
				mockRepo.EXPECT().
					GetWhitelistByEmail(mock.Anything, "test@example.com").
					Return(whitelist, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:  "missing email",
			email: "",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				// When email is empty, route "/" matches GetWhitelist
				mockRepo.EXPECT().
					GetWhitelist(mock.Anything).
					Return([]model.Whitelist{}, nil).
					Once()
			},
			expectedStatus: http.StatusOK, // Gets all whitelist instead
			expectError:    false,
		},
		{
			name:  "error from repo",
			email: "test@example.com",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				mockRepo.EXPECT().
					GetWhitelistByEmail(mock.Anything, "test@example.com").
					Return(model.Whitelist{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockWhitelistRepo := mocks.NewWhitelistRepo(t)
			tt.setupMocks(mockWhitelistRepo)

			whitelistService := service.NewWhitelistService(mockWhitelistRepo)
			mux := api.NewWhitelistMux(testutil.NewTestLogger(), whitelistService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/"+tt.email, nil)
			r.SetPathValue("email", tt.email)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
