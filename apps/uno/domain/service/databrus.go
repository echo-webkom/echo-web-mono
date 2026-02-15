package service

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
)

const (
	cacheTTL   = 6 * time.Hour
	matchesKey = "matches"
	tableKey   = "table"
)

var (
	upcomingUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837?segment=kommende"
	// previousUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837?segment=historikk"
	tableUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837"
)

type DatabrusService struct {
	logger       port.Logger
	databrusRepo port.DatabrusRepo

	matchesCache port.Cache[[]model.Match]
	tableCache   port.Cache[model.Table]
}

func NewDatabrusService(logger port.Logger, databrusRepo port.DatabrusRepo) *DatabrusService {
	matchesCache := cache.NewInMemoryCache[[]model.Match]()
	tableCache := cache.NewInMemoryCache[model.Table]()

	return &DatabrusService{
		logger:       logger,
		databrusRepo: databrusRepo,
		matchesCache: matchesCache,
		tableCache:   tableCache,
	}
}

func (s *DatabrusService) GetMatches(ctx context.Context) ([]model.Match, error) {
	matches, ok := s.matchesCache.Get(matchesKey)
	if ok {
		return matches, nil
	}

	matches, err := s.databrusRepo.GetDatabrusMatches(ctx, upcomingUrl, model.Upcoming)
	if err != nil {
		return nil, err
	}

	s.matchesCache.Set(matchesKey, matches, cacheTTL)
	return matches, nil
}

func (s *DatabrusService) GetTable(ctx context.Context) (model.Table, error) {
	table, ok := s.tableCache.Get(tableKey)
	if ok {
		return table, nil
	}

	table, err := s.databrusRepo.GetDatabrusTable(ctx, tableUrl)
	if err != nil {
		return nil, err
	}

	s.tableCache.Set(tableKey, table, cacheTTL)
	return table, nil
}
