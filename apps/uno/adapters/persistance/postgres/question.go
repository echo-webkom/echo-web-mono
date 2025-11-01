package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type QuestionRepo struct {
	db *Database
}

func (q *QuestionRepo) GetQuestionsByHappeningId(ctx context.Context, hapId string) (qs []model.Question, err error) {
	query := `
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	err = q.db.SelectContext(ctx, &qs, query, hapId)
	return qs, err
}

func NewQuestionRepo(db *Database) repo.QuestionRepo {
	return &QuestionRepo{db: db}
}
