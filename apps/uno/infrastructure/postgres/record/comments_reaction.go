package record

import (
	"time"
	"uno/domain/model"
)

// CommentsReactionDB represents the database schema for comments_reactions table
type CommentsReactionDB struct {
	CommentID string    `db:"comment_id"`
	UserID    string    `db:"user_id"`
	Type      string    `db:"type"`
	CreatedAt time.Time `db:"created_at"`
}

// ToDomain converts database model to domain model
func (db *CommentsReactionDB) ToDomain() *model.CommentsReaction {
	return &model.CommentsReaction{
		CommentID: db.CommentID,
		UserID:    db.UserID,
		Type:      db.Type,
		CreatedAt: db.CreatedAt,
	}
}
