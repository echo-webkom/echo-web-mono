package model

import "time"

type SiteFeedback struct {
	ID        string    `db:"id" json:"id"`
	Name      *string   `db:"name" json:"name,omitempty"`
	Email     *string   `db:"email" json:"email,omitempty"`
	Message   string    `db:"message" json:"message"`
	Category  string    `db:"category" json:"category"`
	IsRead    bool      `db:"is_read" json:"isRead"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type Reaction struct {
	ReactToKey string    `db:"react_to_key" json:"reactToKey"`
	EmojiID    int       `db:"emoji_id" json:"emojiId"`
	UserID     string    `db:"user_id" json:"userId"`
	CreatedAt  time.Time `db:"created_at" json:"createdAt"`
}

type Comment struct {
	ID              string    `db:"id" json:"id"`
	PostID          string    `db:"post_id" json:"postId"`
	ParentCommentID *string   `db:"parent_comment_id" json:"parentCommentId,omitempty"`
	UserID          *string   `db:"user_id" json:"userId,omitempty"`
	Content         string    `db:"content" json:"content"`
	CreatedAt       time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt       time.Time `db:"updated_at" json:"updatedAt"`
}

type CommentsReaction struct {
	CommentID string    `db:"comment_id" json:"commentId"`
	UserID    string    `db:"user_id" json:"userId"`
	Type      string    `db:"type" json:"type"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}
