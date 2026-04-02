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
	r.logger.Info(ctx, "getting all movies from sanity")
	result, err := sanity.Query[[]model.CMSMovie](ctx, r.client, moviesQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all movies from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

const upcomingMoviesQuery = `
*[_type == "movie"
  && !(_id in path('drafts.**'))
  && date > now()]
  | order(date asc) {
  _id,
  title,
  date,
  link,
  image,
}[0..$n]
`

func (r *MovieRepo) GetUpcomingMovies(ctx context.Context, n int) ([]model.CMSMovie, error) {
	r.logger.Info(ctx, "getting upcoming movies from sanity", "n", n)
	result, err := sanity.Query[[]model.CMSMovie](ctx, r.client, upcomingMoviesQuery, map[string]any{
		"n": n - 1,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get upcoming movies from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
