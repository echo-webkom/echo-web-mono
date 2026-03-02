package jobs

import (
	"errors"
	"testing"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCleanupSensitiveQuestionsRun(t *testing.T) {
	expected := int64(3)

	questionRepo := mocks.NewQuestionRepo(t)
	questionRepo.EXPECT().
		CleanupSensitiveQuestions(mock.Anything).
		Return(expected, nil).
		Once()

	questionService := service.NewQuestionService(questionRepo)
	job := NewCleanupSensitiveQuestions(questionService, &testutil.NoOpLogger{})

	err := job.Run(t.Context())

	assert.NoError(t, err)
}

func TestCleanupSensitiveQuestionsRunError(t *testing.T) {
	expectedErr := errors.New("cleanup sensitive questions failed")

	questionRepo := mocks.NewQuestionRepo(t)
	questionRepo.EXPECT().
		CleanupSensitiveQuestions(mock.Anything).
		Return(int64(0), expectedErr).
		Once()

	questionService := service.NewQuestionService(questionRepo)
	job := NewCleanupSensitiveQuestions(questionService, &testutil.NoOpLogger{})

	err := job.Run(t.Context())

	assert.ErrorIs(t, err, expectedErr)
}

func TestCleanupOldStrikesRun(t *testing.T) {
	expected := int64(2)

	dotRepo := mocks.NewDotRepo(t)
	dotRepo.EXPECT().
		CleanupOldStrikes(mock.Anything).
		Return(expected, nil).
		Once()

	banInfoRepo := mocks.NewBanInfoRepo(t)
	userRepo := mocks.NewUserRepo(t)

	strikeService := service.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	job := NewCleanupOldStrikes(strikeService, &testutil.NoOpLogger{})

	err := job.Run(t.Context())

	assert.NoError(t, err)
}

func TestCleanupOldStrikesRunError(t *testing.T) {
	expectedErr := errors.New("cleanup old strikes failed")

	dotRepo := mocks.NewDotRepo(t)
	dotRepo.EXPECT().
		CleanupOldStrikes(mock.Anything).
		Return(int64(0), expectedErr).
		Once()

	banInfoRepo := mocks.NewBanInfoRepo(t)
	userRepo := mocks.NewUserRepo(t)

	strikeService := service.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	job := NewCleanupOldStrikes(strikeService, &testutil.NoOpLogger{})

	err := job.Run(t.Context())

	assert.ErrorIs(t, err, expectedErr)
}

func TestResetUserYearsRun(t *testing.T) {
	expected := int64(10)

	userRepo := mocks.NewUserRepo(t)
	userRepo.EXPECT().
		ResetUserYears(mock.Anything).
		Return(expected, nil).
		Once()

	userService := service.NewUserService("", userRepo, nil)
	job := NewResetUserYears(userService, &testutil.NoOpLogger{})

	err := job.Run(t.Context())

	assert.NoError(t, err)
}

func TestResetUserYearsRunError(t *testing.T) {
	expectedErr := errors.New("reset user years failed")

	userRepo := mocks.NewUserRepo(t)
	userRepo.EXPECT().
		ResetUserYears(mock.Anything).
		Return(int64(0), expectedErr).
		Once()

	userService := service.NewUserService("", userRepo, nil)
	job := NewResetUserYears(userService, &testutil.NoOpLogger{})

	err := job.Run(t.Context())

	assert.ErrorIs(t, err, expectedErr)
}

func TestNewCleanupExpiredKV(t *testing.T) {
	kvRepo := mocks.NewKVRepo(t)
	job := NewCleanupExpiredKV(kvRepo, &testutil.NoOpLogger{})
	assert.NotNil(t, job)
}
