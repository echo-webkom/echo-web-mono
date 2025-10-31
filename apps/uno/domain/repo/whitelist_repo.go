package repo

import (
	"context"
	"uno/domain/model"
)

type WhitelistRepo interface {
	IsWhitelisted(ctx context.Context, email string) (bool, error)
	GetWhitelistByEmail(ctx context.Context, email string) (model.Whitelist, error)
	GetWhitelist(ctx context.Context) ([]model.Whitelist, error)
}
