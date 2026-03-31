package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const bannerQuery = `
*[_type == "banner" && _id == "banner" && !(_id in path('drafts.**'))] {
  backgroundColor,
  textColor,
  text,
  expiringDate,
  linkTo,
}[0]
`

type BannerRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewBannerRepo(client *sanity.Client, logger port.Logger) port.CMSBannerRepo {
	return &BannerRepo{client: client, logger: logger}
}

func (r *BannerRepo) GetBanner(ctx context.Context) (*model.CMSBanner, error) {
	r.logger.Info(ctx, "getting banner from sanity")
	result, err := sanity.Query[*model.CMSBanner](ctx, r.client, bannerQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get banner from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
