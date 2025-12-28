package api

import (
	"errors"
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/ports"
	"uno/domain/services"

	_ "uno/domain/model"
)

// GetWhitelistHandler returns a list of whitelisted emails
// @Summary	     Get whitelisted emails
// @Tags         whitelist
// @Produce      json
// @Success      200  {array}  model.Whitelist  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist [get]
func GetWhitelistHandler(logger ports.Logger, whitelistService *services.WhitelistService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		whitelistedEmails, err := whitelistService.WhitelistRepo().GetWhitelist(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, whitelistedEmails)
	}
}

// GetWhitelistByEmailHandler returns whitelist info for a specific email
// @Summary	     Get whitelist info by email
// @Tags         whitelist
// @Produce      json
// @Param        email   path      string  true  "Email"
// @Success      200  {object}  model.Whitelist  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist/{email} [get]
func GetWhitelistByEmailHandler(logger ports.Logger, whitelistService *services.WhitelistService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		email := r.PathValue("email")
		if email == "" {
			return http.StatusBadRequest, errors.New("missing email")
		}
		whitelistInfo, err := whitelistService.WhitelistRepo().GetWhitelistByEmail(r.Context(), email)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, whitelistInfo)
	}
}
