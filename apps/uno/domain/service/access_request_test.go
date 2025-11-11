package service_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestAccessRequestService_Queries(t *testing.T) {
	mockRepo := mocks.NewAccessRequestRepo(t)
	accessRequestService := service.NewAccessRequestService(mockRepo)

	accessRequestRepo := accessRequestService.Queries()
	assert.NotNil(t, accessRequestRepo, "Expected AccessRequestRepo to be non-nil")
}

func TestAccessRequestService_AccessRequestRepo(t *testing.T) {
	mockRepo := mocks.NewAccessRequestRepo(t)
	accessRequestService := service.NewAccessRequestService(mockRepo)

	accessRequestRepo := accessRequestService.AccessRequestRepo()
	assert.NotNil(t, accessRequestRepo, "Expected AccessRequestRepo to be non-nil")
}
