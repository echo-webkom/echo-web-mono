package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const CMSHSApplicationNamespaceHSApplications = "cms:hs-applications"

const allHSApplicationsQuery = `
*[_type == "hs-application" && !(_id in path('drafts.**'))] {
  "profile": profile->{
    _id,
    name,
    "image": picture
  },
  "poster": poster.asset->url
}
`

type HSApplicationRepo struct {
	client              *sanity.Client
	logger              port.Logger
	hsApplicationsCache port.Cache[[]model.CMSHSApplication]
}

func NewHSApplicationRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSHSApplicationRepo {
	return &HSApplicationRepo{
		client:              client,
		logger:              logger,
		hsApplicationsCache: cache.NewCache[[]model.CMSHSApplication](redisClient, CMSHSApplicationNamespaceHSApplications),
	}
}

func (r *HSApplicationRepo) GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error) {
	r.logger.Info(ctx, "getting all hs applications from sanity")
	if v, ok := r.hsApplicationsCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all hs applications")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all hs applications")
	result, err := sanity.Query[[]model.CMSHSApplication](ctx, r.client, allHSApplicationsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all hs applications from sanity", "error", err)
		return nil, err
	}

	r.hsApplicationsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}
