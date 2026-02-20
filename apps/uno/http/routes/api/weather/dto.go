package weather

import (
	"math"
	"uno/domain/model"
)

type WeatherResponse struct {
	Temperature float64 `json:"temperature"`
	Condition   *string `json:"condition"`
	WindSpeed   float64 `json:"wind_speed"`
}

func WeatherResponseFromDomain(weather *model.Weather) *WeatherResponse {
	var condition *string
	if weather.Condition != nil {
		weatherCond := weather.Condition.String()
		condition = &weatherCond
	}

	return &WeatherResponse{
		Temperature: toFixed(weather.Temperature, 2),
		Condition:   condition,
		WindSpeed:   toFixed(weather.WindSpeed, 2),
	}
}

func toFixed(value float64, decimals int) float64 {
	pow := math.Pow(10, float64(decimals))
	return math.Round(value*pow) / pow
}
