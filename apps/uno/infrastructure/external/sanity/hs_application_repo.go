package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const allHSApplicationsQuery = `
*[_type == "hs-application" && !(_id in path('drafts.**'))] {
  "profile": profile->{
    _id,
    name,
    picture
  },
  "poster": poster.asset->url
}
`

type HSApplicationRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewHSApplicationRepo(client *sanity.Client, logger port.Logger) port.CMSHSApplicationRepo {
	return &HSApplicationRepo{client: client, logger: logger}
}

func (r *HSApplicationRepo) GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error) {
	r.logger.Info(ctx, "getting all hs applications from sanity")
	result, err := sanity.Query[[]model.CMSHSApplication](ctx, r.client, allHSApplicationsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all hs applications from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
