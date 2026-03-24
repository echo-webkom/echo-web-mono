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
	result, err := sanity.Query[[]model.CMSStaticInfo](ctx, r.client, staticInfoQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch static info from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
