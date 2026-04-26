package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const CMSBannerNamespaceBanner = "cms:banner"

const bannerQuery = `
*[_type == "banner" && _id == "banner" && !(_id in path('drafts.**'))] {
  backgroundColor,
  textColor,
  text,
  expiringDate,
  linkTo,
}[0]
`

type BannerRepo struct {
	client      *sanity.Client
	logger      port.Logger
	bannerCache port.Cache[*model.CMSBanner]
}

func NewBannerRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSBannerRepo {
	return &BannerRepo{
		client:      client,
		logger:      logger,
		bannerCache: cache.NewCache[*model.CMSBanner](redisClient, CMSBannerNamespaceBanner, logger),
	}
}

func (r *BannerRepo) GetBanner(ctx context.Context) (*model.CMSBanner, error) {
	r.logger.Info(ctx, "getting banner from sanity")
	if v, ok := r.bannerCache.Get("banner"); ok {
		r.logger.Info(ctx, "cache hit for banner")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for banner")
	result, err := sanity.Query[*model.CMSBanner](ctx, r.client, bannerQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get banner from sanity", "error", err)
		return nil, err
	}

	r.bannerCache.Set("banner", result, cmsCacheTTL)
	return result, nil
}
