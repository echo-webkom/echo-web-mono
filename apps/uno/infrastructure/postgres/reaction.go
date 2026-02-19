package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type ReactionRepo struct {
	db     *Database
	logger port.Logger
}

func NewReactionRepo(db *Database, logger port.Logger) port.ReactionRepo {
	return &ReactionRepo{
		db:     db,
		logger: logger,
	}
}

// AddReactions adds a reaction to the database
func (r *ReactionRepo) AddReaction(ctx context.Context, reaction model.Reaction) error {
	r.logger.Info(ctx, "adding reactiong",
		"react_to_key", reaction.ReactToKey,
		"emoji_id", reaction.EmojiID,
		"user_id", reaction.UserID,
	)

	query := `--sql
	INSERT INTO reaction (react_to_key, emoji_id, user_id, created_at)
	VALUES ($1, $2, $3, NOW())
	ON CONFLICT (react_to_key, emoji_id, user_id) DO NOTHING
	`
	_, err := r.db.ExecContext(ctx, query,
		reaction.ReactToKey,
		reaction.EmojiID,
		reaction.UserID,
	)
	if err != nil {
		r.logger.Error(ctx, "failed to add reaction", "error", err)
		return err
	}
	return nil
}

// GetReactionsByID
func (r *ReactionRepo) GetReactionsByID(ctx context.Context, reactToKey string) ([]model.Reaction, error) {
	r.logger.Info(ctx, "getting reactions by reactToKey", "react_to_key", reactToKey)

	query := `--sql
	SELECT react_to_key, emoji_id, user_id, created_at
	FROM reaction
	WHERE react_to_key = $1
	`
	rows, err := r.db.QueryxContext(ctx, query, reactToKey)
	if err != nil {
		r.logger.Error(ctx, "failed to get reactions by reactToKey", "error", err)
		return nil, err
	}
	defer func() {
		_ = rows.Close()
	}()

	var reactions []model.Reaction
	for rows.Next() {
		var rec record.ReactionDB
		if err := rows.StructScan(&rec); err != nil {
			r.logger.Error(ctx, "failed to scan reaction row", "error", err)
			return nil, err
		}
		reactions = append(reactions, rec.ToDomain())
	}
	return reactions, nil
}

// GetReactionsByIDAndUserID get reactions by reactToKey and userID
func (r *ReactionRepo) GetReactionsByIDAndUserID(ctx context.Context, reactToKey string, userID string) ([]model.Reaction, error) {
	r.logger.Info(ctx, "getting reactions by reactToKey and userID", "react_to_key", reactToKey, "user_id", userID)

	query := `--sql
	SELECT react_to_key, emoji_id, user_id, created_at
	FROM reaction
	WHERE react_to_key = $1 AND user_id = $2
	`
	rows, err := r.db.QueryxContext(ctx, query, reactToKey, userID)
	if err != nil {
		r.logger.Error(ctx, "failed to get reactions by reactToKey and userID", "error", err)
		return nil, err
	}
	defer func() {
		_ = rows.Close()
	}()

	var reactions []model.Reaction
	for rows.Next() {
		var rec record.ReactionDB
		if err := rows.StructScan(&rec); err != nil {
			r.logger.Error(ctx, "failed to scan reaction row", "error", err)
			return nil, err
		}
		reactions = append(reactions, rec.ToDomain())
	}
	return reactions, nil
}

// RemoveReaction removes a reaction from the database
func (r *ReactionRepo) RemoveReaction(ctx context.Context, reactToKey string, emojiID int, userID string) error {
	r.logger.Info(ctx, "removing reaction", "react_to_key", reactToKey, "emoji_id", emojiID, "user_id", userID)

	query := `--sql
	DELETE FROM reaction
	WHERE react_to_key = $1 AND emoji_id = $2 AND user_id = $3
	`
	_, err := r.db.ExecContext(ctx, query, reactToKey, emojiID, userID)
	if err != nil {
		r.logger.Error(ctx, "failed to remove reaction", "error", err)
		return err
	}
	return nil
}
