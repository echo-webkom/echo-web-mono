package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const (
	feideAuthEndpoint  = "https://auth.dataporten.no/oauth/authorization"
	feideTokenEndpoint = "https://auth.dataporten.no/oauth/token"
	feideUserEndpoint  = "https://auth.dataporten.no/openid/userinfo"
)

func fetch(url string, headers map[string]string) (res []byte, err error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch user info: %s", resp.Status)
	}

	return io.ReadAll(resp.Body)
}

func getUserInfo(accessToken string) (user FeideUserInfo, err error) {
	res, err := fetch(feideUserEndpoint, map[string]string{
		"Authorization": "Bearer " + accessToken,
	})

	if err != nil {
		return user, err
	}

	if err = json.Unmarshal(res, &user); err != nil {
		return user, err
	}

	return user, err
}
