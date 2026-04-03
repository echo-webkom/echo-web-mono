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
	CMSJobAdNamespaceJobAds      = "cms:job-ads"
	CMSJobAdNamespaceJobAdBySlug = "cms:job-ad-by-slug"
)

const jobAdsQuery = `
*[_type == "job"
  && !(_id in path('drafts.**'))
  && expiresAt > now()]
  | order(weight desc, deadline desc) {
  _id,
  _createdAt,
  _updatedAt,
  weight,
  title,
  "slug": slug.current,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
  expiresAt,
  "locations": locations[]->{
    _id,
    name,
  },
  jobType,
  link,
  deadline,
  degreeYears,
  body
}
`

type JobAdRepo struct {
	client           *sanity.Client
	logger           port.Logger
	jobAdsCache      port.Cache[[]model.CMSJobAd]
	jobAdBySlugCache port.Cache[*model.CMSJobAd]
}

func NewJobAdRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSJobAdRepo {
	return &JobAdRepo{
		client:           client,
		logger:           logger,
		jobAdsCache:      cache.NewCache[[]model.CMSJobAd](redisClient, CMSJobAdNamespaceJobAds),
		jobAdBySlugCache: cache.NewCache[*model.CMSJobAd](redisClient, CMSJobAdNamespaceJobAdBySlug),
	}
}

func (r *JobAdRepo) GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error) {
	r.logger.Info(ctx, "getting all job ads from sanity")
	if v, ok := r.jobAdsCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all job ads")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all job ads")
	result, err := sanity.Query[[]model.CMSJobAd](ctx, r.client, jobAdsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all job ads from sanity", "error", err)
		return nil, err
	}

	r.jobAdsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

const jobAdBySlugQuery = `
*[_type == "job"
  && !(_id in path('drafts.**'))
  && expiresAt > now()
  && slug.current == $slug] {
  _id,
  _createdAt,
  _updatedAt,
  weight,
  title,
  "slug": slug.current,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
  expiresAt,
  "locations": locations[]->{
    _id,
    name,
  },
  jobType,
  link,
  deadline,
  degreeYears,
  body
}[0]
`

func (r *JobAdRepo) GetJobAdBySlug(ctx context.Context, slug string) (*model.CMSJobAd, error) {
	r.logger.Info(ctx, "getting job ad by slug from sanity", "slug", slug)
	if v, ok := r.jobAdBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for job ad by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for job ad by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSJobAd](ctx, r.client, jobAdBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get job ad by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.jobAdBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
