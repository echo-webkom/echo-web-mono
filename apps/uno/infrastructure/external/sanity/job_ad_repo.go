package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
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
	client *sanity.Client
	logger port.Logger
}

func NewJobAdRepo(client *sanity.Client, logger port.Logger) port.CMSJobAdRepo {
	return &JobAdRepo{client: client, logger: logger}
}

func (r *JobAdRepo) GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error) {
	r.logger.Info(ctx, "getting all job ads from sanity")
	result, err := sanity.Query[[]model.CMSJobAd](ctx, r.client, jobAdsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all job ads from sanity", "error", err)
		return nil, err
	}
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
	result, err := sanity.Query[*model.CMSJobAd](ctx, r.client, jobAdBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get job ad by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}
	return result, nil
}
