package record

import (
	"time"

	"uno/domain/model"
)

// UserDB represents the database schema for the user table.
// It contains database-specific tags and structure.
type UserDB struct {
	ID               string     `db:"id"`
	Name             *string    `db:"name"`
	Email            string     `db:"email"`
	Image            *string    `db:"image"`
	AlternativeEmail *string    `db:"alternative_email"`
	DegreeID         *string    `db:"degree_id"`
	Year             *int       `db:"year"`
	Type             string     `db:"type"`
	LastSignInAt     *time.Time `db:"last_sign_in_at"`
	UpdatedAt        *time.Time `db:"updated_at"`
	CreatedAt        *time.Time `db:"created_at"`
	HasReadTerms     bool       `db:"has_read_terms"`
	Birthday         *time.Time `db:"birthday"`
	IsPublic         bool       `db:"is_public"`
}

// FromDomain converts a domain User model to a database UserDB model.
func (db *UserDB) FromDomain(u *model.User) *UserDB {
	return &UserDB{
		ID:               u.ID,
		Name:             u.Name,
		Email:            u.Email,
		Image:            u.Image,
		AlternativeEmail: u.AlternativeEmail,
		DegreeID:         u.DegreeID,
		Year:             u.Year,
		Type:             string(u.Type),
		LastSignInAt:     u.LastSignInAt,
		UpdatedAt:        u.UpdatedAt,
		CreatedAt:        u.CreatedAt,
		HasReadTerms:     u.HasReadTerms,
		Birthday:         u.Birthday,
		IsPublic:         u.IsPublic,
	}
}

// ToDomain converts a database UserDB model to a domain User model.
func (db *UserDB) ToDomain() *model.User {
	return &model.User{
		ID:               db.ID,
		Name:             db.Name,
		Email:            db.Email,
		Image:            db.Image,
		AlternativeEmail: db.AlternativeEmail,
		DegreeID:         db.DegreeID,
		Year:             db.Year,
		Type:             model.UserType(db.Type),
		LastSignInAt:     db.LastSignInAt,
		UpdatedAt:        db.UpdatedAt,
		CreatedAt:        db.CreatedAt,
		HasReadTerms:     db.HasReadTerms,
		Birthday:         db.Birthday,
		IsPublic:         db.IsPublic,
	}
}

// UserToDomainList converts a slice of database UserDB models to domain User models.
func UserToDomainList(dbUsers []UserDB) []model.User {
	users := make([]model.User, len(dbUsers))
	for i, dbUser := range dbUsers {
		users[i] = *dbUser.ToDomain()
	}
	return users
}

// DegreeDB represents the database schema for the degree table.
type DegreeDB struct {
	ID   string `db:"id"`
	Name string `db:"name"`
}

// FromDomain converts a domain Degree model to a database DegreeDB model.
func (db *DegreeDB) FromDomain(d *model.Degree) *DegreeDB {
	return &DegreeDB{
		ID:   d.ID,
		Name: d.Name,
	}
}

// ToDomain converts a database DegreeDB model to a domain Degree model.
func (db *DegreeDB) ToDomain() *model.Degree {
	return &model.Degree{
		ID:   db.ID,
		Name: db.Name,
	}
}

// DegreeToDomainList converts a slice of database DegreeDB models to domain Degree models.
func DegreeToDomainList(dbDegrees []DegreeDB) []model.Degree {
	degrees := make([]model.Degree, len(dbDegrees))
	for i, dbDegree := range dbDegrees {
		degrees[i] = *dbDegree.ToDomain()
	}
	return degrees
}

// AccountDB represents the database schema for the account table.
type AccountDB struct {
	UserID            string  `db:"user_id"`
	Type              string  `db:"type"`
	Provider          string  `db:"provider"`
	ProviderAccountID string  `db:"provider_account_id"`
	RefreshToken      *string `db:"refresh_token"`
	AccessToken       *string `db:"access_token"`
	ExpiresAt         *int    `db:"expires_at"`
	TokenType         *string `db:"token_type"`
	Scope             *string `db:"scope"`
	IDToken           *string `db:"id_token"`
	SessionState      *string `db:"session_state"`
}

// FromDomain converts a domain Account model to a database AccountDB model.
func (db *AccountDB) FromDomain(a *model.Account) *AccountDB {
	return &AccountDB{
		UserID:            a.UserID,
		Type:              a.Type,
		Provider:          a.Provider,
		ProviderAccountID: a.ProviderAccountID,
		RefreshToken:      a.RefreshToken,
		AccessToken:       a.AccessToken,
		ExpiresAt:         a.ExpiresAt,
		TokenType:         a.TokenType,
		Scope:             a.Scope,
		IDToken:           a.IDToken,
		SessionState:      a.SessionState,
	}
}

// ToDomain converts a database AccountDB model to a domain Account model.
func (db *AccountDB) ToDomain() *model.Account {
	return &model.Account{
		UserID:            db.UserID,
		Type:              db.Type,
		Provider:          db.Provider,
		ProviderAccountID: db.ProviderAccountID,
		RefreshToken:      db.RefreshToken,
		AccessToken:       db.AccessToken,
		ExpiresAt:         db.ExpiresAt,
		TokenType:         db.TokenType,
		Scope:             db.Scope,
		IDToken:           db.IDToken,
		SessionState:      db.SessionState,
	}
}

// SessionDB represents the database schema for the session table.
type SessionDB struct {
	SessionToken string    `db:"session_token"`
	UserID       string    `db:"user_id"`
	Expires      time.Time `db:"expires"`
}

// FromDomain converts a domain Session model to a database SessionDB model.
func (db *SessionDB) FromDomain(s *model.Session) *SessionDB {
	return &SessionDB{
		SessionToken: s.SessionToken,
		UserID:       s.UserID,
		Expires:      s.Expires,
	}
}

// ToDomain converts a database SessionDB model to a domain Session model.
func (db *SessionDB) ToDomain() *model.Session {
	return &model.Session{
		SessionToken: db.SessionToken,
		UserID:       db.UserID,
		Expires:      db.Expires,
	}
}

// VerificationTokenDB represents the database schema for the verification_token table.
type VerificationTokenDB struct {
	Identifier string    `db:"identifier"`
	Token      string    `db:"token"`
	ExpiresAt  time.Time `db:"expires_at"`
}

// FromDomain converts a domain VerificationToken model to a database VerificationTokenDB model.
func (db *VerificationTokenDB) FromDomain(v *model.VerificationToken) *VerificationTokenDB {
	return &VerificationTokenDB{
		Identifier: v.Identifier,
		Token:      v.Token,
		ExpiresAt:  v.ExpiresAt,
	}
}

// ToDomain converts a database VerificationTokenDB model to a domain VerificationToken model.
func (db *VerificationTokenDB) ToDomain() *model.VerificationToken {
	return &model.VerificationToken{
		Identifier: db.Identifier,
		Token:      db.Token,
		ExpiresAt:  db.ExpiresAt,
	}
}

type UserWithStrikes struct {
	ID       string  `db:"id"`
	Name     *string `db:"name"`
	Image    *string `db:"image"`
	IsBanned bool    `db:"isbanned"`
	Strikes  int     `db:"strikes"`
}

func (u *UserWithStrikes) ToDomain() *model.UserWithStrikes {
	return &model.UserWithStrikes{
		ID:       u.ID,
		Name:     u.Name,
		Image:    u.Image,
		IsBanned: u.IsBanned,
		Strikes:  u.Strikes,
	}
}

func UserWithStrikesList(dbList []UserWithStrikes) []model.UserWithStrikes {
	var domainList []model.UserWithStrikes
	for _, dbItem := range dbList {
		domainList = append(domainList, *dbItem.ToDomain())
	}
	return domainList
}
