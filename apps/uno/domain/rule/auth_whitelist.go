package rule

import "os"

// websiteWhitelist is a map of whitelisted applications and their corresponding function to
// get the base url to that application.
var websiteWhitelist = map[string]func() (string, bool){
	// web is used as the default redirect in case of an unknown site param or missing base url.
	"web":       func() (string, bool) { return getEnv("NEXT_PUBLIC_WEB_BASE_URL") },
	"verv":      func() (string, bool) { return getEnv("PUBLIC_VERV_BASE_URL") },
	"cat":       func() (string, bool) { return getEnv("PUBLIC_CAT_BASE_URL") },
	"dashboard": func() (string, bool) { return getEnv("PUBLIC_DASHBOARD_BASE_URL") },
}

// GetWhitelistedBaseURL returns the base url of the service being redirected to.
// Ok is false if the site is not whitelisted or the base url is missing from env.
//
// Edit this function to whitelist new applications using Uno as an auth provider.
// Set the env variable to the base url of your application (eg myapp.com).
// Uno will redirect to one of the following endpoints after the login:
//
//	Success: /api/auth/callback?token=<session-token>
//	Failure: /api/logg-inn?error=<error-message>&attemptId=<attempt-id>
//
// The default redirect in case of an unknwon site param or missing base url is "web" (echo.uib.no).
func GetWhitelistedBaseURL(site string) (baseUrl string, ok bool) {
	if getBaseURL, ok := websiteWhitelist[site]; ok {
		return getBaseURL()
	}
	return websiteWhitelist["web"]() // web should always exist
}

// getEnv is a helper function to get an environment variable.
// It returns the value and a boolean indicating if the value is not empty.
func getEnv(key string) (string, bool) {
	v := os.Getenv(key)
	return v, v != ""
}
