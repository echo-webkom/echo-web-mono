package service

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
)

const (
	weatherCacheTTL = 15 * time.Minute
	cacheKey        = "weather"
)

type WeatherService struct {
	weatherRepo port.WeatherRepo

	weatherCache port.Cache[model.Weather]
}

func NewWeatherService(weatherRepo port.WeatherRepo) *WeatherService {
	weatherCache := cache.NewInMemoryCache[model.Weather]()
	return &WeatherService{weatherRepo: weatherRepo, weatherCache: weatherCache}
}

func (s *WeatherService) GetCurrentWeather(ctx context.Context) (model.Weather, error) {
	weather, ok := s.weatherCache.Get(cacheKey)
	if ok {
		return weather, nil
	}

	weather, err := s.weatherRepo.GetCurrentWeather(ctx)
	if err != nil {
		return model.Weather{}, err
	}

	s.weatherCache.Set(cacheKey, weather, weatherCacheTTL)
	return weather, nil
}
