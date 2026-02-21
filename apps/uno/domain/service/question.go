package service

import (
	"context"
	"uno/domain/port"
)

type QuestionService struct {
	questionRepo port.QuestionRepo
}

func NewQuestionService(questionRepo port.QuestionRepo) *QuestionService {
	return &QuestionService{
		questionRepo: questionRepo,
	}
}

func (s *QuestionService) CleanupSensitiveQuestions(ctx context.Context) (int64, error) {
	return s.questionRepo.CleanupSensitiveQuestions(ctx)
}
