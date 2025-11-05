package services_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/services"

	"github.com/stretchr/testify/assert"
)

func TestWhitelistService_UserRepo(t *testing.T) {
	mockRepo := mocks.NewWhitelistRepo(t)
	whitelistService := services.NewWhitelistService(mockRepo)

	whitelistRepo := whitelistService.WhitelistRepo()
	assert.NotNil(t, whitelistRepo, "Expected WhitelistRepo to be non-nil")
}
