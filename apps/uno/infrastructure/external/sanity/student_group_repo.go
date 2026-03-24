package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
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
      picture,
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
      picture,
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
	client *sanity.Client
	logger port.Logger
}

func NewStudentGroupRepo(client *sanity.Client, logger port.Logger) port.CMSStudentGroupRepo {
	return &StudentGroupRepo{client: client, logger: logger}
}

func (r *StudentGroupRepo) GetStudentGroupsByType(ctx context.Context, groupType string, n int) ([]model.CMSStudentGroup, error) {
	r.logger.Info(ctx, "getting student groups by type from sanity", "type", groupType, "n", n)
	result, err := sanity.Query[[]model.CMSStudentGroup](ctx, r.client, studentGroupsByTypeQuery, map[string]any{
		"type": groupType,
		"n":    n,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get student groups from sanity", "type", groupType, "error", err)
		return nil, err
	}
	return result, nil
}

func (r *StudentGroupRepo) GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error) {
	r.logger.Info(ctx, "getting student group by slug from sanity", "slug", slug)
	result, err := sanity.Query[*model.CMSStudentGroup](ctx, r.client, studentGroupBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get student group by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}
	return result, nil
}
