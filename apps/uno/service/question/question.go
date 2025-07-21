package question

import (
	"context"

	"github.com/echo-webkom/uno/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type QuestionService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *QuestionService {
	return &QuestionService{
		pool: pool,
	}
}

// Finds all the questions for a given happening ID.
func (s *QuestionService) FindByHappeningID(ctx context.Context, happeningID string) ([]database.Question, error) {
	var questions []database.Question

	query := `--sql
		SELECT id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`

	rows, err := s.pool.Query(ctx, query, happeningID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var q database.Question
		if err := rows.Scan(&q.ID, &q.Title, &q.Required, &q.Type, &q.IsSensitive, &q.Options); err != nil {
			return nil, err
		}
		questions = append(questions, q)
	}

	return questions, nil
}
