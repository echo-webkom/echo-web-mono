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
	r.logger.Info(ctx, "getting all posts from sanity")
	result, err := sanity.Query[[]model.CMSPost](ctx, r.client, allPostsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all posts from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

const postBySlugQuery = `
*[_type == "post" && slug.current == $slug && !(_id in path('drafts.**'))] {
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
}[0]
`

func (r *PostRepo) GetPostBySlug(ctx context.Context, slug string) (*model.CMSPost, error) {
	r.logger.Info(ctx, "getting post by slug from sanity", "slug", slug)
	result, err := sanity.Query[*model.CMSPost](ctx, r.client, postBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get post by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}
	return result, nil
}
