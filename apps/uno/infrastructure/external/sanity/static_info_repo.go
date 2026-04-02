package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const staticInfoQuery = `
*[_type == "staticInfo" && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}
`

type StaticInfoRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewStaticInfoRepo(client *sanity.Client, logger port.Logger) port.CMSStaticInfoRepo {
	return &StaticInfoRepo{client: client, logger: logger}
}

func (r *StaticInfoRepo) GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error) {
	r.logger.Info(ctx, "getting all static info from sanity")
	result, err := sanity.Query[[]model.CMSStaticInfo](ctx, r.client, staticInfoQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all static info from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

const staticInfoBySlugQuery = `
*[_type == "staticInfo"
  && pageType == $pageType
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}[0]
`

func (r *StaticInfoRepo) GetStaticInfoBySlug(ctx context.Context, pageType string, slug string) (*model.CMSStaticInfo, error) {
	r.logger.Info(ctx, "getting static info by slug from sanity", "pageType", pageType, "slug", slug)
	result, err := sanity.Query[*model.CMSStaticInfo](ctx, r.client, staticInfoBySlugQuery, map[string]any{
		"pageType": pageType,
		"slug":     slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get static info by slug from sanity", "pageType", pageType, "slug", slug, "error", err)
		return nil, err
	}
	return result, nil
}
