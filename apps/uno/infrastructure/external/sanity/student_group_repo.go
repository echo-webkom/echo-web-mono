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
	CMSStudentGroupNamespaceStudentGroups = "cms:student-groups"
)

const allStudentGroupsQuery = `
*[_type == "studentGroup"
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
}
`

type StudentGroupRepo struct {
	client             *sanity.Client
	logger             port.Logger
	studentGroupsCache port.Cache[[]model.CMSStudentGroup]
}

func NewStudentGroupRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSStudentGroupRepo {
	return &StudentGroupRepo{
		client:             client,
		logger:             logger,
		studentGroupsCache: cache.NewCache[[]model.CMSStudentGroup](redisClient, CMSStudentGroupNamespaceStudentGroups, logger),
	}
}

func (r *StudentGroupRepo) GetStudentGroupsByType(ctx context.Context, groupType string) ([]model.CMSStudentGroup, error) {
	r.logger.Info(ctx, "getting student groups by type from sanity", "type", groupType)
	studentGroups, err := r.getAllStudentGroups(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]model.CMSStudentGroup, 0, len(studentGroups))
	for _, group := range studentGroups {
		if group.GroupType == groupType {
			result = append(result, group)
		}
	}
	r.logger.Info(ctx, "filtered student groups by type from all student groups cache", "type", groupType, "count", len(result))
	return result, nil
}

func (r *StudentGroupRepo) GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error) {
	r.logger.Info(ctx, "getting student group by slug from sanity", "slug", slug)
	studentGroups, err := r.getAllStudentGroups(ctx)
	if err != nil {
		return nil, err
	}

	for i := range studentGroups {
		if studentGroups[i].Slug == slug {
			r.logger.Info(ctx, "found student group by slug in all student groups cache", "slug", slug)
			return &studentGroups[i], nil
		}
	}
	r.logger.Info(ctx, "student group by slug not found in all student groups cache", "slug", slug)
	return nil, nil
}

func (r *StudentGroupRepo) getAllStudentGroups(ctx context.Context) ([]model.CMSStudentGroup, error) {
	r.logger.Info(ctx, "getting all student groups from sanity")
	if v, ok := r.studentGroupsCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all student groups")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all student groups")

	result, err := sanity.Query[[]model.CMSStudentGroup](ctx, r.client, allStudentGroupsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all student groups from sanity", "error", err)
		return nil, err
	}

	r.studentGroupsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}
