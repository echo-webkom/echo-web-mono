package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const moviesQuery = `
*[_type == "movie"
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
  _id,
  title,
  date,
  link,
  image,
}
`

type MovieRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewMovieRepo(client *sanity.Client, logger port.Logger) port.CMSMovieRepo {
	return &MovieRepo{client: client, logger: logger}
}

func (r *MovieRepo) GetAllMovies(ctx context.Context) ([]model.CMSMovie, error) {
	result, err := sanity.Query[[]model.CMSMovie](ctx, r.client, moviesQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch movies from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
