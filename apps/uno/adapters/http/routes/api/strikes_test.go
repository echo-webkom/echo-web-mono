package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/ports"
	"uno/domain/ports/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUnbanUsersWithExpiredStrikesHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.DotRepo, *mocks.BanInfoRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				mockDotRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(nil).
					Once()
				mockBanInfoRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from dot repo",
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				mockDotRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
		{
			name: "error from ban info repo",
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				mockDotRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(nil).
					Once()
				mockBanInfoRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockDotRepo, mockBanInfoRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			handler := api.UnbanUsersWithExpiredStrikesHandler(testutil.NewTestLogger(), strikeService)

			req := httptest.NewRequest(http.MethodPost, "/strikes/unban", nil)
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

func TestGetUsersWithStrikesHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.UserRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []ports.UserWithStrikes{
					{},
				}
				mockRepo.EXPECT().
					GetUsersWithStrikes(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				mockRepo.EXPECT().
					GetUsersWithStrikes(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			handler := api.GetUsersWithStrikesHandler(testutil.NewTestLogger(), strikeService)

			req := httptest.NewRequest(http.MethodGet, "/strikes/users", nil)
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

func TestGetBannedUsers(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.UserRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []ports.UserWithBanInfo{
					{},
				}
				mockRepo.EXPECT().
					GetBannedUsers(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				mockRepo.EXPECT().
					GetBannedUsers(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			handler := api.GetBannedUsers(testutil.NewTestLogger(), strikeService)

			req := httptest.NewRequest(http.MethodGet, "/strikes/banned", nil)
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
