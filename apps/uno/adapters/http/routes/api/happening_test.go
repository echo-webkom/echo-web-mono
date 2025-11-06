package api_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/ports"
	"uno/domain/ports/mocks"
	"uno/domain/services"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetHappeningsHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.HappeningRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.HappeningRepo) {
				happenings := []model.Happening{
					testutil.NewFakeStruct[model.Happening](),
				}
				mockRepo.EXPECT().
					GetAllHappenings(mock.Anything).
					Return(happenings, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.HappeningRepo) {
				mockRepo.EXPECT().
					GetAllHappenings(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			tt.setupMocks(mockHappeningRepo)

			happeningService := services.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			handler := api.GetHappeningsHandler(testutil.NewTestLogger(), happeningService)

			req := httptest.NewRequest(http.MethodGet, "/happenings", nil)
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

func TestGetHappeningById(t *testing.T) {
	tests := []struct {
		name           string
		happeningID    string
		setupMocks     func(*mocks.HappeningRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:        "success",
			happeningID: "happening123",
			setupMocks: func(mockRepo *mocks.HappeningRepo) {
				happening := testutil.NewFakeStruct[model.Happening](func(h *model.Happening) {
					h.ID = "happening123"
				})
				mockRepo.EXPECT().
					GetHappeningById(mock.Anything, "happening123").
					Return(happening, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:        "missing id",
			happeningID: "",
			setupMocks:  func(mockRepo *mocks.HappeningRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:        "not found",
			happeningID: "happening123",
			setupMocks: func(mockRepo *mocks.HappeningRepo) {
				mockRepo.EXPECT().
					GetHappeningById(mock.Anything, "happening123").
					Return(model.Happening{}, errors.New("not found")).
					Once()
			},
			expectedStatus: http.StatusNotFound,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			tt.setupMocks(mockHappeningRepo)

			happeningService := services.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			handler := api.GetHappeningById(testutil.NewTestLogger(), happeningService)

			req := httptest.NewRequest(http.MethodGet, "/happenings/"+tt.happeningID, nil)
			req.SetPathValue("id", tt.happeningID)
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

func TestGetHappeningQuestions(t *testing.T) {
	tests := []struct {
		name           string
		happeningID    string
		setupMocks     func(*mocks.HappeningRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:        "success",
			happeningID: "happening123",
			setupMocks: func(mockRepo *mocks.HappeningRepo) {
				questions := []model.Question{
					testutil.NewFakeStruct[model.Question](),
				}
				mockRepo.EXPECT().
					GetHappeningQuestions(mock.Anything, "happening123").
					Return(questions, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:        "missing id",
			happeningID: "",
			setupMocks:  func(mockRepo *mocks.HappeningRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:        "error from repo",
			happeningID: "happening123",
			setupMocks: func(mockRepo *mocks.HappeningRepo) {
				mockRepo.EXPECT().
					GetHappeningQuestions(mock.Anything, "happening123").
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusNotFound,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			tt.setupMocks(mockHappeningRepo)

			happeningService := services.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			handler := api.GetHappeningQuestions(testutil.NewTestLogger(), happeningService)

			req := httptest.NewRequest(http.MethodGet, "/happenings/"+tt.happeningID+"/questions", nil)
			req.SetPathValue("id", tt.happeningID)
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

func TestRegisterForHappening(t *testing.T) {
	tests := []struct {
		name           string
		happeningID    string
		requestBody    services.RegisterRequest
		setupMocks     func(*mocks.HappeningRepo, *mocks.UserRepo, *mocks.RegistrationRepo, *mocks.BanInfoRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:        "success",
			happeningID: "happening123",
			requestBody: services.RegisterRequest{
				UserID:    "user123",
				Questions: []model.QuestionAnswer{},
			},
			setupMocks: func(mockHappeningRepo *mocks.HappeningRepo, mockUserRepo *mocks.UserRepo, mockRegistrationRepo *mocks.RegistrationRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				user := testutil.NewFakeStruct[model.User](func(u *model.User) {
					u.ID = "user123"
					degreeID := "degree123"
					year := 2
					u.DegreeID = &degreeID
					u.Year = &year
					u.HasReadTerms = true
				})
				happening := testutil.NewFakeStruct[model.Happening](func(h *model.Happening) {
					h.ID = "happening123"
					h.Type = "event" // Set type to avoid bedpres ban check
					now := time.Now().Add(-1 * time.Hour) // Set to 1 hour ago to ensure registration is open
					h.RegistrationStart = &now
					h.RegistrationEnd = nil // Ensure registration is not closed
				})
				mockUserRepo.EXPECT().
					GetUserByID(mock.Anything, "user123").
					Return(user, nil).
					Once()
				mockHappeningRepo.EXPECT().
					GetHappeningById(mock.Anything, "happening123").
					Return(happening, nil).
					Once()
				mockHappeningRepo.EXPECT().
					GetHappeningQuestions(mock.Anything, "happening123").
					Return([]model.Question{}, nil).
					Once()
				mockRegistrationRepo.EXPECT().
					GetByUserAndHappening(mock.Anything, "user123", "happening123").
					Return(nil, nil).
					Once()
				mockUserRepo.EXPECT().
					GetUserMemberships(mock.Anything, "user123").
					Return([]string{}, nil).
					Once()
				mockHappeningRepo.EXPECT().
					GetHappeningHostGroups(mock.Anything, "happening123").
					Return([]string{}, nil).
					Once()
				spotRange := testutil.NewFakeStruct[model.SpotRange](func(sr *model.SpotRange) {
					sr.MinYear = 1
					sr.MaxYear = 5
					sr.Spots = 10
				})
				spotRanges := []model.SpotRange{spotRange}
				mockHappeningRepo.EXPECT().
					GetHappeningSpotRanges(mock.Anything, "happening123").
					Return(spotRanges, nil).
					Once()
				mockRegistrationRepo.EXPECT().
					CreateRegistration(mock.Anything, "user123", "happening123", spotRanges, []string{}, false).
					Return(&model.Registration{}, false, nil).
					Once()
				// InsertAnswers is only called if len(req.Questions) > 0
				// Since we have no questions, it won't be called
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:        "missing happening id",
			happeningID: "",
			requestBody: services.RegisterRequest{
				UserID:    "user123",
				Questions: []model.QuestionAnswer{},
			},
			setupMocks:  func(mockHappeningRepo *mocks.HappeningRepo, mockUserRepo *mocks.UserRepo, mockRegistrationRepo *mocks.RegistrationRepo, mockBanInfoRepo *mocks.BanInfoRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:        "invalid json",
			happeningID: "happening123",
			requestBody: services.RegisterRequest{},
			setupMocks:  func(mockHappeningRepo *mocks.HappeningRepo, mockUserRepo *mocks.UserRepo, mockRegistrationRepo *mocks.RegistrationRepo, mockBanInfoRepo *mocks.BanInfoRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:        "validation failure returns 200",
			happeningID: "happening123",
			requestBody: services.RegisterRequest{
				UserID:    "user123",
				Questions: []model.QuestionAnswer{},
			},
			setupMocks: func(mockHappeningRepo *mocks.HappeningRepo, mockUserRepo *mocks.UserRepo, mockRegistrationRepo *mocks.RegistrationRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				user := testutil.NewFakeStruct[model.User](func(u *model.User) {
					u.ID = "user123"
					// User without complete profile - will fail validation
					// Explicitly set to nil to ensure IsProfileComplete() returns false
					u.DegreeID = nil
					u.Year = nil
					u.HasReadTerms = false
				})
				mockUserRepo.EXPECT().
					GetUserByID(mock.Anything, "user123").
					Return(user, nil).
					Once()
				// Service returns early after IsProfileComplete check, so no other mocks needed
			},
			expectedStatus: http.StatusOK, // Handler returns 200 even when Success: false
			expectError:    false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			tt.setupMocks(mockHappeningRepo, mockUserRepo, mockRegistrationRepo, mockBanInfoRepo)

			happeningService := services.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			handler := api.RegisterForHappening(testutil.NewTestLogger(), happeningService)

			var req *http.Request
			if tt.name == "invalid json" {
				req = httptest.NewRequest(http.MethodPost, "/happenings/"+tt.happeningID+"/register", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				req = httptest.NewRequest(http.MethodPost, "/happenings/"+tt.happeningID+"/register", bytes.NewReader(body))
			}
			req.SetPathValue("id", tt.happeningID)
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


func TestGetHappeningRegistrationsCount(t *testing.T) {
	mockHappeningRepo := mocks.NewHappeningRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	mockRegistrationRepo := mocks.NewRegistrationRepo(t)
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)

	happening := testutil.NewFakeStruct[model.Happening](func(h *model.Happening) {
		h.ID = "happening123"
	})
	mockHappeningRepo.EXPECT().
		GetHappeningById(mock.Anything, "happening123").
		Return(happening, nil).
		Once()
	mockHappeningRepo.EXPECT().
		GetHappeningSpotRanges(mock.Anything, "happening123").
		Return([]model.SpotRange{}, nil).
		Once()
	mockHappeningRepo.EXPECT().
		GetHappeningRegistrations(mock.Anything, "happening123").
		Return([]ports.HappeningRegistration{}, nil).
		Once()

	happeningService := services.NewHappeningService(
		mockHappeningRepo,
		mockUserRepo,
		mockRegistrationRepo,
		mockBanInfoRepo,
	)

	handler := api.GetHappeningRegistrationsCount(testutil.NewTestLogger(), happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/happening123/registrations/count", nil)
	req.SetPathValue("id", "happening123")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}

func TestGetHappeningRegistrationsCountMany(t *testing.T) {
	mockHappeningRepo := mocks.NewHappeningRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	mockRegistrationRepo := mocks.NewRegistrationRepo(t)
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)

	counts := []ports.GroupedRegistrationCount{}
	mockHappeningRepo.EXPECT().
		GetHappeningRegistrationCounts(mock.Anything, []string{"happening123", "happening456"}).
		Return(counts, nil).
		Once()

	happeningService := services.NewHappeningService(
		mockHappeningRepo,
		mockUserRepo,
		mockRegistrationRepo,
		mockBanInfoRepo,
	)

	handler := api.GetHappeningRegistrationsCountMany(testutil.NewTestLogger(), happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/registrations/count?id=happening123&id=happening456", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}

func TestGetHappeningRegistrations(t *testing.T) {
	mockHappeningRepo := mocks.NewHappeningRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	mockRegistrationRepo := mocks.NewRegistrationRepo(t)
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)

	registrations := []ports.HappeningRegistration{}
	mockHappeningRepo.EXPECT().
		GetHappeningRegistrations(mock.Anything, "happening123").
		Return(registrations, nil).
		Once()

	happeningService := services.NewHappeningService(
		mockHappeningRepo,
		mockUserRepo,
		mockRegistrationRepo,
		mockBanInfoRepo,
	)

	handler := api.GetHappeningRegistrations(testutil.NewTestLogger(), happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/happening123/registrations", nil)
	req.SetPathValue("id", "happening123")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}

func TestGetHappeningSpotRanges(t *testing.T) {
	mockHappeningRepo := mocks.NewHappeningRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	mockRegistrationRepo := mocks.NewRegistrationRepo(t)
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)

	spotRanges := []model.SpotRange{
		testutil.NewFakeStruct[model.SpotRange](),
	}
	mockHappeningRepo.EXPECT().
		GetHappeningSpotRanges(mock.Anything, "happening123").
		Return(spotRanges, nil).
		Once()

	happeningService := services.NewHappeningService(
		mockHappeningRepo,
		mockUserRepo,
		mockRegistrationRepo,
		mockBanInfoRepo,
	)

	handler := api.GetHappeningSpotRanges(testutil.NewTestLogger(), happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/happening123/spot-ranges", nil)
	req.SetPathValue("id", "happening123")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}
