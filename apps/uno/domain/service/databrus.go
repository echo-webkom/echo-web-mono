package service

import (
	"context"
	"sync"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

var (
	upcomingUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837?segment=kommende"
	// previousUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837?segment=historikk"
	tableUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837"

	cacheTTL = 6 * time.Hour
)

type cacheEntry[T any] struct {
	data      T
	expiresAt time.Time
}

func (c *cacheEntry[T]) valid() bool {
	return !c.expiresAt.IsZero() && time.Now().Before(c.expiresAt)
}

type DatabrusService struct {
	logger       port.Logger
	databrusRepo port.DatabrusRepo

	mu           sync.RWMutex
	matchesCache cacheEntry[[]model.Match]
	tableCache   cacheEntry[model.Table]
}

func NewDatabrusService(logger port.Logger, databrusRepo port.DatabrusRepo) *DatabrusService {
	return &DatabrusService{
		logger:       logger,
		databrusRepo: databrusRepo,
	}
}

func (s *DatabrusService) GetMatches(ctx context.Context) ([]model.Match, error) {
	s.mu.RLock()
	if s.matchesCache.valid() {
		defer s.mu.RUnlock()
		return s.matchesCache.data, nil
	}
	s.mu.RUnlock()

	matches, err := s.databrusRepo.GetDatabrusMatches(ctx, upcomingUrl, model.Upcoming)
	if err != nil {
		return nil, err
	}

	s.mu.Lock()
	s.matchesCache = cacheEntry[[]model.Match]{
		data:      matches,
		expiresAt: time.Now().Add(cacheTTL),
	}
	s.mu.Unlock()

	return matches, nil
}

func (s *DatabrusService) GetTable(ctx context.Context) (model.Table, error) {
	s.mu.RLock()
	if s.tableCache.valid() {
		defer s.mu.RUnlock()
		return s.tableCache.data, nil
	}
	s.mu.RUnlock()

	table, err := s.databrusRepo.GetDatabrusTable(ctx, tableUrl)
	if err != nil {
		return nil, err
	}

	s.mu.Lock()
	s.tableCache = cacheEntry[model.Table]{
		data:      table,
		expiresAt: time.Now().Add(cacheTTL),
	}
	s.mu.Unlock()

	return table, nil
}
