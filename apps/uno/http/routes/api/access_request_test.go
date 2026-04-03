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
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockAccessRequestRepo := mocks.NewAccessRequestRepo(t)
			tt.setupMocks(mockAccessRequestRepo)

			accessRequestService := service.NewAccessRequestService(mockAccessRequestRepo)
			mux := api.NewAccessRequestMux(testutil.NewTestLogger(), accessRequestService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestCreateAccessRequestHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    map[string]string
		setupMocks     func(*mocks.AccessRequestRepo)
		expectedStatus int
	}{
		{
			name: "success",
			requestBody: map[string]string{
				"email":  "test@example.com",
				"reason": "I need access to the system",
			},
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				mockRepo.EXPECT().
					CreateAccessRequest(mock.Anything, model.NewAccessRequest{
						Email:  "test@example.com",
						Reason: "I need access to the system",
					}).
					Return(testutil.NewFakeStruct[model.AccessRequest](), nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "invalid json",
			requestBody:    nil,
			setupMocks:     func(mockRepo *mocks.AccessRequestRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "error from repo",
			requestBody: map[string]string{
				"email":  "test@example.com",
				"reason": "I need access to the system",
			},
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				mockRepo.EXPECT().
					CreateAccessRequest(mock.Anything, model.NewAccessRequest{
						Email:  "test@example.com",
						Reason: "I need access to the system",
					}).
					Return(model.AccessRequest{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockAccessRequestRepo := mocks.NewAccessRequestRepo(t)
			tt.setupMocks(mockAccessRequestRepo)

			accessRequestService := service.NewAccessRequestService(mockAccessRequestRepo)
			mux := api.NewAccessRequestMux(testutil.NewTestLogger(), accessRequestService, handler.NoMiddleware)

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

func TestDeleteAccessRequestHandler(t *testing.T) {
	tests := []struct {
		name           string
		id             string
		setupMocks     func(*mocks.AccessRequestRepo)
		expectedStatus int
	}{
		{
			name: "success",
			id:   "request-1",
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				mockRepo.EXPECT().
					GetAccessRequestByID(mock.Anything, "request-1").
					Return(testutil.NewFakeStruct[model.AccessRequest](), nil).
					Once()
				mockRepo.EXPECT().
					DeleteAccessRequestByID(mock.Anything, "request-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "not found",
			id:   "request-1",
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				mockRepo.EXPECT().
					GetAccessRequestByID(mock.Anything, "request-1").
					Return(model.AccessRequest{}, errors.New("sql: no rows in result set")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
		{
			name: "delete fails",
			id:   "request-1",
			setupMocks: func(mockRepo *mocks.AccessRequestRepo) {
				mockRepo.EXPECT().
					GetAccessRequestByID(mock.Anything, "request-1").
					Return(testutil.NewFakeStruct[model.AccessRequest](), nil).
					Once()
				mockRepo.EXPECT().
					DeleteAccessRequestByID(mock.Anything, "request-1").
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockAccessRequestRepo := mocks.NewAccessRequestRepo(t)
			tt.setupMocks(mockAccessRequestRepo)

			accessRequestService := service.NewAccessRequestService(mockAccessRequestRepo)
			mux := api.NewAccessRequestMux(testutil.NewTestLogger(), accessRequestService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.id, nil)
			r.SetPathValue("id", tt.id)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
