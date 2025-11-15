package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"

	_ "uno/domain/model"
)

type whitelist struct {
	logger           port.Logger
	whitelistService *service.WhitelistService
}

func NewWhitelistMux(logger port.Logger, whitelistService *service.WhitelistService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	w := whitelist{logger, whitelistService}

	// Admin
	mux.Handle("GET", "/", w.GetWhitelistHandler, admin)
	mux.Handle("GET", "/{email}", w.GetWhitelistByEmailHandler, admin)

	return mux
}

// GetWhitelistHandler returns a list of whitelisted emails
// @Summary	     Get whitelisted emails
// @Tags         whitelist
// @Produce      json
// @Success      200  {array}  dto.WhitelistResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist [get]
func (w *whitelist) GetWhitelistHandler(ctx *handler.Context) error {
	// Get domain models from service
	whitelistedEmails, err := w.whitelistService.WhitelistRepo().GetWhitelist(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTOs
	response := dto.FromWhitelistDomainList(whitelistedEmails)
	return ctx.JSON(response)
}

// GetWhitelistByEmailHandler returns whitelist info for a specific email
// @Summary	     Get whitelist info by email
// @Tags         whitelist
// @Produce      json
// @Param        email   path      string  true  "Email"
// @Success      200  {object}  dto.WhitelistResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist/{email} [get]
func (w *whitelist) GetWhitelistByEmailHandler(ctx *handler.Context) error {
	email := ctx.PathValue("email")

	// Get domain model from service
	whitelistInfo, err := w.whitelistService.WhitelistRepo().GetWhitelistByEmail(ctx.Context(), email)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := new(dto.WhitelistResponse).FromDomain(&whitelistInfo)
	return ctx.JSON(response)
}
