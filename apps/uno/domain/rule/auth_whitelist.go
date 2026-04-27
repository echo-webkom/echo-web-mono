package rule

import "os"

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
	switch site {
	case "web":
		return getEnv("NEXT_PUBLIC_WEB_BASE_URL")
	case "verv":
		return getEnv("PUBLIC_VERV_BASE_URL")
	case "cat":
		return getEnv("PUBLIC_CAT_BASE_URL")
	case "dashboard":
		return getEnv("PUBLIC_DASHBOARD_BASE_URL")
	}

	return "", false
}

func getEnv(key string) (string, bool) {
	v := os.Getenv(key)
	return v, v != ""
}
