package sanityinfra

import (
	"context"
	"fmt"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const (
	CMSStudentGroupNamespaceStudentGroupsByType = "cms:student-groups-by-type"
	CMSStudentGroupNamespaceStudentGroupBySlug  = "cms:student-group-by-slug"
)

const studentGroupsByTypeQuery = `
*[_type == "studentGroup"
  && groupType == $type
  && !(_id in path('drafts.**'))] | order(_createdAt asc) {
  _id,
  _createdAt,
  _updatedAt,
  name,
  isActive,
  groupType,
  "slug": slug.current,
  description,
  image,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      "image": picture,
      socials,
    },
  },
  "socials": socials {
    facebook,
    instagram,
    linkedin,
    email,
  }
}[0..$n]
`

const studentGroupBySlugQuery = `
*[_type == "studentGroup"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  name,
  isActive,
  groupType,
  "slug": slug.current,
  description,
  image,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      "image": picture,
      socials,
    },
  },
  "socials": socials {
    facebook,
    instagram,
    linkedin,
    email,
  }
}[0]
`

type StudentGroupRepo struct {
	client                   *sanity.Client
	logger                   port.Logger
	studentGroupsByTypeCache port.Cache[[]model.CMSStudentGroup]
	studentGroupBySlugCache  port.Cache[*model.CMSStudentGroup]
}

func NewStudentGroupRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSStudentGroupRepo {
	return &StudentGroupRepo{
		client:                   client,
		logger:                   logger,
		studentGroupsByTypeCache: cache.NewCache[[]model.CMSStudentGroup](redisClient, CMSStudentGroupNamespaceStudentGroupsByType),
		studentGroupBySlugCache:  cache.NewCache[*model.CMSStudentGroup](redisClient, CMSStudentGroupNamespaceStudentGroupBySlug),
	}
}

func (r *StudentGroupRepo) GetStudentGroupsByType(ctx context.Context, groupType string, n int) ([]model.CMSStudentGroup, error) {
	key := fmt.Sprintf("%s:%d", groupType, n)
	r.logger.Info(ctx, "getting student groups by type from sanity", "type", groupType, "n", n)
	if v, ok := r.studentGroupsByTypeCache.Get(key); ok {
		r.logger.Info(ctx, "cache hit for student groups by type", "key", key)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for student groups by type", "key", key)
	result, err := sanity.Query[[]model.CMSStudentGroup](ctx, r.client, studentGroupsByTypeQuery, map[string]any{
		"type": groupType,
		"n":    n,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get student groups from sanity", "type", groupType, "error", err)
		return nil, err
	}

	r.studentGroupsByTypeCache.Set(key, result, cmsCacheTTL)
	return result, nil
}

func (r *StudentGroupRepo) GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error) {
	r.logger.Info(ctx, "getting student group by slug from sanity", "slug", slug)
	if v, ok := r.studentGroupBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for student group by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for student group by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSStudentGroup](ctx, r.client, studentGroupBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get student group by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.studentGroupBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
