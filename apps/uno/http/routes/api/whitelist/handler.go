package whitelist

import (
	"database/sql"
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
	"uno/http/routes/api"

	_ "uno/domain/model"
)

type whitelist struct {
	logger           port.Logger
	whitelistService *service.WhitelistService
}

func NewMux(logger port.Logger, whitelistService *service.WhitelistService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	w := whitelist{logger, whitelistService}

	// Admin
	mux.Handle("GET", "/", w.getWhitelist, admin)
	mux.Handle("GET", "/{email}", w.getWhitelistByEmail, admin)

	return mux
}

// getWhitelist returns a list of whitelisted emails
// @Summary	     Get whitelisted emails
// @Tags         whitelist
// @Produce      json
// @Success      200  {array}  WhitelistResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist [get]
func (w *whitelist) getWhitelist(ctx *handler.Context) error {
	// Get domain models from service
	whitelistedEmails, err := w.whitelistService.WhitelistRepo().GetWhitelist(ctx.Context())
	if err != nil {
		return ctx.Error(api.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTOs
	response := FromWhitelistDomainList(whitelistedEmails)
	return ctx.JSON(response)
}

// getWhitelistByEmail returns whitelist info for a specific email
// @Summary	     Get whitelist info by email
// @Tags         whitelist
// @Produce      json
// @Param        email   path      string  true  "Email"
// @Success      200  {object}  WhitelistResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist/{email} [get]
func (w *whitelist) getWhitelistByEmail(ctx *handler.Context) error {
	email := ctx.PathValue("email")

	// Get domain model from service
	whitelistInfo, err := w.whitelistService.WhitelistRepo().GetWhitelistByEmail(ctx.Context(), email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.SetStatus(404)
			return ctx.JSON(nil)
		}
		return ctx.Error(api.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := new(WhitelistResponse).FromDomain(&whitelistInfo)
	return ctx.JSON(response)
}
