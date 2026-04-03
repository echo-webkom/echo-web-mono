package sanityinfra

import (
	"context"
	"fmt"
	"strings"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const (
	CMSHappeningNamespaceHappenings      = "cms:happenings"
	CMSHappeningNamespaceHappeningBySlug = "cms:happening-by-slug"
	CMSHappeningNamespaceHomeHappenings  = "cms:home-happenings"
	CMSHappeningNamespaceContactsBySlug  = "cms:contacts-by-slug"
)

const allHappeningsQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))]
  | order(date asc) {
    _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  isPinned,
  happeningType,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
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
  "date": date,
  "endDate": endDate,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
    link
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    id,
    title,
    required,
    type,
    options,
  },
  externalLink,
  body
}
`

const happeningBySlugQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && slug.current == $slug
][0] {
  _id,
  _createdAt,
  _updatedAt,
  _type,
  title,
  "slug": slug.current,
  isPinned,
  happeningType,
  hideRegistrations,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
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
  "date": date,
  "endDate": endDate,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
    link
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  externalLink,
  body
}
`

const homeHappeningsQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && (isPinned || date >= now())
  && happeningType in $happeningTypes
]
| order(coalesce(isPinned, false) desc, date asc) {
  _id,
  title,
  isPinned,
  happeningType,
  date,
  registrationStart,
  "slug": slug.current,
  "image": company->image,
  "organizers": organizers[]->{
    name
  }.name
}[0...$n]
`

const happeningContactsBySlugQuery = `
*[_type == "happening" && slug.current == $slug] {
"contacts": contacts[] {
email,
"profile": profile->{
  _id,
  name,
},
},
}[0].contacts
`

type HappeningRepo struct {
	client               *sanity.Client
	logger               port.Logger
	happeningsCache      port.Cache[[]model.CMSHappening]
	happeningBySlugCache port.Cache[*model.CMSHappening]
	homeHappeningsCache  port.Cache[[]model.CMSHomeHappening]
	contactsBySlugCache  port.Cache[[]model.CMSContact]
}

func NewHappeningRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSHappeningRepo {
	return &HappeningRepo{
		client:               client,
		logger:               logger,
		happeningsCache:      cache.NewCache[[]model.CMSHappening](redisClient, CMSHappeningNamespaceHappenings),
		happeningBySlugCache: cache.NewCache[*model.CMSHappening](redisClient, CMSHappeningNamespaceHappeningBySlug),
		homeHappeningsCache:  cache.NewCache[[]model.CMSHomeHappening](redisClient, CMSHappeningNamespaceHomeHappenings),
		contactsBySlugCache:  cache.NewCache[[]model.CMSContact](redisClient, CMSHappeningNamespaceContactsBySlug),
	}
}

func (r *HappeningRepo) GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	r.logger.Info(ctx, "getting all happenings from sanity")
	if v, ok := r.happeningsCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all happenings")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all happenings")
	result, err := sanity.Query[[]model.CMSHappening](ctx, r.client, allHappeningsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all happenings from sanity", "error", err)
		return nil, err
	}

	r.happeningsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (r *HappeningRepo) GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error) {
	r.logger.Info(ctx, "getting happening by slug from sanity", "slug", slug)
	if v, ok := r.happeningBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for happening by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for happening by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSHappening](ctx, r.client, happeningBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get happening by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.happeningBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}

func (r *HappeningRepo) GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error) {
	key := fmt.Sprintf("%s:%d", strings.Join(types, ","), n)
	r.logger.Info(ctx, "getting home happenings from sanity", "types", types, "n", n)
	if v, ok := r.homeHappeningsCache.Get(key); ok {
		r.logger.Info(ctx, "cache hit for home happenings", "key", key)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for home happenings", "key", key)
	result, err := sanity.Query[[]model.CMSHomeHappening](ctx, r.client, homeHappeningsQuery, map[string]any{
		"happeningTypes": types,
		"n":              n,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get home happenings from sanity", "error", err)
		return nil, err
	}

	r.homeHappeningsCache.Set(key, result, cmsCacheTTL)
	return result, nil
}

func (r *HappeningRepo) GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error) {
	r.logger.Info(ctx, "getting happening contacts by slug from sanity", "slug", slug)
	if v, ok := r.contactsBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for happening contacts by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for happening contacts by slug", "slug", slug)
	result, err := sanity.Query[[]model.CMSContact](ctx, r.client, happeningContactsBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get happening contacts from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.contactsBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
