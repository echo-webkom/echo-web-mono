package services_test

import (
	"testing"
	"uno/domain/ports/mocks"
	"uno/domain/services"

	"github.com/stretchr/testify/assert"
)

func TestDegreeService_DegreeRepo(t *testing.T) {
	mockRepo := mocks.NewDegreeRepo(t)
	degreeService := services.NewDegreeService(mockRepo)

	degreeRepo := degreeService.DegreeRepo()
	assert.NotNil(t, degreeRepo, "Expected DegreeRepo to be non-nil")
}
