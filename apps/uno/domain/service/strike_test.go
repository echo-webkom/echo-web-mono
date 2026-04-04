package service_test

import (
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestStrikeService_GetUserByID(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)
	strikeService := service.NewStrikeService(nil, nil, mockUserRepo)

	userID := "user-1"
	mockUser := testutil.NewFakeStruct(func(u *model.User) { u.ID = userID })
	mockUserRepo.EXPECT().GetUserByID(mock.Anything, userID).Return(mockUser, nil).Once()

	user, err := strikeService.GetUserByID(t.Context(), userID)
	assert.NoError(t, err)
	assert.Equal(t, userID, user.ID)
}

func TestStrikeService_CreateDot(t *testing.T) {
	mockDotRepo := mocks.NewDotRepo(t)
	strikeService := service.NewStrikeService(mockDotRepo, nil, nil)

	newDot := testutil.NewFakeStruct[model.NewDot]()
	mockDot := testutil.NewFakeStruct[model.Dot]()
	mockDotRepo.EXPECT().CreateDot(mock.Anything, newDot).Return(mockDot, nil).Once()

	createdDot, err := strikeService.CreateDot(t.Context(), newDot)
	assert.NoError(t, err)
	assert.Equal(t, mockDot, createdDot)
}

func TestStrikeService_GetBanInfoByUserID(t *testing.T) {
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)
	strikeService := service.NewStrikeService(nil, mockBanInfoRepo, nil)

	userID := "user-1"
	banInfo := testutil.NewFakeStruct[model.ModBanInfo]()
	mockBanInfoRepo.EXPECT().GetBanInfoByUserID(mock.Anything, userID).Return(&banInfo, nil).Once()

	gotBanInfo, err := strikeService.GetBanInfoByUserID(t.Context(), userID)
	assert.NoError(t, err)
	assert.NotNil(t, gotBanInfo)
}

func TestStrikeService_UnbanUsersWithExpiredStrikes(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)

	mockDotRepo := mocks.NewDotRepo(t)
	mockDotRepo.EXPECT().DeleteExpired(mock.Anything).Return(nil).Once()

	mockBanInfoRepo := mocks.NewBanInfoRepo(t)
	mockBanInfoRepo.EXPECT().DeleteExpired(mock.Anything).Return(nil).Once()

	strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)

	err := strikeService.UnbanUsersWithExpiredStrikes(t.Context())
	assert.NoError(t, err, "Expected no error from UnbanUsersWithExpiredStrikes")
}

func TestStrikeService_UnbanUsersWithExpiredStrikes_BanInfoErr(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)

	// Simulate error from BanInfoRepo
	mockDotRepo := mocks.NewDotRepo(t)
	mockDotRepo.EXPECT().DeleteExpired(mock.Anything).Return(nil).Once()

	mockBanInfoRepo := mocks.NewBanInfoRepo(t)
	mockBanInfoRepo.EXPECT().DeleteExpired(mock.Anything).Return(assert.AnError).Once()

	strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)

	err := strikeService.UnbanUsersWithExpiredStrikes(t.Context())
	assert.Error(t, err, "Expected error from UnbanUsersWithExpiredStrikes due to BanInfoRepo failure")
}

func TestStrikeService_UnbanUsersWithExpiredStrikes_DotRepoErr(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)

	// Simulate error from DotRepo
	mockDotRepo := mocks.NewDotRepo(t)
	mockDotRepo.EXPECT().DeleteExpired(mock.Anything).Return(assert.AnError).Once()

	mockBanInfoRepo := mocks.NewBanInfoRepo(t) // Does not get called

	strikeServiceErr := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)

	err := strikeServiceErr.UnbanUsersWithExpiredStrikes(t.Context())
	assert.Error(t, err, "Expected error from UnbanUsersWithExpiredStrikes due to DotRepo failure")
}

func TestStrikeService_GetUsersWithStrikeDetails(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)
	expectedUsers := []model.UserWithStrikeDetails{
		testutil.NewFakeStruct[model.UserWithStrikeDetails](),
		testutil.NewFakeStruct[model.UserWithStrikeDetails](),
		testutil.NewFakeStruct[model.UserWithStrikeDetails](),
	}
	mockUserRepo.EXPECT().GetUsersWithStrikeDetails(mock.Anything).Return(expectedUsers, nil).Once()

	strikeService := service.NewStrikeService(nil, nil, mockUserRepo)

	users, err := strikeService.GetUsersWithStrikeDetails(t.Context())
	assert.NoError(t, err, "Expected no error from GetUsersWithStrikeDetails")
	assert.Equal(t, expectedUsers, users, "Expected users to match the mock data")
}
