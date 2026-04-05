package port

import (
	"context"
	"uno/domain/model"
)

type AccountRepo interface {
	GetAccountByProvider(ctx context.Context, provider, providerAccountID string) (model.Account, error)
	GetAccountsByUserID(ctx context.Context, userID string) ([]model.Account, error)
	CreateAccount(ctx context.Context, account model.NewAccount) (model.Account, error)
	DeleteAccount(ctx context.Context, userID, provider string) error
}

type VerificationTokenRepo interface {
	GetVerificationToken(ctx context.Context, identifier, token string) (model.VerificationToken, error)
	CreateVerificationToken(ctx context.Context, token model.VerificationToken) (model.VerificationToken, error)
	DeleteVerificationToken(ctx context.Context, identifier, token string) error
	MarkTokenAsUsed(ctx context.Context, identifier, token string) error
	GetAndMarkTokenAsUsed(ctx context.Context, identifier, token string) (model.VerificationToken, error)
}
