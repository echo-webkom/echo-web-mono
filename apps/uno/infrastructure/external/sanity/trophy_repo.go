package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const CMSTrophyNamespaceTrophies = "cms:trophies"

// const trophiesBySlugQuery = `
// *[_type == "trophies" && slug.current == $slug][0]{
//   _id,
//   title,
//   "slug": slug.current,
//   baseImage,
//   baseDescription,
//   trophies[]{
//     _key,
//     title,
//     description,
//     level,
//     image
//   }
// `;

const allTrophiesQuery = `
*[_type == "trophies"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  baseImage,
  baseDescription,
  trophies[]{
    _key,
    title,
    description,
    level,
    image
  },
}
`;

type TrophyRepo struct {
	client      *sanity.Client
	logger      port.Logger
	trophyCache port.Cache[[]model.CMSTrophy]
}

func NewTrophyRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSTrophyRepo {
	return &TrophyRepo{
		client:             client,
		logger:             logger,
		trophyCache: cache.NewCache[[]model.CMSTrophy](redisClient, CMSTrophyNamespaceTrophies),
	}
}

// func (r *TrophyRepo) GetTrophiesBySlug(ctx context.Context, groupType string) ([]model.CMSTrophy, error) {
// 	r.logger.Info(ctx, "getting trophies by slug from sanity", "type", groupType)
// 	trophy, err := r.GetAllTrophies(ctx)
// 	if err != nil {
// 		return nil, err
// 	}

// 	result := make([]model.CMSTrophy, 0, len(trophy))
// 	for _, group := range trophy {
// 		if group.GroupType == groupType {
// 			result = append(result, group)
// 		}
// 	}
// 	r.logger.Info(ctx, "filtered trophies by slug from all trophies cache", "type", groupType, "count", len(result))
// 	return result, nil
// }

func (r *TrophyRepo) GetAllTrophies(ctx context.Context) ([]model.CMSTrophy, error) {
	r.logger.Info(ctx, "getting all trophies from sanity")
	if v, ok := r.trophyCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all trophies")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all trophies")
	result, err := sanity.Query[[]model.CMSTrophy](ctx, r.client, allTrophiesQuery, nil)	
	if err != nil {
		r.logger.Error(ctx, "failed to get all Trophies from sanity", "error", err)
		return nil, err
	}

	r.trophyCache.Set("all", result, cmsCacheTTL)
	return result, nil
}