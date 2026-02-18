package record

import (
	"time"
	"uno/domain/model"
)

// CommentDB represents the database schema for comment table
type CommentDB struct {
	ID              string    `db:"id"`
	PostID          string    `db:"post_id"`
	ParentCommentID *string   `db:"parent_comment_id"`
	UserID          *string   `db:"user_id"`
	Content         string    `db:"content"`
	CreatedAt       time.Time `db:"created_at"`
	UpdatedAt       time.Time `db:"updated_at"`
}

// ToDomain converts database model to domain model
func (db *CommentDB) ToDomain() *model.Comment {
	return &model.Comment{
		ID:              db.ID,
		PostID:          db.PostID,
		ParentCommentID: db.ParentCommentID,
		UserID:          db.UserID,
		Content:         db.Content,
		CreatedAt:       db.CreatedAt,
		UpdatedAt:       db.UpdatedAt,
	}
}
