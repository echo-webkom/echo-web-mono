package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const (
	CMSPostNamespacePosts      = "cms:posts"
	CMSPostNamespacePostBySlug = "cms:post-by-slug"
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
	client          *sanity.Client
	logger          port.Logger
	postsCache      port.Cache[[]model.CMSPost]
	postBySlugCache port.Cache[*model.CMSPost]
}

func NewPostRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSPostRepo {
	return &PostRepo{
		client:          client,
		logger:          logger,
		postsCache:      cache.NewCache[[]model.CMSPost](redisClient, CMSPostNamespacePosts),
		postBySlugCache: cache.NewCache[*model.CMSPost](redisClient, CMSPostNamespacePostBySlug),
	}
}

func (r *PostRepo) GetAllPosts(ctx context.Context) ([]model.CMSPost, error) {
	r.logger.Info(ctx, "getting all posts from sanity")
	if v, ok := r.postsCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all posts")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all posts")
	result, err := sanity.Query[[]model.CMSPost](ctx, r.client, allPostsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all posts from sanity", "error", err)
		return nil, err
	}

	r.postsCache.Set("all", result, cmsCacheTTL)
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
	if v, ok := r.postBySlugCache.Get(slug); ok {
		r.logger.Info(ctx, "cache hit for post by slug", "slug", slug)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for post by slug", "slug", slug)
	result, err := sanity.Query[*model.CMSPost](ctx, r.client, postBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get post by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}

	r.postBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}
