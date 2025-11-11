package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/ports/mocks"
	"uno/domain/service"
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
			handler := api.GetWhitelistHandler(testutil.NewTestLogger(), whitelistService)

			req := httptest.NewRequest(http.MethodGet, "/whitelist", nil)
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
			name:           "missing email",
			email:          "",
			setupMocks:     func(mockRepo *mocks.WhitelistRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
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
			handler := api.GetWhitelistByEmailHandler(testutil.NewTestLogger(), whitelistService)

			req := httptest.NewRequest(http.MethodGet, "/whitelist/"+tt.email, nil)
			req.SetPathValue("email", tt.email)
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
