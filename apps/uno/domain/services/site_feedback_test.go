package services_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/services"

	"github.com/stretchr/testify/assert"
)

func TestSiteFeedbackService_SiteFeedbackRepo(t *testing.T) {
	mockRepo := mocks.NewSiteFeedbackRepo(t)
	siteFeedbackService := services.NewSiteFeedbackService(mockRepo)

	siteFeedbackRepo := siteFeedbackService.SiteFeedbackRepo()
	assert.NotNil(t, siteFeedbackRepo, "Expected SiteFeedbackRepo to be non-nil")
}
