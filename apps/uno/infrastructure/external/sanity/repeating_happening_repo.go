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
	CMSRepeatingHappeningNamespaceRepeatingHappenings      = "cms:repeating-happenings"
	CMSRepeatingHappeningNamespaceRepeatingHappeningBySlug = "cms:repeating-happening-by-slug"
)

const allRepeatingHappeningsQuery = `
*[_type == "repeatingHappening"
  && !(_id in path('drafts.**'))] {
  _id,
  _type,
  title,
  "slug": slug.current,
  happeningType,
  "organizers": organizers[]->{
    _id,
    name,
    "slug": slug.current
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "location": location->{
    name,
    link,
  },
  dayOfWeek,
  startTime,
  endTime,
  startDate,
  endDate,
  interval,
  cost,
  ignoredDates,
  externalLink,
  body,
}
`

type RepeatingHappeningRepo struct {
	client                        *sanity.Client
	logger                        port.Logger
	repeatingHappeningsCache      port.Cache[[]model.CMSRepeatingHappening]
	repeatingHappeningBySlugCache port.Cache[*model.CMSRepeatingHappening]
}

func NewRepeatingHappeningRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSRepeatingHappeningRepo {
	return &RepeatingHappeningRepo{
		client:                        client,
		logger:                        logger,
		repeatingHappeningsCache:      cache.NewCache[[]model.CMSRepeatingHappening](redisClient, CMSRepeatingHappeningNamespaceRepeatingHappenings),
		repeatingHappeningBySlugCache: cache.NewCache[*model.CMSRepeatingHappening](redisClient, CMSRepeatingHappeningNamespaceRepeatingHappeningBySlug),
	}
}

func (r *RepeatingHappeningRepo) GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error) {
	r.logger.Info(ctx, "getting all repeating happenings from sanity")
	if v, ok := r.repeatingHappeningsCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all repeating happenings")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all repeating happenings")
	result, err := sanity.Query[[]model.CMSRepeatingHappening](ctx, r.client, allRepeatingHappeningsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all repeating happenings from sanity", "error", err)
		return nil, err
	}

	r.repeatingHappeningsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

const repeatingHappeningBySlugQuery = `
*[_type == "repeatingHappening"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  _id,
  _type,
  title,
  "slug": slug.current,
  happeningType,
  "organizers": organizers[]->{
    _id,
    name,
    "slug": slug.current
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "location": location->{
    name,
    link,
  },
  dayOfWeek,
  startTime,
  endTime,
  startDate,
  endDate,
  interval,
  cost,
  ignoredDates,
  externalLink,
  body,
}[0]
`

func (r *RepeatingHappeningRepo) GetRepeatingHappeningBySlug(ctx context.Context, slug string) (*model.CMSRepeatingHappening, error) {
	r.logger.Info(ctx, "getting repeating happening by slug from sanity", "slug", slug)
	if v, ok := r.repeatingHappeningBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for repeating happening by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for repeating happening by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSRepeatingHappening](ctx, r.client, repeatingHappeningBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get repeating happening by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.repeatingHappeningBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
