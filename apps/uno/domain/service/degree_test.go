package service_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
)

func TestDegreeService_DegreeRepo(t *testing.T) {
	mockRepo := mocks.NewDegreeRepo(t)
	degreeService := service.NewDegreeService(mockRepo)

	degreeRepo := degreeService.DegreeRepo()
	assert.NotNil(t, degreeRepo, "Expected DegreeRepo to be non-nil")
}
