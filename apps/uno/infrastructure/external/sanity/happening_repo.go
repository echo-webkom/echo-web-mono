package sanityinfra

import (
	"context"
	"fmt"
	"strings"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const (
	CMSHappeningNamespaceHappenings     = "cms:happenings"
	CMSHappeningNamespaceContactsBySlug = "cms:contacts-by-slug"

	CMSHappeningNamespaceHomeHappenings = "cms:home-happenings"
	CMSHappeningHomeHappeningsTTL       = 15 * time.Minute
)

func createAllHappeningsQuery(extraFilters []string) string {
	filters := []string{
		`*[_type == "happening"`,
		`&& !(_id in path('drafts.**'))`,
	}
	filters = append(filters, extraFilters...)
	filters = append(filters, `] | order(date asc) { ... }`)

	filtersStr := strings.Join(filters, "\n")

	return fmt.Sprintf(`
%s {
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
    id,
    title,
    required,
    type,
    options,
  },
  externalLink,
  body
}
`, filtersStr)
}

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
	client              *sanity.Client
	logger              port.Logger
	happeningsCache     port.Cache[[]model.CMSHappening]
	homeHappeningsCache port.Cache[[]model.CMSHomeHappening]
	contactsBySlugCache port.Cache[[]model.CMSContact]
}

func hasInvalidHappeningType(happenings []model.CMSHappening) bool {
	for _, happening := range happenings {
		if happening.Type == "" {
			return true
		}
	}

	return false
}

func NewHappeningRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSHappeningRepo {
	return &HappeningRepo{
		client:              client,
		logger:              logger,
		happeningsCache:     cache.NewCache[[]model.CMSHappening](redisClient, CMSHappeningNamespaceHappenings),
		homeHappeningsCache: cache.NewCache[[]model.CMSHomeHappening](redisClient, CMSHappeningNamespaceHomeHappenings),
		contactsBySlugCache: cache.NewCache[[]model.CMSContact](redisClient, CMSHappeningNamespaceContactsBySlug),
	}
}

func (r *HappeningRepo) GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	r.logger.Info(ctx, "getting all happenings from sanity")
	if v, ok := r.happeningsCache.Get("all"); ok {
		if hasInvalidHappeningType(v) {
			r.logger.Warn(ctx, "invalid all happenings cache entry detected, refreshing", "reason", "missing _type")
			r.happeningsCache.Delete("all")
		} else {
			r.logger.Info(ctx, "cache hit for all happenings")
			return v, nil
		}
	}
	allHappeningsQuery := createAllHappeningsQuery(nil)
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
	happenings, err := r.GetAllHappenings(ctx)
	if err != nil {
		return nil, err
	}

	for i := range happenings {
		if happenings[i].Slug == slug {
			r.logger.Info(ctx, "found happening by slug in all happenings cache", "slug", slug)
			return &happenings[i], nil
		}
	}

	r.logger.Info(ctx, "happening by slug not found in all happenings cache", "slug", slug)
	return nil, nil
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

	r.homeHappeningsCache.Set(key, result, CMSHappeningHomeHappeningsTTL)
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

// GetAllPinnedHappenings gets all the happenings that are currently pinned.
func (r *HappeningRepo) GetAllPinnedHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	r.logger.Info(ctx, "getting all pinned happenings from sanity")
	allPinnedHappeningsQuery := createAllHappeningsQuery([]string{`&& isPinned == true`})
	result, err := sanity.Query[[]model.CMSHappening](ctx, r.client, allPinnedHappeningsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all pinned happenings from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

// UnpinHappenings unpins all provided happening ids.
func (r *HappeningRepo) UnpinHappenings(ctx context.Context, ids []string) error {
	r.logger.Info(ctx, "unpinning happenings in sanity", "ids", ids)
	patch := r.client.Patch()
	for _, id := range ids {
		patch.Set(id, map[string]any{
			"isPinned": false,
		})
	}
	return patch.Commit(ctx)
}
