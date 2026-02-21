package postgres

import (
	"context"
	"fmt"
	"uno/domain/port"
)

type QuestionRepo struct {
	db     *Database
	logger port.Logger
}

func NewQuestionRepo(db *Database, logger port.Logger) port.QuestionRepo {
	return &QuestionRepo{db: db, logger: logger}
}

func (q *QuestionRepo) CleanupSensitiveQuestions(ctx context.Context) (int64, error) {
	query := `--sql
		DELETE FROM answer
		WHERE question_id IN (
			SELECT qs.id
			FROM question qs
			LEFT JOIN happening h ON qs.happening_id = h.id
			WHERE h.date < NOW() - INTERVAL '30 days'
			AND qs.is_sensitive = TRUE
		)
	`

	result, err := q.db.ExecContext(ctx, query)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("cleanup sensitive questions rows affected: %w", err)
	}

	return rowsAffected, nil
}
