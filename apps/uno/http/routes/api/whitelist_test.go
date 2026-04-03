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

func TestGetWhitelistHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.WhitelistRepo)
		expectedStatus int
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
	}{
		{
			name:  "success",
			email: "test@example.com",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				whitelist := testutil.NewFakeStruct(func(w *model.Whitelist) {
					w.Email = "test@example.com"
				})
				mockRepo.EXPECT().
					GetWhitelistByEmail(mock.Anything, "test@example.com").
					Return(whitelist, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
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

func TestUpsertWhitelistHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    dto.CreateWhitelistRequest
		setupMocks     func(*mocks.WhitelistRepo)
		expectedStatus int
	}{
		{
			name: "success",
			requestBody: dto.CreateWhitelistRequest{
				Email:     "test@example.com",
				Reason:    "Granted access",
				ExpiresAt: testutil.NewFakeStruct[model.Whitelist]().ExpiresAt,
			},
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				mockRepo.EXPECT().
					UpsertWhitelist(mock.Anything, mock.Anything).
					Return(testutil.NewFakeStruct[model.Whitelist](), nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "invalid json",
			requestBody:    dto.CreateWhitelistRequest{},
			setupMocks:     func(mockRepo *mocks.WhitelistRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "error from repo",
			requestBody: dto.CreateWhitelistRequest{
				Email:     "test@example.com",
				Reason:    "Granted access",
				ExpiresAt: testutil.NewFakeStruct[model.Whitelist]().ExpiresAt,
			},
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				mockRepo.EXPECT().
					UpsertWhitelist(mock.Anything, mock.Anything).
					Return(model.Whitelist{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockWhitelistRepo := mocks.NewWhitelistRepo(t)
			tt.setupMocks(mockWhitelistRepo)

			whitelistService := service.NewWhitelistService(mockWhitelistRepo)
			mux := api.NewWhitelistMux(testutil.NewTestLogger(), whitelistService, handler.NoMiddleware)

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

func TestDeleteWhitelistByEmailHandler(t *testing.T) {
	tests := []struct {
		name           string
		email          string
		setupMocks     func(*mocks.WhitelistRepo)
		expectedStatus int
	}{
		{
			name:  "success",
			email: "test@example.com",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				mockRepo.EXPECT().
					DeleteWhitelistByEmail(mock.Anything, "test@example.com").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusNoContent,
		},
		{
			name:  "error from repo",
			email: "test@example.com",
			setupMocks: func(mockRepo *mocks.WhitelistRepo) {
				mockRepo.EXPECT().
					DeleteWhitelistByEmail(mock.Anything, "test@example.com").
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockWhitelistRepo := mocks.NewWhitelistRepo(t)
			tt.setupMocks(mockWhitelistRepo)

			whitelistService := service.NewWhitelistService(mockWhitelistRepo)
			mux := api.NewWhitelistMux(testutil.NewTestLogger(), whitelistService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.email, nil)
			r.SetPathValue("email", tt.email)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
