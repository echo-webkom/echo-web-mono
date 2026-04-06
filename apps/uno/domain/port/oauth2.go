package port

import (
	"context"
)

type OAuth2Tokens struct {
	AccessToken  string
	TokenType    string
	ExpiresIn    int
	RefreshToken string
	IDToken      string
}

type OAuth2UserInfo struct {
	Sub   string
	Email string
	Name  string
}

type OAuth2Provider interface {
	CreateAuthorizationURL(state string) (string, error)
	ExchangeCode(ctx context.Context, code string) (*OAuth2Tokens, error)
	GetUserInfo(ctx context.Context, accessToken string) (*OAuth2UserInfo, error)
}
