package model

import (
	"bytes"
	"errors"
	"image"
	"io"
	"strings"
	"time"
)

// User represents a user in the system with their profile information.
// This is a domain model focused on business logic and rules.
type User struct {
	ID               string
	Name             *string
	Email            string
	Image            *string
	AlternativeEmail *string
	Degree           *Degree
	Year             *DegreeYear
	Type             UserType
	LastSignInAt     *time.Time
	UpdatedAt        *time.Time
	CreatedAt        *time.Time
	HasReadTerms     bool
	Birthday         *time.Time
	IsPublic         bool
	Groups           []Group
}

// DegreeYear represents the year of study for a user.
type DegreeYear int

var ErrInvalidDegreeYear = errors.New("invalid degree year")

const (
	FirstYear  DegreeYear = 1
	SecondYear DegreeYear = 2
	ThirdYear  DegreeYear = 3
	FourthYear DegreeYear = 4
	FifthYear  DegreeYear = 5
	PhDYear    DegreeYear = 6
)

func NewDegreeYear(year int) (*DegreeYear, error) {
	switch year {
	case 1:
		dy := FirstYear
		return &dy, nil
	case 2:
		dy := SecondYear
		return &dy, nil
	case 3:
		dy := ThirdYear
		return &dy, nil
	case 4:
		dy := FourthYear
		return &dy, nil
	case 5:
		dy := FifthYear
		return &dy, nil
	case 6:
		dy := PhDYear
		return &dy, nil
	default:
		return nil, ErrInvalidDegreeYear
	}
}

func (dy DegreeYear) Int() int {
	return int(dy)
}

func (dy *DegreeYear) IntPtr() *int {
	if dy == nil {
		return nil
	}
	year := int(*dy)
	return &year
}

// UserType represents the type of user account
type UserType string

const (
	UserTypeStudent UserType = "student"
	UserTypeAdmin   UserType = "admin"
	// Add other user types as needed
)

func (u UserType) String() string {
	return string(u)
}

// IsProfileComplete checks if the user has completed their profile
// by filling in required fields.
func (u *User) IsProfileComplete() bool {
	return u.Degree != nil && u.Year != nil && u.HasReadTerms
}

// CanAccessPrivateInfo checks if the user's profile information
// can be accessed by others.
func (u *User) CanAccessPrivateInfo() bool {
	return u.IsPublic
}

// HasBirthday checks if the user has a birthday set.
func (u *User) HasBirthday() bool {
	return u.Birthday != nil
}

// IsBirthdayToday checks if the user's birthday is today in the given location.
func (u *User) IsBirthdayToday(now time.Time) bool {
	if u.Birthday == nil {
		return false
	}
	return u.Birthday.Month() == now.Month() && u.Birthday.Day() == now.Day()
}

// UpdateLastSignIn updates the last sign in timestamp.
func (u *User) UpdateLastSignIn(timestamp time.Time) {
	u.LastSignInAt = &timestamp
}

// Degree represents an academic degree or study program.
type Degree struct {
	ID   string
	Name string
}

// Account represents an external authentication provider account
// linked to a user (e.g., Feide, Google).
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

// IsExpired checks if the account token has expired.
func (a *Account) IsExpired(now time.Time) bool {
	if a.ExpiresAt == nil {
		return false
	}
	return now.Unix() > int64(*a.ExpiresAt)
}

// Session represents an active user session.
type Session struct {
	SessionToken string
	UserID       string
	Expires      time.Time
}

// IsExpired checks if the session has expired.
func (s *Session) IsExpired(now time.Time) bool {
	return now.After(s.Expires)
}

// IsValid checks if the session is valid (not expired).
func (s *Session) IsValid(now time.Time) bool {
	return !s.IsExpired(now)
}

// VerificationToken represents a token used for email verification
// or password reset.
type VerificationToken struct {
	Identifier string
	Token      string
	ExpiresAt  time.Time
}

// IsExpired checks if the verification token has expired.
func (v *VerificationToken) IsExpired(now time.Time) bool {
	return now.After(v.ExpiresAt)
}

// IsValid checks if the verification token is valid (not expired).
func (v *VerificationToken) IsValid(now time.Time) bool {
	return !v.IsExpired(now)
}

type UserWithStrikes struct {
	ID       string
	Name     *string
	Image    *string
	IsBanned bool
	Strikes  int
}

type BanInfo struct {
	ID           int
	Reason       string
	UserID       string
	BannedByID   string
	BannedByName *string
	CreatedAt    time.Time
	ExpiresAt    time.Time
}

type DotInfo struct {
	ID            int
	UserID        string
	Count         int
	Reason        string
	CreatedAt     time.Time
	ExpiresAt     time.Time
	StrikedByID   string
	StrikedByName *string
}

type UserWithBanInfo struct {
	ID      string
	Name    *string
	Image   *string
	BanInfo BanInfo
	Dots    []DotInfo
}

var (
	ErrProfilePictureTooLarge           = errors.New("profile picture exceeds the maximum allowed size of 5 MB")
	ErrUnsupportedProfilePictureType    = errors.New("unsupported profile picture type")
	ErrProfilePictureDimensionsTooLarge = errors.New("profile picture dimensions exceed the maximum allowed size of 3000x3000 pixels")
)

type ProfilePictureImageType string

const (
	ProfilePictureTypeJPEG ProfilePictureImageType = "image/jpeg"
	ProfilePictureTypePNG  ProfilePictureImageType = "image/png"
	ProfilePictureTypeGIF  ProfilePictureImageType = "image/gif"
	ProfilePictureTypeWEBP ProfilePictureImageType = "image/webp"
)

const (
	ProfilePictureMaxSize = 5 * 1024 * 1024 // 5 MB
)

type ProfilePictureUpload struct {
	data      []byte
	ImageType ProfilePictureImageType
	Size      int64
}

func NewProfilePictureUpload(r io.Reader, imageType ProfilePictureImageType) (*ProfilePictureUpload, error) {
	data, err := io.ReadAll(io.LimitReader(r, ProfilePictureMaxSize+1))
	if err != nil {
		return nil, err
	}
	return &ProfilePictureUpload{
		data:      data,
		ImageType: imageType,
		Size:      int64(len(data)),
	}, nil
}

func (p *ProfilePictureUpload) Reader() io.Reader {
	return bytes.NewReader(p.data)
}

func (p *ProfilePictureUpload) Bytes() []byte {
	return p.data
}

func (p *ProfilePictureUpload) Validate() error {
	if p.Size > ProfilePictureMaxSize {
		return ErrProfilePictureTooLarge
	}
	switch p.ImageType {
	case ProfilePictureTypeJPEG, ProfilePictureTypePNG, ProfilePictureTypeGIF, ProfilePictureTypeWEBP:
	default:
		return ErrUnsupportedProfilePictureType
	}
	cfg, format, err := image.DecodeConfig(p.Reader())
	if err != nil {
		return ErrUnsupportedProfilePictureType
	}
	if cfg.Width > 3000 || cfg.Height > 3000 {
		return ErrProfilePictureDimensionsTooLarge
	}
	// strip "image/" prefix
	declaredFormat := strings.TrimPrefix(string(p.ImageType), "image/")
	if declaredFormat == "jpg" {
		declaredFormat = "jpeg"
	}
	if format != declaredFormat {
		p.ImageType = ProfilePictureImageType("image/" + format)
	}
	return nil
}

type ProfilePicture struct {
	io.ReadCloser
	ContentType  string
	ETag         string
	LastModified time.Time
	Size         int64
}
