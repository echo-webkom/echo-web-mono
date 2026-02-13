package port

import "context"

type QuestionRepo interface {
	CleanupSensitiveQuestions(ctx context.Context) (int64, error)
}
