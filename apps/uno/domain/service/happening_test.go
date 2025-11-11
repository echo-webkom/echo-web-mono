package service_test

import (
	"context"
	"encoding/json"
	"errors"
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestHappeningService_HappeningRepo(t *testing.T) {
	mockHappeningRepo := mocks.NewHappeningRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	mockRegistrationRepo := mocks.NewRegistrationRepo(t)
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)

	happeningService := service.NewHappeningService(
		mockHappeningRepo,
		mockUserRepo,
		mockRegistrationRepo,
		mockBanInfoRepo,
	)

	happeningRepo := happeningService.HappeningRepo()
	assert.NotNil(t, happeningRepo)
}

func TestHappeningService_Register_ErrorCases(t *testing.T) {
	ctx := context.Background()
	happeningID := "happening123"
	userID := "user456"

	completeUser := testutil.NewFakeStruct(func(u *model.User) {
		u.ID = userID
		degreeID := "degree123"
		year := 2
		u.DegreeID = &degreeID
		u.Year = &year
		u.HasReadTerms = true
	})

	tests := []struct {
		name            string
		setupMocks      func(*mocks.HappeningRepo, *mocks.UserRepo, *mocks.RegistrationRepo, *mocks.BanInfoRepo)
		expectedErr     error
		expectedMsg     string
		expectedSuccess bool
	}{
		{
			name: "UserNotFound",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(model.User{}, errors.New("user not found")).Once()
			},
			expectedErr:     errors.New("user not found"),
			expectedMsg:     "Brukeren finnes ikke",
			expectedSuccess: false,
		},
		{
			name: "ProfileIncomplete",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				incompleteUser := testutil.NewFakeStruct(func(u *model.User) {
					u.ID = userID
					u.DegreeID = nil
					u.Year = nil
					u.HasReadTerms = false
				})
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(incompleteUser, nil).Once()
			},
			expectedMsg:     "Du må ha fylt ut studieinformasjon for å kunne registrere deg",
			expectedSuccess: false,
		},
		{
			name: "HappeningNotFound",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(model.Happening{}, errors.New("happening not found")).Once()
			},
			expectedErr:     errors.New("happening not found"),
			expectedMsg:     "Arrangementet finnes ikke",
			expectedSuccess: false,
		},
		{
			name: "GetQuestionsError",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "event"
				})
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return(nil, errors.New("questions error")).Once()
			},
			expectedErr:     errors.New("questions error"),
			expectedMsg:     "Kunne ikke hente spørsmål",
			expectedSuccess: false,
		},
		{
			name: "UserBanned",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "bedpres"
				})
				banInfo := testutil.NewFakeStruct(func(b *model.BanInfo) {
					expiresAt := time.Now().Add(24 * time.Hour)
					b.ExpiresAt = expiresAt
				})
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
				br.EXPECT().GetBanInfoByUserID(mock.Anything, userID).Return(&banInfo, nil).Once()
			},
			expectedMsg:     "Du er bannet",
			expectedSuccess: false,
		},
		{
			name: "AlreadyRegistered",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "event"
				})
				existingReg := testutil.NewFakeStruct(func(r *model.Registration) {
					r.Status = model.RegistrationStatusRegistered
				})
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
				rr.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(&existingReg, nil).Once()
			},
			expectedMsg:     "Du er allerede påmeldt dette arrangementet",
			expectedSuccess: false,
		},
		{
			name: "AlreadyWaitlisted",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "event"
				})
				existingReg := testutil.NewFakeStruct(func(r *model.Registration) {
					r.Status = model.RegistrationStatusWaitlisted
				})
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
				rr.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(&existingReg, nil).Once()
			},
			expectedMsg:     "Du er allerede på venteliste til dette arrangementet",
			expectedSuccess: false,
		},
		{
			name: "GetSpotRangesError",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "event"
					registrationStart := time.Now().Add(-1 * time.Hour)
					h.RegistrationStart = &registrationStart
					h.RegistrationEnd = nil
				})
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
				rr.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(nil, nil).Once()
				ur.EXPECT().GetUserMemberships(mock.Anything, userID).Return([]string{}, nil).Once()
				hr.EXPECT().GetHappeningSpotRanges(mock.Anything, happeningID).Return(nil, errors.New("failed to get spot ranges")).Once()
			},
			expectedErr:     errors.New("failed to get spot ranges"),
			expectedMsg:     "Kunne ikke hente plasser",
			expectedSuccess: false,
		},
		{
			name: "UserNotEligible",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				userNotEligible := testutil.NewFakeStruct(func(u *model.User) {
					u.ID = userID
					degreeID := "degree123"
					year := 5
					u.DegreeID = &degreeID
					u.Year = &year
					u.HasReadTerms = true
				})
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "event"
					registrationStart := time.Now().Add(-1 * time.Hour)
					h.RegistrationStart = &registrationStart
					h.RegistrationEnd = nil
				})
				spotRanges := []model.SpotRange{
					{
						ID:          "spot1",
						HappeningID: happeningID,
						Spots:       10,
						MinYear:     1,
						MaxYear:     3,
					},
				}
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(userNotEligible, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
				rr.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(nil, nil).Once()
				ur.EXPECT().GetUserMemberships(mock.Anything, userID).Return([]string{}, nil).Once()
				hr.EXPECT().GetHappeningSpotRanges(mock.Anything, happeningID).Return(spotRanges, nil).Once()
				hr.EXPECT().GetHappeningHostGroups(mock.Anything, happeningID).Return([]string{}, nil).Once()
			},
			expectedMsg:     "Du kan ikke melde deg på dette arrangementet",
			expectedSuccess: false,
		},
		{
			name: "CreateRegistrationError",
			setupMocks: func(hr *mocks.HappeningRepo, ur *mocks.UserRepo, rr *mocks.RegistrationRepo, br *mocks.BanInfoRepo) {
				happening := testutil.NewFakeStruct(func(h *model.Happening) {
					h.ID = happeningID
					h.Type = "event"
					registrationStart := time.Now().Add(-1 * time.Hour)
					h.RegistrationStart = &registrationStart
					h.RegistrationEnd = nil
				})
				spotRanges := []model.SpotRange{
					{
						ID:          "spot1",
						HappeningID: happeningID,
						Spots:       10,
						MinYear:     1,
						MaxYear:     3,
					},
				}
				ur.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
				hr.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
				hr.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
				rr.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(nil, nil).Once()
				ur.EXPECT().GetUserMemberships(mock.Anything, userID).Return([]string{}, nil).Once()
				hr.EXPECT().GetHappeningSpotRanges(mock.Anything, happeningID).Return(spotRanges, nil).Once()
				hr.EXPECT().GetHappeningHostGroups(mock.Anything, happeningID).Return([]string{}, nil).Once()
				rr.EXPECT().CreateRegistration(mock.Anything, userID, happeningID, spotRanges, []string{}, false).Return(nil, false, errors.New("failed to create registration")).Once()
			},
			expectedErr:     errors.New("failed to create registration"),
			expectedMsg:     "Kunne ikke registrere deg",
			expectedSuccess: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			tt.setupMocks(mockHappeningRepo, mockUserRepo, mockRegistrationRepo, mockBanInfoRepo)

			happeningService := service.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			questions := []model.QuestionAnswer{}
			response, err := happeningService.Register(ctx, userID, happeningID, questions)

			if tt.expectedErr != nil {
				assert.Error(t, err)
				assert.Equal(t, tt.expectedErr, err)
			} else {
				assert.NoError(t, err)
			}
			assert.NotNil(t, response)
			assert.Equal(t, tt.expectedSuccess, response.Success)
			assert.Equal(t, tt.expectedMsg, response.Message)
		})
	}
}

func TestHappeningService_Register_RegistrationWindow(t *testing.T) {
	ctx := context.Background()
	happeningID := "happening123"
	userID := "user456"

	completeUser := testutil.NewFakeStruct(func(u *model.User) {
		u.ID = userID
		degreeID := "degree123"
		year := 2
		u.DegreeID = &degreeID
		u.Year = &year
		u.HasReadTerms = true
	})

	tests := []struct {
		name           string
		setupHappening func(*model.Happening)
		expectedMsg    string
	}{
		{
			name: "RegistrationNotStarted",
			setupHappening: func(h *model.Happening) {
				registrationStart := time.Now().Add(24 * time.Hour)
				h.RegistrationStart = &registrationStart
			},
			expectedMsg: "Påmeldingen har ikke startet",
		},
		{
			name: "RegistrationClosed",
			setupHappening: func(h *model.Happening) {
				registrationStart := time.Now().Add(-24 * time.Hour)
				registrationEnd := time.Now().Add(-1 * time.Hour)
				h.RegistrationStart = &registrationStart
				h.RegistrationEnd = &registrationEnd
			},
			expectedMsg: "Påmeldingen har allerede stengt",
		},
		{
			name: "NoRegistrationStart",
			setupHappening: func(h *model.Happening) {
				h.RegistrationStart = nil
			},
			expectedMsg: "Påmelding er bare for inviterte undergrupper",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			happening := testutil.NewFakeStruct(func(h *model.Happening) {
				h.ID = happeningID
				h.Type = "event"
				tt.setupHappening(h)
			})

			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			mockUserRepo.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
			mockRegistrationRepo.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(nil, nil).Once()
			mockUserRepo.EXPECT().GetUserMemberships(mock.Anything, userID).Return([]string{}, nil).Once()

			happeningService := service.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			questions := []model.QuestionAnswer{}
			response, err := happeningService.Register(ctx, userID, happeningID, questions)

			assert.NoError(t, err)
			assert.NotNil(t, response)
			assert.False(t, response.Success)
			assert.Equal(t, tt.expectedMsg, response.Message)
		})
	}
}

func TestHappeningService_Register_QuestionValidation(t *testing.T) {
	ctx := context.Background()
	happeningID := "happening123"
	userID := "user456"

	completeUser := testutil.NewFakeStruct(func(u *model.User) {
		u.ID = userID
		degreeID := "degree123"
		year := 2
		u.DegreeID = &degreeID
		u.Year = &year
		u.HasReadTerms = true
	})

	happening := testutil.NewFakeStruct(func(h *model.Happening) {
		h.ID = happeningID
		h.Type = "event"
		registrationStart := time.Now().Add(-1 * time.Hour)
		h.RegistrationStart = &registrationStart
		h.RegistrationEnd = nil
	})

	spotRanges := []model.SpotRange{
		{
			ID:          "spot1",
			HappeningID: happeningID,
			Spots:       10,
			MinYear:     1,
			MaxYear:     3,
		},
	}

	tests := []struct {
		name        string
		questions   []model.Question
		answers     []model.QuestionAnswer
		expectedMsg string
	}{
		{
			name: "RequiredQuestionNotAnswered",
			questions: []model.Question{
				{ID: "q1", Required: true, Type: "text"},
			},
			answers:     []model.QuestionAnswer{},
			expectedMsg: "Du må svare på alle spørsmålene",
		},
		{
			name: "InvalidAnswerFormat",
			questions: []model.Question{
				{ID: "q1", Required: true, Type: "text"},
			},
			answers: []model.QuestionAnswer{
				{QuestionID: "q1", Answer: json.RawMessage(`invalid json`)},
			},
			expectedMsg: "Du må svare på alle spørsmålene",
		},
		{
			name: "EmptyRequiredTextAnswer",
			questions: []model.Question{
				{ID: "q1", Required: true, Type: "text"},
			},
			answers: []model.QuestionAnswer{
				{QuestionID: "q1", Answer: json.RawMessage(`""`)},
			},
			expectedMsg: "Du må svare på alle spørsmålene",
		},
		{
			name: "EmptyRequiredCheckboxAnswer",
			questions: []model.Question{
				{ID: "q1", Required: true, Type: "checkbox"},
			},
			answers: []model.QuestionAnswer{
				{QuestionID: "q1", Answer: json.RawMessage(`[]`)},
			},
			expectedMsg: "Du må svare på alle spørsmålene",
		},
		{
			name: "InvalidQuestionType",
			questions: []model.Question{
				{ID: "q1", Required: true, Type: "invalid_type"},
			},
			answers: []model.QuestionAnswer{
				{QuestionID: "q1", Answer: json.RawMessage(`"answer"`)},
			},
			expectedMsg: "Du må svare på alle spørsmålene",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			mockUserRepo.EXPECT().GetUserByID(mock.Anything, userID).Return(completeUser, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(happening, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return(tt.questions, nil).Once()
			mockRegistrationRepo.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(nil, nil).Once()
			mockUserRepo.EXPECT().GetUserMemberships(mock.Anything, userID).Return([]string{}, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningSpotRanges(mock.Anything, happeningID).Return(spotRanges, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningHostGroups(mock.Anything, happeningID).Return([]string{}, nil).Once()

			happeningService := service.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			questions := []model.QuestionAnswer{}
			response, err := happeningService.Register(ctx, userID, happeningID, questions)

			assert.NoError(t, err)
			assert.NotNil(t, response)
			assert.False(t, response.Success)
			assert.Equal(t, tt.expectedMsg, response.Message)
		})
	}
}

func TestHappeningService_Register_Success(t *testing.T) {
	ctx := context.Background()
	happeningID := "happening123"
	userID := "user456"

	spotRanges := []model.SpotRange{
		{
			ID:          "spot1",
			HappeningID: happeningID,
			Spots:       10,
			MinYear:     1,
			MaxYear:     3,
		},
	}

	tests := []struct {
		name               string
		isWaitlisted       bool
		expectedMsg        string
		expectedWaitlisted bool
		userMemberships    []string
		registrationStart  *time.Time
		registrationGroups *json.RawMessage
		hostGroups         []string
		userYear           *int
		spotRanges         []model.SpotRange
		canSkipExpected    bool
	}{
		{
			name:               "Registered",
			isWaitlisted:       false,
			expectedMsg:        "Du er nå påmeldt arrangementet",
			expectedWaitlisted: false,
			userMemberships:    []string{},
			registrationStart:  nil,
			registrationGroups: nil,
			hostGroups:         []string{},
			userYear:           intPtr(2),
			spotRanges:         spotRanges,
			canSkipExpected:    false,
		},
		{
			name:               "Waitlisted",
			isWaitlisted:       true,
			expectedMsg:        "Du er nå på venteliste",
			expectedWaitlisted: true,
			userMemberships:    []string{},
			registrationStart:  nil,
			registrationGroups: nil,
			hostGroups:         []string{},
			userYear:           intPtr(2),
			spotRanges:         spotRanges,
			canSkipExpected:    false,
		},
		{
			name:               "EarlyRegistrationWithMatchingGroup",
			isWaitlisted:       false,
			expectedMsg:        "Du er nå påmeldt arrangementet",
			expectedWaitlisted: false,
			userMemberships:    []string{"group123"},
			registrationStart:  nil,
			registrationGroups: func() *json.RawMessage {
				groupID := "group123"
				groupsJSON := json.RawMessage(`["` + groupID + `"]`)
				return &groupsJSON
			}(),
			hostGroups:      []string{},
			userYear:        intPtr(2),
			spotRanges:      spotRanges,
			canSkipExpected: false,
		},
		{
			name:               "HostCanSkipSpotRangeCheck",
			isWaitlisted:       false,
			expectedMsg:        "Du er nå påmeldt arrangementet",
			expectedWaitlisted: false,
			userMemberships:    []string{"hostGroup"},
			registrationStart:  nil,
			registrationGroups: nil,
			hostGroups:         []string{"hostGroup"},
			userYear:           intPtr(5), // User doesn't fit in spot range (1-3)
			spotRanges: []model.SpotRange{
				{
					ID:          "spot1",
					HappeningID: happeningID,
					Spots:       10,
					MinYear:     1,
					MaxYear:     3,
				},
			},
			canSkipExpected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			testUser := testutil.NewFakeStruct(func(u *model.User) {
				u.ID = userID
				degreeID := "degree123"
				u.DegreeID = &degreeID
				u.Year = tt.userYear
				u.HasReadTerms = true
			})

			testHappening := testutil.NewFakeStruct(func(h *model.Happening) {
				h.ID = happeningID
				h.Type = "event"
				if tt.registrationStart != nil {
					h.RegistrationStart = tt.registrationStart
				} else {
					registrationStart := time.Now().Add(-1 * time.Hour)
					h.RegistrationStart = &registrationStart
				}
				h.RegistrationEnd = nil
				if tt.registrationGroups != nil {
					h.RegistrationGroups = tt.registrationGroups
				}
			})

			testSpotRanges := tt.spotRanges
			if len(testSpotRanges) == 0 {
				testSpotRanges = spotRanges
			}

			registration := testutil.NewFakeStruct(func(r *model.Registration) {
				r.UserID = userID
				r.HappeningID = happeningID
				if tt.isWaitlisted {
					r.Status = model.RegistrationStatusWaitlisted
				} else {
					r.Status = model.RegistrationStatusRegistered
				}
			})

			mockHappeningRepo := mocks.NewHappeningRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			mockRegistrationRepo := mocks.NewRegistrationRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)

			mockUserRepo.EXPECT().GetUserByID(mock.Anything, userID).Return(testUser, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningById(mock.Anything, happeningID).Return(testHappening, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningQuestions(mock.Anything, happeningID).Return([]model.Question{}, nil).Once()
			mockRegistrationRepo.EXPECT().GetByUserAndHappening(mock.Anything, userID, happeningID).Return(nil, nil).Once()
			mockUserRepo.EXPECT().GetUserMemberships(mock.Anything, userID).Return(tt.userMemberships, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningSpotRanges(mock.Anything, happeningID).Return(testSpotRanges, nil).Once()
			mockHappeningRepo.EXPECT().GetHappeningHostGroups(mock.Anything, happeningID).Return(tt.hostGroups, nil).Once()
			mockRegistrationRepo.EXPECT().CreateRegistration(mock.Anything, userID, happeningID, testSpotRanges, tt.hostGroups, tt.canSkipExpected).Return(&registration, tt.isWaitlisted, nil).Once()

			happeningService := service.NewHappeningService(
				mockHappeningRepo,
				mockUserRepo,
				mockRegistrationRepo,
				mockBanInfoRepo,
			)

			questions := []model.QuestionAnswer{}
			response, err := happeningService.Register(ctx, userID, happeningID, questions)

			assert.NoError(t, err)
			assert.NotNil(t, response)
			assert.True(t, response.Success)
			assert.Equal(t, tt.expectedWaitlisted, response.IsWaitlisted)
			assert.Equal(t, tt.expectedMsg, response.Message)
		})
	}
}

func TestIsAvailableSpot(t *testing.T) {
	tests := []struct {
		name                string
		spotRanges          []model.SpotRange
		registrations       []model.Registration
		usersByID           map[string]*model.User
		membershipsByUserID map[string][]string
		hostGroups          []string
		user                *model.User
		canSkip             bool
		expected            bool
	}{
		{
			name:                "NoSpotRanges",
			spotRanges:          []model.SpotRange{},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "SpotAvailableNoRegistrations",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "SpotNotAvailableAllTaken",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "user1", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"user1": {ID: "user1", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "SpotAvailableWithSpace",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 2, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "user1", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"user1": {ID: "user1", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "UserCanSkip",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 0, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(5)},
			canSkip:             true,
			expected:            true,
		},
		{
			name: "UserFitsInSpotRange",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "UserDoesNotFitInSpotRange",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(5)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "WaitlistedUserExcludesSpotRange",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "waitlist1", Status: model.RegistrationStatusWaitlisted},
			},
			usersByID: map[string]*model.User{
				"waitlist1": {ID: "waitlist1", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "RegisteredUserDoesNotExcludeSpotRange",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "reg1", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"reg1": {ID: "reg1", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "WaitlistedHostExcludesSpotRange",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "host1", Status: model.RegistrationStatusWaitlisted},
			},
			usersByID: map[string]*model.User{
				"host1": {ID: "host1", Year: intPtr(5)},
			},
			membershipsByUserID: map[string][]string{
				"host1": {"group1"},
			},
			hostGroups: []string{"group1"},
			user:       &model.User{Year: intPtr(2)},
			canSkip:    false,
			expected:   false,
		},
		{
			name: "MultipleSpotRangesSorting",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 5}, // Larger range
				{ID: "sr2", Spots: 1, MinYear: 1, MaxYear: 3}, // Smaller range
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "MultipleRegistrationsAllocateSpots",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 3, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "user1", Status: model.RegistrationStatusRegistered},
				{UserID: "user2", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"user1": {ID: "user1", Year: intPtr(2)},
				"user2": {ID: "user2", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "RegistrationWithNilUser",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "user1", Status: model.RegistrationStatusRegistered},
			},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "WaitlistedUserNotInSpotRange",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "waitlist1", Status: model.RegistrationStatusWaitlisted},
			},
			usersByID: map[string]*model.User{
				"waitlist1": {ID: "waitlist1", Year: intPtr(5)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "WaitlistedUserNilUser",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "waitlist1", Status: model.RegistrationStatusWaitlisted},
			},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "MultipleSpotRangesAllWaitlisted",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 10, MinYear: 1, MaxYear: 3},
				{ID: "sr2", Spots: 10, MinYear: 4, MaxYear: 5},
			},
			registrations: []model.Registration{
				{UserID: "waitlist1", Status: model.RegistrationStatusWaitlisted},
				{UserID: "waitlist2", Status: model.RegistrationStatusWaitlisted},
			},
			usersByID: map[string]*model.User{
				"waitlist1": {ID: "waitlist1", Year: intPtr(2)},
				"waitlist2": {ID: "waitlist2", Year: intPtr(4)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "SpotsZeroWithCanSkip",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 0, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             true,
			expected:            true,
		},
		{
			name: "SpotsZeroWithFit",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 0, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            true,
		},
		{
			name: "SpotsZeroWithoutFitOrSkip",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 0, MinYear: 1, MaxYear: 3},
			},
			registrations:       []model.Registration{},
			usersByID:           map[string]*model.User{},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(5)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "HostRegistrationAllocatesSpot",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 2, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "host1", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"host1": {ID: "host1", Year: intPtr(5)},
			},
			membershipsByUserID: map[string][]string{
				"host1": {"hostGroup"},
			},
			hostGroups: []string{"hostGroup"},
			user:       &model.User{Year: intPtr(2)},
			canSkip:    false,
			expected:   true,
		},
		{
			name: "UserFitsButNoSpotsLeft",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "user1", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"user1": {ID: "user1", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(2)},
			canSkip:             false,
			expected:            false,
		},
		{
			name: "UserFitsButNoSpotsLeftCanSkip",
			spotRanges: []model.SpotRange{
				{ID: "sr1", Spots: 1, MinYear: 1, MaxYear: 3},
			},
			registrations: []model.Registration{
				{UserID: "user1", Status: model.RegistrationStatusRegistered},
			},
			usersByID: map[string]*model.User{
				"user1": {ID: "user1", Year: intPtr(2)},
			},
			membershipsByUserID: map[string][]string{},
			hostGroups:          []string{},
			user:                &model.User{Year: intPtr(5)},
			canSkip:             true,
			expected:            false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := service.IsAvailableSpot(
				tt.spotRanges,
				tt.registrations,
				tt.usersByID,
				tt.membershipsByUserID,
				tt.hostGroups,
				tt.user,
				tt.canSkip,
			)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func intPtr(i int) *int {
	return &i
}

func TestHappeningService_Register_HostCanSkipSpotRangeCheck(t *testing.T) {
	ctx := context.Background()
	happeningID := "happening123"
	userID := "user456"
	hostGroup := "hostGroup"

	hostUser := testutil.NewFakeStruct(func(u *model.User) {
		u.ID = userID
		degreeID := "degree123"
		year := 5
		u.DegreeID = &degreeID
		u.Year = &year
		u.HasReadTerms = true
	})

	happening := testutil.NewFakeStruct(func(h *model.Happening) {
		h.ID = happeningID
		h.Type = "event"
		registrationStart := time.Now().Add(-1 * time.Hour)
		h.RegistrationStart = &registrationStart
		h.RegistrationEnd = nil
	})

	spotRanges := []model.SpotRange{
		{
			ID:          "spot1",
			HappeningID: happeningID,
			Spots:       10,
			MinYear:     1,
			MaxYear:     3,
		},
	}

	registration := testutil.NewFakeStruct(func(r *model.Registration) {
		r.UserID = userID
		r.HappeningID = happeningID
		r.Status = model.RegistrationStatusRegistered
	})

	mockHappeningRepo := mocks.NewHappeningRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	mockRegistrationRepo := mocks.NewRegistrationRepo(t)
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)

	mockUserRepo.EXPECT().
		GetUserByID(mock.Anything, userID).
		Return(hostUser, nil).
		Once()

	mockHappeningRepo.EXPECT().
		GetHappeningById(mock.Anything, happeningID).
		Return(happening, nil).
		Once()

	mockHappeningRepo.EXPECT().
		GetHappeningQuestions(mock.Anything, happeningID).
		Return([]model.Question{}, nil).
		Once()

	mockRegistrationRepo.EXPECT().
		GetByUserAndHappening(mock.Anything, userID, happeningID).
		Return(nil, nil).
		Once()

	mockUserRepo.EXPECT().
		GetUserMemberships(mock.Anything, userID).
		Return([]string{hostGroup}, nil).
		Once()

	mockHappeningRepo.EXPECT().
		GetHappeningSpotRanges(mock.Anything, happeningID).
		Return(spotRanges, nil).
		Once()

	mockHappeningRepo.EXPECT().
		GetHappeningHostGroups(mock.Anything, happeningID).
		Return([]string{hostGroup}, nil).
		Once()

	mockRegistrationRepo.EXPECT().
		CreateRegistration(mock.Anything, userID, happeningID, spotRanges, []string{hostGroup}, true).
		Return(&registration, false, nil).
		Once()

	happeningService := service.NewHappeningService(
		mockHappeningRepo,
		mockUserRepo,
		mockRegistrationRepo,
		mockBanInfoRepo,
	)

	questions := []model.QuestionAnswer{}
	response, err := happeningService.Register(ctx, userID, happeningID, questions)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.True(t, response.Success)
	assert.False(t, response.IsWaitlisted)
	assert.Equal(t, "Du er nå påmeldt arrangementet", response.Message)
}
