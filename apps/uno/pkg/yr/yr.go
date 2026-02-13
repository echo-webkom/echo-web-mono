package yr

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

var (
	locataionForecastURLTemplate = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=%f&lon=%f"
)

var (
	ErrFailedToCreateRequest = "failed to create weather request"
	ErrFailedToFetchData     = "failed to fetch weather data"
	ErrUnexpectedStatusCode  = "unexpected status code from weather API"
)

var HttpClient = &http.Client{}

type Client struct {
}

func New() *Client {
	return &Client{}
}

func (s *Client) GetCurrentWeather(ctx context.Context, lat float64, lon float64) (CompactResponse, error) {
	url := fmt.Sprintf(locataionForecastURLTemplate, lat, lon)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return CompactResponse{}, fmt.Errorf("%s: %w", ErrFailedToCreateRequest, err)
	}

	req.Header.Set("User-Agent", "echo-yr-client/1.0 (+https://echo.uib.no/)")
	req.Header.Set("Accept", "application/json")
	resp, err := HttpClient.Do(req)
	if err != nil {
		return CompactResponse{}, fmt.Errorf("%s: %w", ErrFailedToFetchData, err)
	}
	defer func() {
		err = errors.Join(err, resp.Body.Close())
	}()

	if resp.StatusCode != http.StatusOK {
		return CompactResponse{}, fmt.Errorf("%s: status code %d", ErrUnexpectedStatusCode, resp.StatusCode)
	}

	jsonBody := CompactResponse{}
	err = json.NewDecoder(resp.Body).Decode(&jsonBody)
	if err != nil {
		return CompactResponse{}, fmt.Errorf("%s: %w", ErrFailedToFetchData, err)
	}

	return jsonBody, err
}

type CompactResponse struct {
	Type       string     `json:"type"`
	Geometry   Geometry   `json:"geometry"`
	Properties Properties `json:"properties"`
}

type Geometry struct {
	Type        string    `json:"type"`
	Coordinates []float64 `json:"coordinates"`
}

type Properties struct {
	Meta       Meta         `json:"meta"`
	Timeseries []TimeSeries `json:"timeseries"`
}

type Meta struct {
	UpdatedAt string `json:"updated_at"`
	Units     Units  `json:"units"`
}

type Units struct {
	AirPressureAtSeaLevel string `json:"air_pressure_at_sea_level"`
	AirTemperature        string `json:"air_temperature"`
	CloudAreaFraction     string `json:"cloud_area_fraction"`
	PrecipitationAmount   string `json:"precipitation_amount"`
	RelativeHumidity      string `json:"relative_humidity"`
	WindFromDirection     string `json:"wind_from_direction"`
	WindSpeed             string `json:"wind_speed"`
}

type TimeSeries struct {
	Time string         `json:"time"`
	Data TimeSeriesData `json:"data"`
}

type TimeSeriesData struct {
	Instant     *ForecastPeriodDetails `json:"instant,omitempty"`
	Next1Hours  *ForecastPeriodDetails `json:"next_1_hours,omitempty"`
	Next6Hours  *ForecastPeriodDetails `json:"next_6_hours,omitempty"`
	Next12Hours *ForecastPeriodDetails `json:"next_12_hours,omitempty"`
}

type ForecastPeriodDetails struct {
	Details *TimeseriesDetails `json:"details,omitempty"`
	Summary *ForecastSummary   `json:"summary,omitempty"`
}

type ForecastSummary struct {
	SymbolCode string `json:"symbol_code"`
}

type TimeseriesDetails struct {
	AirTemperature    *float32 `json:"air_temperature,omitempty"`
	CloudAreaFraction *float32 `json:"cloud_area_fraction,omitempty"`
	RelativeHumidity  *float32 `json:"relative_humidity,omitempty"`
	WindFromDirection *float32 `json:"wind_from_direction,omitempty"`
	WindSpeed         *float32 `json:"wind_speed,omitempty"`
}
