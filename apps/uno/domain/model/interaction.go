package model

import "time"

// SiteFeedback represents a site feedback entry in the domain
type SiteFeedback struct {
	ID        string
	Name      *string
	Email     *string
	Message   string
	Category  string
	IsRead    bool
	CreatedAt time.Time
}

// NewSiteFeedback represents the data required to create a new site feedback entry.
type NewSiteFeedback struct {
	Name     *string
	Email    *string
	Message  string
	Category string
}

// Reaction represents a generic reaction in the domain
type Reaction struct {
	ReactToKey string
	EmojiID    int
	UserID     string
	CreatedAt  time.Time
}

// NewReaction represents the data required to create a new reaction.
type NewReaction struct {
	// The hash of the entity being reacted to.
	// A post for example could have a reactToKey of "post_<postID>"
	// while a happening/event could have "event_<happeningID>"
	ReactToKey string
	// The ID of the emoji being used for the reaction.
	EmojiID int
	UserID  string
}

// IsValid checks if the NewReaction has valid fields.
// Returns true if ReactToKey is not empty, EmojiID is between 0 and 4, and UserID is not empty.
func (r NewReaction) IsValid() bool {
	return r.ReactToKey != "" && r.EmojiID >= 0 && r.EmojiID <= 4 && r.UserID != ""
}

type Comment struct {
	ID              string    `db:"id" json:"id"`
	PostID          string    `db:"post_id" json:"postId"`
	ParentCommentID *string   `db:"parent_comment_id" json:"parentCommentId"`
	UserID          *string   `db:"user_id" json:"userId"`
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
