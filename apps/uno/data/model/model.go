package model

import (
	"encoding/json"
	"time"
)

type RegistrationStatus string

const (
	RegistrationStatusRegistered   RegistrationStatus = "registered"
	RegistrationStatusWaitlisted   RegistrationStatus = "waiting"
	RegistrationStatusUnregistered RegistrationStatus = "unregistered"
	RegistrationStatusPending      RegistrationStatus = "pending"
	RegistrationStatusRemoved      RegistrationStatus = "removed"
)

type AccessRequests struct {
	ID        string    `db:"id" json:"id"`
	Email     string    `db:"email" json:"email"`
	Reason    string    `db:"reason" json:"reason"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type Account struct {
	UserID            string  `db:"user_id" json:"userId"`
	Type              string  `db:"type" json:"type"`
	Provider          string  `db:"provider" json:"provider"`
	ProviderAccountID string  `db:"provider_account_id" json:"providerAccountId"`
	RefreshToken      *string `db:"refresh_token" json:"refreshToken"`
	AccessToken       *string `db:"access_token" json:"accessToken"`
	ExpiresAt         *int    `db:"expires_at" json:"expiresAt"`
	TokenType         *string `db:"token_type" json:"tokenType"`
	Scope             *string `db:"scope" json:"scope"`
	IDToken           *string `db:"id_token" json:"idToken"`
	SessionState      *string `db:"session_state" json:"sessionState"`
}

type Answer struct {
	UserID      string           `db:"user_id" json:"userId"`
	HappeningID string           `db:"happening_id" json:"happeningId"`
	QuestionID  string           `db:"question_id" json:"questionId"`
	Answer      *json.RawMessage `db:"answer" json:"answer"`
}

type BanInfo struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"userId"`
	BannedBy  string    `db:"banned_by" json:"bannedBy"`
	Reason    string    `db:"reason" json:"reason"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	ExpiresAt time.Time `db:"expires_at" json:"expiresAt"`
}

type CommentsReactions struct {
	CommentID string    `db:"comment_id" json:"commentId"`
	UserID    string    `db:"user_id" json:"userId"`
	Type      string    `db:"type" json:"type"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
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

type Degree struct {
	ID   string `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

type Dot struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"userId"`
	Count     int       `db:"count" json:"count"`
	Reason    string    `db:"reason" json:"reason"`
	StrikedBy string    `db:"striked_by" json:"strikedBy"`
	ExpiresAt time.Time `db:"expires_at" json:"expiresAt"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type Group struct {
	ID   string `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

type HappeningsToGroups struct {
	HappeningID string `db:"happening_id" json:"happeningId"`
	GroupID     string `db:"group_id" json:"groupId"`
}

type Happening struct {
	ID                      string           `db:"id" json:"id"`
	Slug                    string           `db:"slug" json:"slug"`
	Title                   string           `db:"title" json:"title"`
	Type                    string           `db:"type" json:"type"`
	Date                    *time.Time       `db:"date" json:"date"`
	RegistrationGroups      *json.RawMessage `db:"registration_groups" json:"registrationGroups"`
	RegistrationStartGroups *time.Time       `db:"registration_start_groups" json:"registrationStartGroups"`
	RegistrationStart       *time.Time       `db:"registration_start" json:"registrationStart"`
	RegistrationEnd         *time.Time       `db:"registration_end" json:"registrationEnd"`
}

type KV struct {
	Key   string           `db:"key" json:"key"`
	Value *json.RawMessage `db:"value" json:"value"`
	Ttl   *time.Time       `db:"ttl" json:"ttl"`
}

type Question struct {
	ID          string           `db:"id" json:"id"`
	Title       string           `db:"title" json:"title"`
	Required    bool             `db:"required" json:"required"`
	Type        string           `db:"type" json:"type"`
	IsSensitive bool             `db:"is_sensitive" json:"isSensitive"`
	Options     *json.RawMessage `db:"options" json:"options"`
	HappeningID string           `db:"happening_id" json:"happeningId"`
}

type Reaction struct {
	ReactToKey string    `db:"react_to_key" json:"reactToKey"`
	EmojiID    int       `db:"emoji_id" json:"emojiId"`
	UserID     string    `db:"user_id" json:"userId"`
	CreatedAt  time.Time `db:"created_at" json:"createdAt"`
}

type Registration struct {
	UserID           string             `db:"user_id" json:"userId"`
	HappeningID      string             `db:"happening_id" json:"happeningId"`
	Status           RegistrationStatus `db:"status" json:"status"`
	UnregisterReason *string            `db:"unregister_reason" json:"unregisterReason"`
	CreatedAt        time.Time          `db:"created_at" json:"createdAt"`
	PrevStatus       *string            `db:"prev_status" json:"prevStatus"`
	ChangedAt        *time.Time         `db:"changed_at" json:"changedAt"`
	ChangedBy        *string            `db:"changed_by" json:"changedBy"`
}

type Session struct {
	SessionToken string    `db:"session_token" json:"sessionToken"`
	UserID       string    `db:"user_id" json:"userId"`
	Expires      time.Time `db:"expires" json:"expires"`
}

type ShoppingListItem struct {
	ID        string    `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"userId"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type SiteFeedback struct {
	ID        string    `db:"id" json:"id"`
	Name      *string   `db:"name" json:"name"`
	Email     *string   `db:"email" json:"email"`
	Message   string    `db:"message" json:"message"`
	IsRead    bool      `db:"is_read" json:"isRead"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type SpotRange struct {
	ID          string `db:"id" json:"id"`
	HappeningID string `db:"happening_id" json:"happeningId"`
	Spots       int    `db:"spots" json:"spots"`
	MinYear     int    `db:"min_year" json:"minYear"`
	MaxYear     int    `db:"max_year" json:"maxYear"`
}

type UsersToGroups struct {
	UserID   string `db:"user_id" json:"userId"`
	GroupID  string `db:"group_id" json:"groupId"`
	IsLeader bool   `db:"is_leader" json:"isLeader"`
}

type UsersToShoppingListItems struct {
	UserID    string    `db:"user_id" json:"userId"`
	ItemID    string    `db:"item_id" json:"itemId"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type User struct {
	ID               string     `db:"id" json:"id"`
	Name             *string    `db:"name" json:"name"`
	Email            string     `db:"email" json:"email"`
	Image            *string    `db:"image" json:"image"`
	AlternativeEmail *string    `db:"alternative_email" json:"alternativeEmail"`
	DegreeID         *string    `db:"degree_id" json:"degreeId"`
	Year             *int       `db:"year" json:"year"`
	Type             string     `db:"type" json:"type"`
	LastSignInAt     *time.Time `db:"last_sign_in_at" json:"lastSignInAt"`
	UpdatedAt        *time.Time `db:"updated_at" json:"updatedAt"`
	CreatedAt        *time.Time `db:"created_at" json:"createdAt"`
	HasReadTerms     bool       `db:"has_read_terms" json:"hasReadTerms"`
	Birthday         *time.Time `db:"birthday" json:"birthday"`
	IsPublic         bool       `db:"is_public" json:"isPublic"`
}

func (u *User) IsProfileComplete() bool {
	return u.DegreeID != nil && u.Year != nil && u.HasReadTerms
}

type VerificationToken struct {
	Identifier string    `db:"identifier" json:"identifier"`
	Token      string    `db:"token" json:"token"`
	ExpiresAt  time.Time `db:"expires_at" json:"expiresAt"`
}

type Whitelist struct {
	Email     string    `db:"email" json:"email"`
	ExpiresAt time.Time `db:"expires_at" json:"expiresAt"`
	Reason    string    `db:"reason" json:"reason"`
}
