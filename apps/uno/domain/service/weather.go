package service

import (
	"context"
	"sync"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

const weatherCacheTTL = 30 * time.Minute

type WeatherService struct {
	weatherRepo port.WeatherRepo

	mu              sync.RWMutex
	cachedWeather   *model.Weather
	cacheExpiration time.Time
}

func NewWeatherService(weatherRepo port.WeatherRepo) *WeatherService {
	return &WeatherService{weatherRepo: weatherRepo}
}

func (s *WeatherService) GetCurrentWeather(ctx context.Context) (model.Weather, error) {
	s.mu.RLock()
	if s.cachedWeather != nil && time.Now().Before(s.cacheExpiration) {
		defer s.mu.RUnlock()
		return *s.cachedWeather, nil
	}
	s.mu.RUnlock()

	weather, err := s.weatherRepo.GetCurrentWeather(ctx)
	if err != nil {
		return model.Weather{}, err
	}

	s.mu.Lock()
	s.cachedWeather = &weather
	s.cacheExpiration = time.Now().Add(weatherCacheTTL)
	s.mu.Unlock()

	return weather, nil
}
