package sanity

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

const (
	defaultAPIVersion = "2025-02-19"
)

var (
	ErrMissingDataset        = errors.New("dataset is required")
	ErrMissingProjectID      = errors.New("project id is required")
	ErrFailedToCreateURL     = errors.New("failed to create sanity url")
	ErrFailedToCreateRequest = errors.New("failed to create sanity request")
	ErrFailedToFetchData     = errors.New("failed to fetch sanity data")
	ErrUnexpectedStatusCode  = errors.New("unexpected status code from sanity api")
	ErrFailedToDecodeData    = errors.New("failed to decode sanity data")
)

var HttpClient = &http.Client{}

type Config struct {
	ProjectID   string
	Dataset     string
	APIVersion  string
	Token       string
	Perspective string
	UseCDN      bool
}

type Client struct {
	baseURL string
	token   string
}

type QueryResponse[T any] struct {
	Result T `json:"result"`
}

func New(config Config) (*Client, error) {
	if config.ProjectID == "" {
		return nil, ErrMissingProjectID
	}
	if config.Dataset == "" {
		return nil, ErrMissingDataset
	}

	apiVersion := config.APIVersion
	if apiVersion == "" {
		apiVersion = defaultAPIVersion
	}

	if !strings.HasPrefix(apiVersion, "v") {
		apiVersion = "v" + apiVersion
	}

	host := fmt.Sprintf("%s.api.sanity.io", config.ProjectID)
	if config.UseCDN {
		host = fmt.Sprintf("%s.apicdn.sanity.io", config.ProjectID)
	}

	return &Client{
		baseURL: fmt.Sprintf("https://%s/%s/data/query/%s", host, apiVersion, config.Dataset),
		token:   config.Token,
	}, nil
}

func Query[T any](ctx context.Context, client *Client, query string, params map[string]any) (T, error) {
	var out T
	endpoint, err := url.Parse(client.baseURL)
	if err != nil {
		return out, ErrFailedToCreateURL
	}

	values := endpoint.Query()
	values.Set("query", query)

	for key, value := range params {
		b, marshalErr := json.Marshal(value)
		if marshalErr != nil {
			return out, ErrFailedToCreateURL
		}
		values.Set("$"+key, string(b))
	}

	endpoint.RawQuery = values.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return out, ErrFailedToCreateRequest
	}

	req.Header.Set("Accept", "application/json")
	if client.token != "" {
		req.Header.Set("Authorization", "Bearer "+client.token)
	}

	resp, err := HttpClient.Do(req)
	if err != nil {
		return out, ErrFailedToFetchData
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return out, ErrUnexpectedStatusCode
	}

	response := QueryResponse[json.RawMessage]{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return out, ErrFailedToDecodeData
	}

	if err := json.Unmarshal(response.Result, &out); err != nil {
		// Return zero value of T and the error
		// This is because unmarshalling can fail with a partial result.
		var zero T
		return zero, ErrFailedToDecodeData
	}

	return out, nil
}
