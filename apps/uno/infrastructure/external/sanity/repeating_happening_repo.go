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
	CMSRepeatingHappeningNamespaceRepeatingHappenings = "cms:repeating-happenings"
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
	client                   *sanity.Client
	logger                   port.Logger
	repeatingHappeningsCache port.Cache[[]model.CMSRepeatingHappening]
}

func hasInvalidRepeatingHappeningType(happenings []model.CMSRepeatingHappening) bool {
	for _, happening := range happenings {
		if happening.Type == "" {
			return true
		}
	}

	return false
}

func NewRepeatingHappeningRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSRepeatingHappeningRepo {
	return &RepeatingHappeningRepo{
		client:                   client,
		logger:                   logger,
		repeatingHappeningsCache: cache.NewCache[[]model.CMSRepeatingHappening](redisClient, CMSRepeatingHappeningNamespaceRepeatingHappenings),
	}
}

func (r *RepeatingHappeningRepo) GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error) {
	r.logger.Info(ctx, "getting all repeating happenings from sanity")
	if v, ok := r.repeatingHappeningsCache.Get("all"); ok {
		if hasInvalidRepeatingHappeningType(v) {
			r.logger.Warn(ctx, "invalid all repeating happenings cache entry detected, refreshing", "reason", "missing _type")
			r.repeatingHappeningsCache.Delete("all")
		} else {
			r.logger.Info(ctx, "cache hit for all repeating happenings")
			return v, nil
		}
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

func (r *RepeatingHappeningRepo) GetRepeatingHappeningBySlug(ctx context.Context, slug string) (*model.CMSRepeatingHappening, error) {
	r.logger.Info(ctx, "getting repeating happening by slug from sanity", "slug", slug)
	happenings, err := r.GetAllRepeatingHappenings(ctx)
	if err != nil {
		return nil, err
	}

	for i := range happenings {
		if happenings[i].Slug == slug {
			r.logger.Info(ctx, "found repeating happening by slug in all repeating happenings cache", "slug", slug)
			return &happenings[i], nil
		}
	}

	r.logger.Info(ctx, "repeating happening by slug not found in all repeating happenings cache", "slug", slug)
	return nil, nil
}
