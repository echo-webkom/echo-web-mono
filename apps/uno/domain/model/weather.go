package model

type WeatherCondition string

const (
	WeatherConditionSunny  WeatherCondition = "sunny"
	WeatherConditionCloudy WeatherCondition = "cloudy"
	WeatherConditionRainy  WeatherCondition = "rainy"
	WeatherConditionSnowy  WeatherCondition = "snowy"
)

func (c WeatherCondition) String() string {
	return string(c)
}

type Weather struct {
	Temperature float64
	Condition   *WeatherCondition
	WindSpeed   float64
}
