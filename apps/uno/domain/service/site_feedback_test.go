package service_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestSiteFeedbackService_SiteFeedbackRepo(t *testing.T) {
	mockRepo := mocks.NewSiteFeedbackRepo(t)
	siteFeedbackService := service.NewSiteFeedbackService(mockRepo)

	siteFeedbackRepo := siteFeedbackService.SiteFeedbackRepo()
	assert.NotNil(t, siteFeedbackRepo, "Expected SiteFeedbackRepo to be non-nil")
}
