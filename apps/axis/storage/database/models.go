package database

import (
	"encoding/json"
	"time"
)

type AccessRequests struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"createdAt"`
}

type Account struct {
	UserID            string  `json:"userID"`
	Type              string  `json:"type"`
	Provider          string  `json:"provider"`
	ProviderAccountID string  `json:"providerAccountID"`
	RefreshToken      *string `json:"refreshToken"`
	AccessToken       *string `json:"accessToken"`
	ExpiresAt         *int    `json:"expiresAt"`
	TokenType         *string `json:"tokenType"`
	Scope             *string `json:"scope"`
	IDToken           *string `json:"iDToken"`
	SessionState      *string `json:"sessionState"`
}

type Answer struct {
	UserID      string           `json:"userID"`
	HappeningID string           `json:"happeningID"`
	QuestionID  string           `json:"questionID"`
	Answer      *json.RawMessage `json:"answer"`
}

type BanInfo struct {
	ID        int       `json:"id"`
	UserID    string    `json:"userID"`
	BannedBy  string    `json:"bannedBy"`
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type CommentsReactions struct {
	CommentID string    `json:"commentID"`
	UserID    string    `json:"userID"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"createdAt"`
}

type Comment struct {
	ID              string    `json:"id"`
	PostID          string    `json:"postID"`
	ParentCommentID *string   `json:"parentCommentID"`
	UserID          *string   `json:"userID"`
	Content         string    `json:"content"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type Degree struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Dot struct {
	ID        int       `json:"id"`
	UserID    string    `json:"userID"`
	Count     int       `json:"count"`
	Reason    string    `json:"reason"`
	StrikedBy string    `json:"strikedBy"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

type Group struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type HappeningsToGroups struct {
	HappeningID string `json:"happeningID"`
	GroupID     string `json:"groupID"`
}

type Happening struct {
	ID                      string           `json:"id"`
	Slug                    string           `json:"slug"`
	Title                   string           `json:"title"`
	Type                    string           `json:"type"`
	Date                    *time.Time       `json:"date"`
	RegistrationGroups      *json.RawMessage `json:"registrationGroups"`
	RegistrationStartGroups *time.Time       `json:"registrationStartGroups"`
	RegistrationStart       *time.Time       `json:"registrationStart"`
}

type KV struct {
	Key   string           `json:"key"`
	Value *json.RawMessage `json:"value"`
	Ttl   *time.Time       `json:"ttl"`
}

type Question struct {
	ID          string           `json:"id"`
	Title       string           `json:"title"`
	Required    bool             `json:"required"`
	Type        string           `json:"type"`
	IsSensitive bool             `json:"isSensitive"`
	Options     *json.RawMessage `json:"options"`
	HappeningID string           `json:"happeningID"`
}

type Reaction struct {
	ReactToKey string    `json:"reactToKey"`
	EmojiID    int       `json:"emojiID"`
	UserID     string    `json:"userID"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Registration struct {
	UserID           string     `json:"userID"`
	HappeningID      string     `json:"happeningID"`
	Status           string     `json:"status"`
	UnregisterReason *string    `json:"unregisterReason"`
	CreatedAt        time.Time  `json:"createdAt"`
	PrevStatus       *string    `json:"prevStatus"`
	ChangedAt        *time.Time `json:"changedAt"`
	ChangedBy        *string    `json:"changedBy"`
}

type Session struct {
	SessionToken string    `json:"sessionToken"`
	UserID       string    `json:"userID"`
	Expires      time.Time `json:"expires"`
}

type ShoppingListItem struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userID"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

type SiteFeedback struct {
	ID        string    `json:"id"`
	Name      *string   `json:"name"`
	Email     *string   `json:"email"`
	Message   string    `json:"message"`
	IsRead    bool      `json:"isRead"`
	CreatedAt time.Time `json:"createdAt"`
}

type SpotRange struct {
	ID          string `json:"id"`
	HappeningID string `json:"happeningID"`
	Spots       int    `json:"spots"`
	MinYear     int    `json:"minYear"`
	MaxYear     int    `json:"maxYear"`
}

type UsersToGroups struct {
	UserID   string `json:"userID"`
	GroupID  string `json:"groupID"`
	IsLeader bool   `json:"isLeader"`
}

type UsersToShoppingListItems struct {
	UserID    string    `json:"userID"`
	ItemID    string    `json:"itemID"`
	CreatedAt time.Time `json:"createdAt"`
}

type User struct {
	ID               string     `json:"id"`
	Name             *string    `json:"name"`
	Email            string     `json:"email"`
	Image            *string    `json:"image"`
	AlternativeEmail *string    `json:"alternativeEmail"`
	DegreeID         *string    `json:"degreeID"`
	Year             *int       `json:"year"`
	Type             string     `json:"type"`
	LastSignInAt     *time.Time `json:"lastSignInAt"`
	UpdatedAt        *time.Time `json:"updatedAt"`
	CreatedAt        *time.Time `json:"createdAt"`
	HasReadTerms     bool       `json:"hasReadTerms"`
	Birthday         *time.Time `json:"birthday"`
}

type VerificationToken struct {
	Identifier string    `json:"identifier"`
	Token      string    `json:"token"`
	ExpiresAt  time.Time `json:"expiresAt"`
}

type Whitelist struct {
	Email     string    `json:"email"`
	ExpiresAt time.Time `json:"expiresAt"`
	Reason    string    `json:"reason"`
}
