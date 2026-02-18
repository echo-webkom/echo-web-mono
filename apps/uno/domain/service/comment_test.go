package service_test

import (
	"errors"
	"testing"
	"uno/domain/port/mocks"
	"uno/domain/service"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCommentService_CommentRepo(t *testing.T) {
	mockRepo := mocks.NewCommentRepo(t)
	commentService := service.NewCommentService(mockRepo)

	commentRepo := commentService.CommentRepo()
	assert.NotNil(t, commentRepo, "Expected CommentRepo to be non-nil")
}

func TestCommentService_ReactToComment_Exists(t *testing.T) {
	commentID := "comment123"
	userID := "user456"

	mockRepo := mocks.NewCommentRepo(t)
	mockRepo.EXPECT().IsReactedByUser(mock.Anything, commentID, userID).Return(true, nil).Once()
	mockRepo.EXPECT().DeleteReactionFromComment(mock.Anything, commentID, userID).Return(nil).Once()

	commentService := service.NewCommentService(mockRepo)

	err := commentService.ReactToComment(t.Context(), commentID, userID)

	assert.NoError(t, err, "Expected ReactToComment to not return an error")
}

func TestCommentService_ReactToComment_NotExists(t *testing.T) {
	commentID := "comment123"
	userID := "user456"

	mockRepo := mocks.NewCommentRepo(t)
	mockRepo.EXPECT().IsReactedByUser(mock.Anything, commentID, userID).Return(false, nil).Once()
	mockRepo.EXPECT().AddReactionToComment(mock.Anything, commentID, userID).Return(nil).Once()

	commentService := service.NewCommentService(mockRepo)

	err := commentService.ReactToComment(t.Context(), commentID, userID)

	assert.NoError(t, err, "Expected ReactToComment to not return an error")
}

func TestCommentService_ReactToComment_IsReactedByUserError(t *testing.T) {
	commentID := "comment123"
	userID := "user456"
	expectedErr := errors.New("database error")

	mockRepo := mocks.NewCommentRepo(t)
	mockRepo.EXPECT().IsReactedByUser(mock.Anything, commentID, userID).Return(false, expectedErr).Once()

	commentService := service.NewCommentService(mockRepo)

	err := commentService.ReactToComment(t.Context(), commentID, userID)

	assert.Error(t, err, "Expected ReactToComment to return an error")
	assert.Equal(t, expectedErr, err)
}

func TestCommentService_ReactToComment_DeleteReactionError(t *testing.T) {
	commentID := "comment123"
	userID := "user456"
	expectedErr := errors.New("delete reaction error")

	mockRepo := mocks.NewCommentRepo(t)
	mockRepo.EXPECT().IsReactedByUser(mock.Anything, commentID, userID).Return(true, nil).Once()
	mockRepo.EXPECT().DeleteReactionFromComment(mock.Anything, commentID, userID).Return(expectedErr).Once()

	commentService := service.NewCommentService(mockRepo)

	err := commentService.ReactToComment(t.Context(), commentID, userID)

	assert.Error(t, err, "Expected ReactToComment to return an error")
	assert.Equal(t, expectedErr, err)
}

func TestCommentService_ReactToComment_AddReactionError(t *testing.T) {
	commentID := "comment123"
	userID := "user456"
	expectedErr := errors.New("add reaction error")

	mockRepo := mocks.NewCommentRepo(t)
	mockRepo.EXPECT().IsReactedByUser(mock.Anything, commentID, userID).Return(false, nil).Once()
	mockRepo.EXPECT().AddReactionToComment(mock.Anything, commentID, userID).Return(expectedErr).Once()

	commentService := service.NewCommentService(mockRepo)

	err := commentService.ReactToComment(t.Context(), commentID, userID)

	assert.Error(t, err, "Expected ReactToComment to return an error")
	assert.Equal(t, expectedErr, err)
}
