package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type WeatherService struct {
	weatherRepo port.WeatherRepo
}

func NewWeatherService(weatherRepo port.WeatherRepo) *WeatherService {
	return &WeatherService{
		weatherRepo: weatherRepo,
	}
}

func (s *WeatherService) GetCurrentWeather(ctx context.Context) (model.Weather, error) {
	weather, err := s.weatherRepo.GetCurrentWeather(ctx)
	if err != nil {
		return model.Weather{}, err
	}

	return weather, nil
}
