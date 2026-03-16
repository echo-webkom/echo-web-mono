package postgres

import (
	"context"
	"errors"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type QuoteRepo struct {
	db     *Database
	logger port.Logger
}

func NewQuoteRepo(db *Database, logger port.Logger) port.QuoteRepo {
	return &QuoteRepo{db: db, logger: logger}
}

// CreateQuote gets all the quotes from the database and returns them.
func (q *QuoteRepo) CreateQuote(ctx context.Context, quote model.Quote, submittedBy string) error {
	q.logger.Info(ctx, "creating quote", "quote_id", quote.ID, "submitted_by", submittedBy)

	query := `--sql
		INSERT INTO quote (id, text, context, person, submitted_at, submitted_by)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := q.db.ExecContext(ctx, query,
		quote.ID,
		quote.Text,
		quote.Context,
		quote.Person,
		quote.SubmittedAt,
		submittedBy,
	)
	if err != nil {
		q.logger.Error(ctx, "failed to create quote", "error", err)
		return err
	}
	return nil
}

// GetQuotes inserts a new quote into the database.
func (q *QuoteRepo) GetQuotes(ctx context.Context) ([]model.Quote, error) {
	q.logger.Info(ctx, "fetching quotes")

	query := `--sql
		SELECT id, text, context, person, submitted_at
		FROM quote
	`

	rows, err := q.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer func() {
		closeErr := rows.Close()
		if closeErr != nil {
			err = errors.Join(err, closeErr)
		}
	}()

	var quotes []model.Quote
	for rows.Next() {
		var r record.Quote
		if err := rows.Scan(&r.ID, &r.Text, &r.Context, &r.Person, &r.SubmittedAt); err != nil {
			q.logger.Error(ctx, "failed to scan quote", "error", err)
			return nil, err
		}
		quotes = append(quotes, r.ToModel())
	}
	if err := rows.Err(); err != nil {
		q.logger.Error(ctx, "error iterating over quote rows", "error", err)
		return nil, err
	}
	return quotes, nil
}

// DeleteQuote deletes a quote from the database by its ID.
func (q *QuoteRepo) DeleteQuote(ctx context.Context, quoteID string) error {
	q.logger.Info(ctx, "deleting quote", "quote_id", quoteID)

	query := `--sql
		DELETE FROM quote
		WHERE id = $1
	`

	_, err := q.db.ExecContext(ctx, query, quoteID)
	if err != nil {
		q.logger.Error(ctx, "failed to delete quote", "error", err)
		return err
	}

	return nil
}
