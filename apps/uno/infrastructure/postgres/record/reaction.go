package record

import (
	"time"
	"uno/domain/model"
)

// ReactionDB represents the database schema for reaction table
type ReactionDB struct {
	ReactToKey string    `db:"react_to_key"`
	EmojiID    int       `db:"emoji_id"`
	UserID     string    `db:"user_id"`
	CreatedAt  time.Time `db:"created_at"`
}

// ToDomain converts database model to domain model
func (db *ReactionDB) ToDomain() *model.Reaction {
	return &model.Reaction{
		ReactToKey: db.ReactToKey,
		EmojiID:    db.EmojiID,
		UserID:     db.UserID,
		CreatedAt:  db.CreatedAt,
	}
}
