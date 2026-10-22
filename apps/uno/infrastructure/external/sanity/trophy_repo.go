package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const CMSTrophyNamespaceTrophies = "cms:trophies"

const trophyByTitleAndAmountQuery = `
*[_type == "trophy" && lower(title) == lower($title)][0].trophies[amount_needed <= $amount]
  | order(amount_needed desc)[0]
`

type TrophyRepo struct {
	client        *sanity.Client
	logger        port.Logger
	trophiesCache port.Cache[[]model.CMSTrophyCollection]
}

func NewTrophyRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSTrophyRepo {
	return &TrophyRepo{
		client:        client,
		logger:        logger,
		trophiesCache: cache.NewCache[[]model.CMSTrophyCollection](redisClient, CMSTrophyNamespaceTrophies, logger),
	}
}

func (r *TrophyRepo) GetTrophyByTitleAndAmount(
	ctx context.Context,
	title string,
	amount int,
) (*model.CMSTrophy, error) {
	r.logger.Info(ctx, "getting trophy from sanity", "title", title, "amount", amount)
	result, err := sanity.Query[*model.CMSTrophy](ctx, r.client, trophyByTitleAndAmountQuery, map[string]any{
		"title":  title,
		"amount": amount,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get trophy from sanity", "title", title, "amount", amount, "error", err)
		return nil, err
	}

	return result, nil
}
