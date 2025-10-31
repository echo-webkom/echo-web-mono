package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresQuestionImpl struct {
	db *Database
}

func NewPostgresQuestionImpl(db *Database) repo.QuestionRepo {
	return &PostgresQuestionImpl{db: db}
}

func (q *PostgresQuestionImpl) GetQuestionsByHappeningId(ctx context.Context, hapId string) (qs []model.Question, err error) {
	query := `
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	err = q.db.SelectContext(ctx, &qs, query, hapId)
	return qs, err
}
