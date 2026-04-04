package service_test

import (
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestDegreeService_GetAllDegrees(t *testing.T) {
	mockRepo := mocks.NewDegreeRepo(t)
	degreeService := service.NewDegreeService(mockRepo)

	mockRepo.EXPECT().GetAllDegrees(t.Context()).Return([]model.Degree{}, nil).Once()

	degrees, err := degreeService.GetAllDegrees(t.Context())
	assert.NoError(t, err)
	assert.NotNil(t, degrees)
}
