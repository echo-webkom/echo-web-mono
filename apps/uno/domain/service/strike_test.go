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

func TestStrikeService_UserRepo(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)
	strikeService := service.NewStrikeService(nil, nil, mockUserRepo)

	userRepo := strikeService.UserRepo()
	assert.NotNil(t, userRepo, "Expected UserRepo to be non-nil")
}

func TestStrikeService_DotRepo(t *testing.T) {
	mockDotRepo := mocks.NewDotRepo(t)
	strikeService := service.NewStrikeService(mockDotRepo, nil, nil)

	dotRepo := strikeService.DotRepo()
	assert.NotNil(t, dotRepo, "Expected DotRepo to be non-nil")
}

func TestStrikeService_BanInfoRepo(t *testing.T) {
	mockBanInfoRepo := mocks.NewBanInfoRepo(t)
	strikeService := service.NewStrikeService(nil, mockBanInfoRepo, nil)

	banInfoRepo := strikeService.BanInfoRepo()
	assert.NotNil(t, banInfoRepo, "Expected BanInfoRepo to be non-nil")
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

func TestStikeService_GetUsersWithStrikes(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)
	expectedUsers := []model.UserWithStrikes{
		testutil.NewFakeStruct[model.UserWithStrikes](),
		testutil.NewFakeStruct[model.UserWithStrikes](),
		testutil.NewFakeStruct[model.UserWithStrikes](),
	}
	mockUserRepo.EXPECT().GetUsersWithStrikes(mock.Anything).Return(expectedUsers, nil).Once()

	strikeService := service.NewStrikeService(nil, nil, mockUserRepo)

	users, err := strikeService.GetUsersWithStrikes(t.Context())
	assert.NoError(t, err, "Expected no error from GetUsersWithStrikes")
	assert.Equal(t, expectedUsers, users, "Expected users to match the mock data")
}

func TestStikeService_GetBannedUsers(t *testing.T) {
	mockUserRepo := mocks.NewUserRepo(t)
	expectedBannedUsers := []model.UserWithBanInfo{
		testutil.NewFakeStruct[model.UserWithBanInfo](),
		testutil.NewFakeStruct[model.UserWithBanInfo](),
	}
	mockUserRepo.EXPECT().GetBannedUsers(mock.Anything).Return(expectedBannedUsers, nil).Once()

	strikeService := service.NewStrikeService(nil, nil, mockUserRepo)

	bannedUsers, err := strikeService.GetBannedUsers(t.Context())
	assert.NoError(t, err, "Expected no error from GetBannedUsers")
	assert.Equal(t, expectedBannedUsers, bannedUsers, "Expected banned users to match the mock data")
}
