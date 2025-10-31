package model

import "time"

type SiteFeedback struct {
	ID        string    `db:"id" json:"id"`
	Name      *string   `db:"name" json:"name,omitempty"`
	Email     *string   `db:"email" json:"email,omitempty"`
	Message   string    `db:"message" json:"message"`
	IsRead    bool      `db:"is_read" json:"is_read"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type Reaction struct {
	ReactToKey string    `db:"react_to_key" json:"react_to_key"`
	EmojiID    int       `db:"emoji_id" json:"emoji_id"`
	UserID     string    `db:"user_id" json:"user_id"`
	CreatedAt  time.Time `db:"created_at" json:"created_at"`
}

type Comment struct {
	ID              string    `db:"id" json:"id"`
	PostID          string    `db:"post_id" json:"post_id"`
	ParentCommentID *string   `db:"parent_comment_id" json:"parent_comment_id,omitempty"`
	UserID          *string   `db:"user_id" json:"user_id,omitempty"`
	Content         string    `db:"content" json:"content"`
	CreatedAt       time.Time `db:"created_at" json:"created_at"`
	UpdatedAt       time.Time `db:"updated_at" json:"updated_at"`
}

type CommentsReactions struct {
	CommentID string    `db:"comment_id" json:"comment_id"`
	UserID    string    `db:"user_id" json:"user_id"`
	Type      string    `db:"type" json:"type"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
