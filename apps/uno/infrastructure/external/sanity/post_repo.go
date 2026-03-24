package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const allPostsQuery = `
*[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "authors": authors[]->{
    _id,
    name,
    image,
  },
  image,
  body
}
`

type PostRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewPostRepo(client *sanity.Client, logger port.Logger) port.CMSPostRepo {
	return &PostRepo{client: client, logger: logger}
}

func (r *PostRepo) GetAllPosts(ctx context.Context) ([]model.CMSPost, error) {
	result, err := sanity.Query[[]model.CMSPost](ctx, r.client, allPostsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch posts from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
