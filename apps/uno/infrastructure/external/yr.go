package external

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/yr"
)

type YrRepo struct {
	logger   port.Logger
	yrClient *yr.Client
}

func NewYrRepo(logger port.Logger) port.WeatherRepo {
	yrClient := yr.New()
	return &YrRepo{logger: logger, yrClient: yrClient}
}

func (s *YrRepo) GetCurrentWeather(ctx context.Context) (model.Weather, error) {
	jsonBody, err := s.yrClient.GetCurrentWeather(ctx, 60.3913, 5.3221)
	if err != nil {
		s.logger.Error(ctx, "failed to fetch weather", "err", err.Error())
		return model.Weather{}, err
	}

	weather := model.Weather{
		Temperature: 0,
		Condition:   nil,
		WindSpeed:   0,
	}

	if len(jsonBody.Properties.Timeseries) > 0 {
		first := jsonBody.Properties.Timeseries[0]
		if first.Data.Instant != nil && first.Data.Instant.Details != nil {
			details := first.Data.Instant.Details
			if details.AirTemperature != nil {
				weather.Temperature = float64(*details.AirTemperature)
			}
			if details.WindSpeed != nil {
				weather.WindSpeed = float64(*details.WindSpeed)
			}
		}
		if first.Data.Next1Hours != nil && first.Data.Next1Hours.Summary != nil {
			symbolCode := first.Data.Next1Hours.Summary.SymbolCode
			weather.Condition = symbolCodeToWeatherCondition(symbolCode)
		}
	}

	return weather, nil
}

func symbolCodeToWeatherCondition(symbolCode string) *model.WeatherCondition {
	var condition model.WeatherCondition

	switch symbolCode {
	case "clearsky_day", "clearsky_night", "clearsky_polartwilight":
		condition = model.WeatherConditionSunny
	case "fair_day", "fair_night", "fair_polartwilight",
		"partlycloudy_day", "partlycloudy_night", "partlycloudy_polartwilight",
		"cloudy", "fog":
		condition = model.WeatherConditionCloudy
	case "lightrain", "rain", "heavyrain",
		"lightrainandthunder", "rainandthunder", "heavyrainandthunder",
		"lightrainshowers_day", "lightrainshowers_night", "lightrainshowers_polartwilight",
		"rainshowers_day", "rainshowers_night", "rainshowers_polartwilight",
		"heavyrainshowers_day", "heavyrainshowers_night", "heavyrainshowers_polartwilight",
		"lightrainshowersandthunder_day", "lightrainshowersandthunder_night", "lightrainshowersandthunder_polartwilight",
		"rainshowersandthunder_day", "rainshowersandthunder_night", "rainshowersandthunder_polartwilight",
		"heavyrainshowersandthunder_day", "heavyrainshowersandthunder_night", "heavyrainshowersandthunder_polartwilight":
		condition = model.WeatherConditionRainy
	case "lightsnow", "snow", "heavysnow",
		"lightsnowandthunder", "snowandthunder", "heavysnowandthunder",
		"lightsnowshowers_day", "lightsnowshowers_night", "lightsnowshowers_polartwilight",
		"snowshowers_day", "snowshowers_night", "snowshowers_polartwilight",
		"heavysnowshowers_day", "heavysnowshowers_night", "heavysnowshowers_polartwilight",
		"lightsnowshowersandthunder_day", "lightsnowshowersandthunder_night", "lightsnowshowersandthunder_polartwilight",
		"snowshowersandthunder_day", "snowshowersandthunder_night", "snowshowersandthunder_polartwilight",
		"heavysnowshowersandthunder_day", "heavysnowshowersandthunder_night", "heavysnowshowersandthunder_polartwilight":
		condition = model.WeatherConditionSnowy
	default:
		return nil
	}

	return &condition
}
