package service_test

import (
	"testing"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestAccessRequestService_GetAccessRequests(t *testing.T) {
	mockRepo := mocks.NewAccessRequestRepo(t)
	accessRequestService := service.NewAccessRequestService(mockRepo, nil, nil)
	mockRepo.EXPECT().GetAccessRequests(t.Context()).Return([]model.AccessRequest{}, nil).Once()

	requests, err := accessRequestService.GetAccessRequests(t.Context())
	assert.NoError(t, err)
	assert.NotNil(t, requests)
}

func TestAccessRequestService_GetAccessRequestByID(t *testing.T) {
	mockRepo := mocks.NewAccessRequestRepo(t)
	accessRequestService := service.NewAccessRequestService(mockRepo, nil, nil)
	id := "request-1"
	request := testutil.NewFakeStruct[model.AccessRequest]()
	mockRepo.EXPECT().GetAccessRequestByID(t.Context(), id).Return(request, nil).Once()

	gotRequest, err := accessRequestService.GetAccessRequestByID(t.Context(), id)
	assert.NoError(t, err)
	assert.Equal(t, request, gotRequest)
}
