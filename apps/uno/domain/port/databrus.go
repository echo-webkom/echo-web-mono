package port

import (
	"context"
	"uno/domain/model"
)

type DatabrusRepo interface {
	GetDatabrusMatches(ctx context.Context, url string, matchType model.MatchType) ([]model.Match, error)
	GetDatabrusTable(ctx context.Context, url string) (model.Table, error)
}
