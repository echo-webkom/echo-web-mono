package port

import (
	"context"
	"uno/domain/model"
)

type WeatherRepo interface {
	GetCurrentWeather(ctx context.Context) (model.Weather, error)
}
