package service_test

import (
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestWhitelistService_GetWhitelist(t *testing.T) {
	mockRepo := mocks.NewWhitelistRepo(t)
	whitelistService := service.NewWhitelistService(mockRepo)

	mockRepo.EXPECT().GetWhitelist(t.Context()).Return([]model.Whitelist{}, nil).Once()

	whitelist, err := whitelistService.GetWhitelist(t.Context())
	assert.NoError(t, err)
	assert.NotNil(t, whitelist)
}
