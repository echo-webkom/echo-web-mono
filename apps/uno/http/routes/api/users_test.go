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
	"uno/http/handler"
	"uno/http/router"
	"uno/http/routes/api"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func newUsersTestMux(t *testing.T, strikeService *service.StrikeService) *router.Mux {
	t.Helper()
	return api.NewUsersMux(testutil.NewTestLogger(), nil, nil, strikeService, handler.NoMiddleware, handler.NoMiddleware)
}

func TestGetUsersWithStrikeDetails(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.UserRepo)
		expectedStatus int
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []model.UserWithStrikeDetails{{}}
				mockRepo.EXPECT().
					GetUsersWithStrikeDetails(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				mockRepo.EXPECT().
					GetUsersWithStrikeDetails(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := newUsersTestMux(t, strikeService)

			r := httptest.NewRequest(http.MethodGet, "/with-strikes", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestAddStrikeHandler(t *testing.T) {
	tests := []struct {
		name           string
		userID         string
		requestBody    map[string]interface{}
		setupMocks     func(*mocks.DotRepo, *mocks.BanInfoRepo, *mocks.UserRepo)
		expectedStatus int
	}{
		{
			name:   "success",
			userID: "user-1",
			requestBody: map[string]interface{}{
				"count":                 1,
				"reason":                "rule break",
				"strikeExpiresInMonths": 1,
				"banExpiresInMonths":    1,
				"strikedBy":             "admin-1",
			},
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo, mockUserRepo *mocks.UserRepo) {
				mockUserRepo.EXPECT().
					GetUserByID(mock.Anything, "user-1").
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
				mockBanInfoRepo.EXPECT().
					GetBanInfoByUserID(mock.Anything, "user-1").
					Return(nil, nil).
					Once()
				mockUserRepo.EXPECT().
					GetUserWithStrikeDetailsByID(mock.Anything, "user-1").
					Return(&model.UserWithStrikeDetails{}, nil).
					Once()
				mockDotRepo.EXPECT().
					CreateDot(mock.Anything, mock.Anything).
					Return(testutil.NewFakeStruct[model.Dot](), nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:   "missing required fields",
			userID: "user-1",
			requestBody: map[string]interface{}{
				"count": 0,
			},
			setupMocks:     func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo, mockUserRepo *mocks.UserRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockDotRepo, mockBanInfoRepo, mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := newUsersTestMux(t, strikeService)

			body, _ := json.Marshal(tt.requestBody)
			r := httptest.NewRequest(http.MethodPost, "/"+tt.userID+"/strikes", bytes.NewReader(body))
			r.SetPathValue("id", tt.userID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestRemoveBanHandler(t *testing.T) {
	tests := []struct {
		name           string
		userID         string
		setupMocks     func(*mocks.BanInfoRepo)
		expectedStatus int
	}{
		{
			name:   "success",
			userID: "user-1",
			setupMocks: func(mockBanInfoRepo *mocks.BanInfoRepo) {
				mockBanInfoRepo.EXPECT().
					DeleteBanByUserID(mock.Anything, "user-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "missing user id",
			userID:         "",
			setupMocks:     func(mockBanInfoRepo *mocks.BanInfoRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockBanInfoRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := newUsersTestMux(t, strikeService)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.userID+"/ban", nil)
			r.SetPathValue("id", tt.userID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestRemoveStrikeHandler(t *testing.T) {
	tests := []struct {
		name           string
		userID         string
		strikeID       string
		setupMocks     func(*mocks.DotRepo)
		expectedStatus int
	}{
		{
			name:     "success",
			userID:   "user-1",
			strikeID: "12",
			setupMocks: func(mockDotRepo *mocks.DotRepo) {
				mockDotRepo.EXPECT().
					DeleteDotByIDAndUserID(mock.Anything, 12, "user-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "missing user id",
			userID:         "",
			strikeID:       "12",
			setupMocks:     func(mockDotRepo *mocks.DotRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockDotRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := newUsersTestMux(t, strikeService)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.userID+"/strikes/"+tt.strikeID, nil)
			r.SetPathValue("id", tt.userID)
			r.SetPathValue("strikeId", tt.strikeID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
