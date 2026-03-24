package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const allMerchQuery = `
*[_type == "merch" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  price,
  image,
  body
}
`

type MerchRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewMerchRepo(client *sanity.Client, logger port.Logger) port.CMSMerchRepo {
	return &MerchRepo{client: client, logger: logger}
}

func (r *MerchRepo) GetAllMerch(ctx context.Context) ([]model.CMSMerch, error) {
	result, err := sanity.Query[[]model.CMSMerch](ctx, r.client, allMerchQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch merch from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
