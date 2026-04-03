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
	CMSMerchNamespaceMerch       = "cms:merch"
	CMSMerchNamespaceMerchBySlug = "cms:merch-by-slug"
)

const allMerchQuery = `
*[_type == "merch" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  price,
  image,
  body
}
`

type MerchRepo struct {
	client           *sanity.Client
	logger           port.Logger
	merchCache       port.Cache[[]model.CMSMerch]
	merchBySlugCache port.Cache[*model.CMSMerch]
}

func NewMerchRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSMerchRepo {
	return &MerchRepo{
		client:           client,
		logger:           logger,
		merchCache:       cache.NewCache[[]model.CMSMerch](redisClient, CMSMerchNamespaceMerch),
		merchBySlugCache: cache.NewCache[*model.CMSMerch](redisClient, CMSMerchNamespaceMerchBySlug),
	}
}

func (r *MerchRepo) GetAllMerch(ctx context.Context) ([]model.CMSMerch, error) {
	r.logger.Info(ctx, "getting all merch from sanity")
	if v, ok := r.merchCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all merch")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all merch")
	result, err := sanity.Query[[]model.CMSMerch](ctx, r.client, allMerchQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all merch from sanity", "error", err)
		return nil, err
	}

	r.merchCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

const merchBySlugQuery = `
*[_type == "merch" && slug.current == $slug && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  price,
  image,
  body
}[0]
`

func (r *MerchRepo) GetMerchBySlug(ctx context.Context, slug string) (*model.CMSMerch, error) {
	r.logger.Info(ctx, "getting merch by slug from sanity", "slug", slug)
	if v, ok := r.merchBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for merch by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for merch by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSMerch](ctx, r.client, merchBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get merch by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.merchBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
