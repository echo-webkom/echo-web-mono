package database

import (
	"encoding/json"
	"time"
)

type AccessRequests struct {
	ID        string
	Email     string
	Reason    string
	CreatedAt time.Time
}

type Account struct {
	UserID            string
	Type              string
	Provider          string
	ProviderAccountID string
	RefreshToken      *string
	AccessToken       *string
	ExpiresAt         *int
	TokenType         *string
	Scope             *string
	IDToken           *string
	SessionState      *string
}

type Answer struct {
	UserID      string
	HappeningID string
	QuestionID  string
	Answer      *json.RawMessage
}

type BanInfo struct {
	ID        int
	UserID    string
	BannedBy  string
	Reason    string
	CreatedAt time.Time
	ExpiresAt time.Time
}

type CommentsReactions struct {
	CommentID string
	UserID    string
	Type      string
	CreatedAt time.Time
}

type Comment struct {
	ID              string
	PostID          string
	ParentCommentID *string
	UserID          *string
	Content         string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type Degree struct {
	ID   string
	Name string
}

type Dot struct {
	ID        int
	UserID    string
	Count     int
	Reason    string
	StrikedBy string
	ExpiresAt time.Time
	CreatedAt time.Time
}

type Group struct {
	ID   string
	Name string
}

type HappeningsToGroups struct {
	HappeningID string
	GroupID     string
}

type Happening struct {
	ID                      string
	Slug                    string
	Title                   string
	Type                    string
	Date                    *time.Time
	RegistrationGroups      *json.RawMessage
	RegistrationStartGroups *time.Time
	RegistrationStart       *time.Time
}

type KV struct {
	Key   string
	Value *json.RawMessage
	Ttl   *time.Time
}

type Question struct {
	ID          string
	Title       string
	Required    bool
	Type        string
	IsSensitive bool
	Options     *json.RawMessage
	HappeningID string
}

type Reaction struct {
	ReactToKey string
	EmojiID    int
	UserID     string
	CreatedAt  time.Time
}

type Registration struct {
	UserID           string
	HappeningID      string
	Status           string
	UnregisterReason *string
	CreatedAt        time.Time
	PrevStatus       *string
	ChangedAt        *time.Time
	ChangedBy        *string
}

type Session struct {
	SessionToken string
	UserID       string
	Expires      time.Time
}

type ShoppingListItem struct {
	ID        string
	UserID    string
	Name      string
	CreatedAt time.Time
}

type SiteFeedback struct {
	ID        string
	Name      *string
	Email     *string
	Message   string
	Category  string
	IsRead    bool
	CreatedAt time.Time
}

type SpotRange struct {
	ID          string
	HappeningID string
	Spots       int
	MinYear     int
	MaxYear     int
}

type UsersToGroups struct {
	UserID   string
	GroupID  string
	IsLeader bool
}

type UsersToShoppingListItems struct {
	UserID    string
	ItemID    string
	CreatedAt time.Time
}

type User struct {
	ID               string
	Name             *string
	Email            string
	Image            *string
	AlternativeEmail *string
	DegreeID         *string
	Year             *int
	Type             string
	LastSignInAt     *time.Time
	UpdatedAt        *time.Time
	CreatedAt        *time.Time
	HasReadTerms     bool
	Birthday         *time.Time
}

type VerificationToken struct {
	Identifier string
	Token      string
	ExpiresAt  time.Time
}

type Whitelist struct {
	Email     string
	ExpiresAt time.Time
	Reason    string
}
