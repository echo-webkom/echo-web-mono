package repo

import (
	"context"
	"uno/domain/model"
)

type QuestionRepo interface {
	GetQuestionsByHappeningId(ctx context.Context, hapId string) ([]model.Question, error)
}
