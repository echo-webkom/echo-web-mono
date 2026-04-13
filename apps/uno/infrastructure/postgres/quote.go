package postgres

import (
	"context"
	"database/sql"
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

// GetQuotes fetches all quotes with their reactions in a single query.
// Returns the quotes ordered by likes and submission date.
func (q *QuoteRepo) GetQuotes(ctx context.Context) ([]model.Quote, error) {
	q.logger.Info(ctx, "fetching quotes")

	query := `--sql
		WITH like_counts AS (
			SELECT quote_id, COUNT(*) AS likes
			FROM users_to_quotes
			WHERE reaction_type = 'like'
			GROUP BY quote_id
		)
		SELECT q.id, q.text, q.context, q.person, q.submitted_at,
			utq.reaction_type, utq.user_id
		FROM quote q
		LEFT JOIN like_counts lc ON q.id = lc.quote_id
		LEFT JOIN users_to_quotes utq ON q.id = utq.quote_id
		ORDER BY COALESCE(lc.likes, 0) DESC, q.submitted_at DESC
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

	var order []string
	quoteMap := make(map[string]*model.Quote)

	for rows.Next() {
		var r record.Quote
		var reactionType, userID sql.NullString

		if err := rows.Scan(&r.ID, &r.Text, &r.Context, &r.Person, &r.SubmittedAt, &reactionType, &userID); err != nil {
			q.logger.Error(ctx, "failed to scan quote", "error", err)
			return nil, err
		}

		if _, exists := quoteMap[r.ID]; !exists {
			quote := r.ToModel()
			quoteMap[r.ID] = &quote
			order = append(order, r.ID)
		}

		if reactionType.Valid && userID.Valid {
			quoteMap[r.ID].Reactions = append(quoteMap[r.ID].Reactions, model.QuoteReaction{
				UserID:       userID.String,
				ReactionType: model.QuoteReactionType(reactionType.String),
			})
		}
	}
	if err := rows.Err(); err != nil {
		q.logger.Error(ctx, "error iterating over quote rows", "error", err)
		return nil, err
	}

	quotes := make([]model.Quote, 0, len(order))
	for _, id := range order {
		quotes = append(quotes, *quoteMap[id])
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

// GetReactions gets the reactions for a quote by its ID.
func (q *QuoteRepo) GetReactions(ctx context.Context, quoteID string) ([]model.QuoteReaction, error) {
	q.logger.Info(ctx, "fetching reactions for quote", "quote_id", quoteID)

	query := `--sql
		SELECT quote_id, reaction_type, user_id
		FROM users_to_quotes
		WHERE quote_id = $1
	`

	rows, err := q.db.QueryContext(ctx, query, quoteID)
	if err != nil {
		q.logger.Error(ctx, "failed to fetch reactions for quote", "error", err)
		return nil, err
	}
	defer func() {
		closeErr := rows.Close()
		if closeErr != nil {
			err = errors.Join(err, closeErr)
		}
	}()

	var reactions []model.QuoteReaction
	for rows.Next() {
		var r record.QuoteReaction
		if err := rows.Scan(&r.QuoteID, &r.ReactionType, &r.UserID); err != nil {
			q.logger.Error(ctx, "failed to scan reaction", "error", err)
			return nil, err
		}
		reactions = append(reactions, r.ToModel())
	}
	if err := rows.Err(); err != nil {
		q.logger.Error(ctx, "error iterating over reaction rows", "error", err)
		return nil, err
	}
	return reactions, nil
}

// AddReaction adds a reaction to a quote by a user.
// If the user has already added a reaction to the quote, it updates the reaction type.
func (q *QuoteRepo) AddReaction(ctx context.Context, quoteID string, userID string, reactionType model.QuoteReactionType) error {
	q.logger.Info(ctx, "adding reaction to quote", "quote_id", quoteID, "user_id", userID, "reaction_type", reactionType)

	query := `--sql
		INSERT INTO users_to_quotes (quote_id, user_id, reaction_type)
		VALUES ($1, $2, $3)
		ON CONFLICT (quote_id, user_id) DO UPDATE SET reaction_type = EXCLUDED.reaction_type
	`

	_, err := q.db.ExecContext(ctx, query, quoteID, userID, reactionType)
	if err != nil {
		q.logger.Error(ctx, "failed to add reaction to quote", "error", err)
		return err
	}

	return nil
}

// RemoveReaction removes a reaction from a quote by a user.
func (q *QuoteRepo) RemoveReaction(ctx context.Context, quoteID string, userID string) error {
	q.logger.Info(ctx, "removing reaction from quote", "quote_id", quoteID, "user_id", userID)

	query := `--sql
		DELETE FROM users_to_quotes
		WHERE quote_id = $1 AND user_id = $2
	`

	_, err := q.db.ExecContext(ctx, query, quoteID, userID)
	if err != nil {
		q.logger.Error(ctx, "failed to remove reaction from quote", "error", err)
		return err
	}

	return nil
}

// GetQuoteByID fetches a quote with its reactions from the database by its ID.
// If the quote is not found, it returns nil without an error.
func (q *QuoteRepo) GetQuoteByID(ctx context.Context, quoteID string) (*model.Quote, error) {
	q.logger.Info(ctx, "fetching quote", "quote_id", quoteID)

	query := `--sql
		SELECT q.id, q.text, q.context, q.person, q.submitted_at,
		       utq.reaction_type, utq.user_id
		FROM quote q
		LEFT JOIN users_to_quotes utq ON q.id = utq.quote_id
		WHERE q.id = $1
	`

	rows, err := q.db.QueryContext(ctx, query, quoteID)
	if err != nil {
		q.logger.Error(ctx, "failed to fetch quote", "error", err)
		return nil, err
	}
	defer func() {
		closeErr := rows.Close()
		if closeErr != nil {
			err = errors.Join(err, closeErr)
		}
	}()

	var quote *model.Quote
	for rows.Next() {
		var r record.Quote
		var reactionType, userID sql.NullString

		if err := rows.Scan(&r.ID, &r.Text, &r.Context, &r.Person, &r.SubmittedAt, &reactionType, &userID); err != nil {
			q.logger.Error(ctx, "failed to scan quote", "error", err)
			return nil, err
		}

		if quote == nil {
			q := r.ToModel()
			quote = &q
		}

		if reactionType.Valid && userID.Valid {
			quote.Reactions = append(quote.Reactions, model.QuoteReaction{
				UserID:       userID.String,
				ReactionType: model.QuoteReactionType(reactionType.String),
			})
		}
	}
	if err := rows.Err(); err != nil {
		q.logger.Error(ctx, "error iterating over quote rows", "error", err)
		return nil, err
	}

	if quote == nil {
		q.logger.Info(ctx, "quote not found", "quote_id", quoteID)
		return nil, nil
	}

	return quote, nil
}
