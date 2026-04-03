package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const (
	CMSStaticInfoNamespaceStaticInfo       = "cms:static-info"
	CMSStaticInfoNamespaceStaticInfoBySlug = "cms:static-info-by-slug"
)

const staticInfoQuery = `
*[_type == "staticInfo" && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}
`

type StaticInfoRepo struct {
	client                *sanity.Client
	logger                port.Logger
	staticInfoCache       port.Cache[[]model.CMSStaticInfo]
	staticInfoBySlugCache port.Cache[*model.CMSStaticInfo]
}

func NewStaticInfoRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSStaticInfoRepo {
	return &StaticInfoRepo{
		client:                client,
		logger:                logger,
		staticInfoCache:       cache.NewCache[[]model.CMSStaticInfo](redisClient, CMSStaticInfoNamespaceStaticInfo),
		staticInfoBySlugCache: cache.NewCache[*model.CMSStaticInfo](redisClient, CMSStaticInfoNamespaceStaticInfoBySlug),
	}
}

func (r *StaticInfoRepo) GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error) {
	r.logger.Info(ctx, "getting all static info from sanity")
	if v, ok := r.staticInfoCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all static info")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all static info")
	result, err := sanity.Query[[]model.CMSStaticInfo](ctx, r.client, staticInfoQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all static info from sanity", "error", err)
		return nil, err
	}

	r.staticInfoCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

const staticInfoBySlugQuery = `
*[_type == "staticInfo"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}[0]
`

func (r *StaticInfoRepo) GetStaticInfoBySlug(ctx context.Context, slug string) (*model.CMSStaticInfo, error) {
	r.logger.Info(ctx, "getting static info by slug from sanity", "slug", slug)
	if v, ok := r.staticInfoBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for static info by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for static info by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSStaticInfo](ctx, r.client, staticInfoBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get static info by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.staticInfoBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
