package providers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"golang.org/x/oauth2"
)

const (
	FeideProviderName = "feide"

	feideUserInfoEndpoint = "https://auth.dataporten.no/openid/userinfo"
	feideGroupsEndpoint   = "https://groups-api.dataporten.no/groups/me/groups"

	studyProgramPrefix = "fc:fs:fs:prg:uib.no:"
)

var validStudyProgramCodes = []string{
	studyProgramPrefix + "BAMN-DTEK",
	studyProgramPrefix + "BAMN-DSIK",
	studyProgramPrefix + "BAMN-DVIT",
	studyProgramPrefix + "BAMN-BINF",
	studyProgramPrefix + "BATF-IMØ",
	studyProgramPrefix + "MAMN-INF",
	studyProgramPrefix + "MAMN-PROG",
	studyProgramPrefix + "ÅRMN-INF",
	studyProgramPrefix + "5MAMN-DSC",
	studyProgramPrefix + "POST",
}

type FeideConfig struct {
	ClientID     string
	ClientSecret string
	CallbackURL  string
}

type FeideProvider struct {
	config     *oauth2.Config
	httpClient *http.Client
}

func NewFeideProvider(config FeideConfig) *FeideProvider {
	return &FeideProvider{
		config: &oauth2.Config{
			ClientID:     config.ClientID,
			ClientSecret: config.ClientSecret,
			RedirectURL:  config.CallbackURL,
			Scopes:       []string{"openid", "email", "profile", "groups"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://auth.dataporten.no/oauth/authorization",
				TokenURL: "https://auth.dataporten.no/oauth/token",
			},
		},
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type UserInfo struct {
	Sub     string `json:"sub"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

type Token struct {
	AccessToken  string
	TokenType    string
	ExpiresIn    int
	RefreshToken string
	IDToken      string
}

type GroupMembership struct {
	Basic       string `json:"basic"`
	Active      bool   `json:"active"`
	DisplayName string `json:"displayName"`
}

type Group struct {
	ID          string          `json:"id"`
	Type        string          `json:"type"`
	DisplayName string          `json:"displayName"`
	Membership  GroupMembership `json:"membership"`
	Parent      string          `json:"parent"`
}

func (f *FeideProvider) CreateAuthorizationURL(state string) string {
	return f.config.AuthCodeURL(state)
}

func (f *FeideProvider) ExchangeCode(ctx context.Context, code string) (*Token, error) {
	token, err := f.config.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %w", err)
	}

	idToken, _ := token.Extra("id_token").(string)

	return &Token{
		AccessToken:  token.AccessToken,
		TokenType:    token.TokenType,
		ExpiresIn:    int(token.Expiry.Unix()),
		RefreshToken: token.RefreshToken,
		IDToken:      idToken,
	}, nil
}

func (f *FeideProvider) GetUserInfo(ctx context.Context, accessToken string) (*UserInfo, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", feideUserInfoEndpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create userinfo request: %w", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	resp, err := f.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("userinfo request failed with status: %d", resp.StatusCode)
	}

	var userInfo UserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, fmt.Errorf("failed to decode userinfo response: %w", err)
	}

	return &userInfo, nil
}

func (f *FeideProvider) GetGroups(ctx context.Context, accessToken string) ([]Group, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", feideGroupsEndpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create groups request: %w", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	resp, err := f.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get groups: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("groups request failed with status: %d", resp.StatusCode)
	}

	var groups []Group
	if err := json.NewDecoder(resp.Body).Decode(&groups); err != nil {
		return nil, fmt.Errorf("failed to decode groups response: %w", err)
	}

	return groups, nil
}

func (f *FeideProvider) IsMemberOf(ctx context.Context, accessToken string) (bool, error) {
	groups, err := f.GetGroups(ctx, accessToken)
	if err != nil {
		return false, err
	}

	// Check if the user is a member of any of the valid groups
	for _, group := range groups {
		for _, prefix := range validStudyProgramCodes {
			if strings.HasPrefix(group.ID, prefix) {
				return true, nil
			}
		}
	}

	return false, nil
}
