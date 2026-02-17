package model

import (
	"errors"
	"time"
)

var (
	ErrInvalidSiteFeedbackCategory = errors.New("invalid site feedback category")
)

// SiteFeedbackCategory defines the category of site feedback.
type SiteFeedbackCategory string

// Possible values for SiteFeedbackCategory
const (
	CategoryBug     SiteFeedbackCategory = "bug"
	CategoryFeature SiteFeedbackCategory = "feature"
	CategoryLogin   SiteFeedbackCategory = "login"
	CategoryOther   SiteFeedbackCategory = "other"
)

func NewSiteFeedbackCategory(value string) (SiteFeedbackCategory, error) {
	c := SiteFeedbackCategory(value)
	if !c.IsValid() {
		return "", ErrInvalidSiteFeedbackCategory
	}
	return c, nil
}

func (c SiteFeedbackCategory) String() string {
	return string(c)
}

func (c SiteFeedbackCategory) IsValid() bool {
	switch c {
	case CategoryBug, CategoryFeature, CategoryLogin, CategoryOther:
		return true
	default:
		return false
	}
}

// SiteFeedback represents a user's feedback about the website.
// This is a domain entity that encapsulates feedback data and behavior.
type SiteFeedback struct {
	ID        string
	Name      *string
	Email     *Email
	Message   string
	Category  SiteFeedbackCategory
	IsRead    bool
	CreatedAt time.Time
}

// NewSiteFeedback is a value object representing the data required to create new feedback.
type NewSiteFeedback struct {
	Name     *string
	Email    *Email
	Message  string
	Category SiteFeedbackCategory
}

// Reaction represents a user's emotional response to content.
// This is a domain entity that tracks reactions to various content types.
type Reaction struct {
	ReactToKey string
	EmojiID    int
	UserID     string
	CreatedAt  time.Time
}

// NewReaction is a value object containing the data needed to create a new reaction.
type NewReaction struct {
	// ReactToKey is the unique identifier of the entity being reacted to.
	// Format: "<entity_type>_<entity_id>" (e.g., "post_123", "event_456")
	ReactToKey string
	// EmojiID is the identifier of the emoji used for this reaction.
	EmojiID int
	UserID  string
}

// IsValid validates the NewReaction value object.
// Returns true if all required fields are present and within valid ranges.
func (r NewReaction) IsValid() bool {
	return r.ReactToKey != "" && r.EmojiID >= 0 && r.EmojiID <= 4 && r.UserID != ""
}

// Comment represents a user's comment on a post.
// This is a domain entity that can be part of a threaded discussion.
type Comment struct {
	ID              string
	PostID          string
	ParentCommentID *string
	UserID          *string
	Content         string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// CommentsReaction represents a user's reaction to a comment.
// This is a domain entity that tracks engagement with comments.
type CommentsReaction struct {
	CommentID string
	UserID    string
	Type      string
	CreatedAt time.Time
}

// UserSummary is a value object containing minimal user information
// for display purposes in aggregates like comments.
type UserSummary struct {
	ID    string
	Name  *string
	Image *string
}

// CommentAggregate is an aggregate root that combines a comment with its
// associated reactions and user information. This represents a complete
// view of a comment as needed by the application layer.
type CommentAggregate struct {
	Comment
	Reactions []CommentsReaction
	User      *UserSummary
}
