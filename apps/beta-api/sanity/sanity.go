package sanity

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type APIVersion string

var (
	V20210325 APIVersion = "v2021-03-25"
	V20211021 APIVersion = "v2021-10-21"
	V20220307 APIVersion = "v2022-03-07"
)

type SanityClient struct {
	ProjectID  string
	Dataset    string
	APIVersion APIVersion
	WithCDN    bool
}

type SanityResponse struct {
	Query    string   `json:"query"`
	Results  any      `json:"results"`
	SyncTags []string `json:"syncTags"`
	Ms       int      `json:"ms"`
}

func NewClient(projectID, dataset string, apiVersion APIVersion, withCDN bool) *SanityClient {
	return &SanityClient{
		ProjectID:  projectID,
		Dataset:    dataset,
		APIVersion: apiVersion,
		WithCDN:    withCDN,
	}
}

func (s *SanityClient) GetURL() string {
	if s.WithCDN {
		return fmt.Sprintf("https://%s.cdnapi.sanity.io/%s/data/query/%s", s.ProjectID, s.APIVersion, s.Dataset)
	}
	return fmt.Sprintf("https://%s.api.sanity.io/%s/data/query/%s", s.ProjectID, s.APIVersion, s.Dataset)
}

type QueryBuilder struct {
	client *SanityClient
	query  string
	params map[string]any
}

func (s *SanityClient) Query(query string) *QueryBuilder {
	return &QueryBuilder{
		client: s,
		query:  query,
		params: make(map[string]any),
	}
}

func (qb *QueryBuilder) Param(key string, value any) *QueryBuilder {
	qb.params[key] = value
	return qb
}

func (qb *QueryBuilder) Fetch() (any, error) {
	query := ""
	query += qb.client.GetURL()
	query += "?query=" + url.QueryEscape(qb.query)
	for key, value := range qb.params {
		query += fmt.Sprintf("&%s=%s", key, url.QueryEscape(fmt.Sprintf("%v", value)))
	}

	resp, err := http.Get(query)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch data from Sanity: %s", resp.Status)
	}
	var sanityResponse SanityResponse
	if err := json.NewDecoder(resp.Body).Decode(&sanityResponse); err != nil {
		return nil, err
	}

	return sanityResponse.Results, nil
}
