package model

import "time"

type SiteFeedback struct {
	ID        string    `db:"id"`
	Name      *string   `db:"name"`
	Email     *string   `db:"email"`
	Message   string    `db:"message"`
	IsRead    bool      `db:"is_read"`
	CreatedAt time.Time `db:"created_at"`
}

type Reaction struct {
	ReactToKey string    `db:"react_to_key"`
	EmojiID    int       `db:"emoji_id"`
	UserID     string    `db:"user_id"`
	CreatedAt  time.Time `db:"created_at"`
}

type Comment struct {
	ID              string    `db:"id"`
	PostID          string    `db:"post_id"`
	ParentCommentID *string   `db:"parent_comment_id"`
	UserID          *string   `db:"user_id"`
	Content         string    `db:"content"`
	CreatedAt       time.Time `db:"created_at"`
	UpdatedAt       time.Time `db:"updated_at"`
}

type CommentsReactions struct {
	CommentID string    `db:"comment_id"`
	UserID    string    `db:"user_id"`
	Type      string    `db:"type"`
	CreatedAt time.Time `db:"created_at"`
}
