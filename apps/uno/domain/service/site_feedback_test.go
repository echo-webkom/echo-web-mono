package service_test

import (
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestSiteFeedbackService_GetAllSiteFeedbacks(t *testing.T) {
	mockRepo := mocks.NewSiteFeedbackRepo(t)
	siteFeedbackService := service.NewSiteFeedbackService(mockRepo)

	mockRepo.EXPECT().GetAllSiteFeedbacks(t.Context()).Return([]model.SiteFeedback{}, nil).Once()

	feedbacks, err := siteFeedbackService.GetAllSiteFeedbacks(t.Context())
	assert.NoError(t, err)
	assert.NotNil(t, feedbacks)
}
