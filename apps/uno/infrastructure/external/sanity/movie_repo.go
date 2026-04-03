package sanityinfra

import (
	"context"
	"fmt"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const CMSMovieNamespaceMovies = "cms:movies"

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
	client      *sanity.Client
	logger      port.Logger
	moviesCache port.Cache[[]model.CMSMovie]
}

func NewMovieRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSMovieRepo {
	return &MovieRepo{
		client:      client,
		logger:      logger,
		moviesCache: cache.NewCache[[]model.CMSMovie](redisClient, CMSMovieNamespaceMovies),
	}
}

func (r *MovieRepo) GetAllMovies(ctx context.Context) ([]model.CMSMovie, error) {
	r.logger.Info(ctx, "getting all movies from sanity")
	if v, ok := r.moviesCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all movies")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all movies")
	result, err := sanity.Query[[]model.CMSMovie](ctx, r.client, moviesQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all movies from sanity", "error", err)
		return nil, err
	}

	r.moviesCache.Set("all", result, cmsCacheTTL)
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
	key := fmt.Sprintf("upcoming:%d", n)
	r.logger.Info(ctx, "getting upcoming movies from sanity", "n", n)
	if v, ok := r.moviesCache.Get(key); ok {
		r.logger.Info(ctx, "cache hit for upcoming movies", "key", key)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for upcoming movies", "key", key)
	result, err := sanity.Query[[]model.CMSMovie](ctx, r.client, upcomingMoviesQuery, map[string]any{
		"n": n - 1,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get upcoming movies from sanity", "error", err)
		return nil, err
	}

	r.moviesCache.Set(key, result, cmsCacheTTL)
	return result, nil
}
