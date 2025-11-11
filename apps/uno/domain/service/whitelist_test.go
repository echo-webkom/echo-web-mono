package service_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestWhitelistService_UserRepo(t *testing.T) {
	mockRepo := mocks.NewWhitelistRepo(t)
	whitelistService := service.NewWhitelistService(mockRepo)

	whitelistRepo := whitelistService.WhitelistRepo()
	assert.NotNil(t, whitelistRepo, "Expected WhitelistRepo to be non-nil")
}
