package api

import (
	"database/sql"
	"errors"
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
	mux.Handle("GET", "/", w.getWhitelist, admin)
	mux.Handle("GET", "/{email}", w.getWhitelistByEmail, admin)
	mux.Handle("POST", "/", w.upsertWhitelist, admin)
	mux.Handle("DELETE", "/{email}", w.deleteWhitelistByEmail, admin)

	return mux
}

// getWhitelist returns a list of whitelisted emails
// @Summary	     Get whitelisted emails
// @Tags         whitelist
// @Produce      json
// @Success      200  {array}  dto.WhitelistResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist [get]
func (w *whitelist) getWhitelist(ctx *handler.Context) error {
	// Get domain models from service
	whitelistedEmails, err := w.whitelistService.GetWhitelist(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert to DTOs
	response := dto.FromWhitelistDomainList(whitelistedEmails)
	return ctx.JSON(response)
}

// getWhitelistByEmail returns whitelist info for a specific email
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
func (w *whitelist) getWhitelistByEmail(ctx *handler.Context) error {
	email := ctx.PathValue("email")

	// Get domain model from service
	whitelistInfo, err := w.whitelistService.GetWhitelistByEmail(ctx.Context(), email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.JSONWithStatus(nil, 404)
		}
		return ctx.InternalServerError()
	}

	// Convert to DTO
	response := dto.WhitelistResponseFromDomain(whitelistInfo)
	return ctx.JSON(response)
}

// upsertWhitelist creates or updates a whitelist entry by email
// @Summary      Upsert whitelist entry
// @Tags         whitelist
// @Accept       json
// @Produce      json
// @Param        whitelist  body      dto.CreateWhitelistRequest  true  "Whitelist payload"
// @Success      200        {object}  dto.WhitelistResponse       "OK"
// @Failure      400        {string}  string                      "Bad Request"
// @Failure      401        {string}  string                      "Unauthorized"
// @Failure      500        {string}  string                      "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist [post]
func (w *whitelist) upsertWhitelist(ctx *handler.Context) error {
	var req dto.CreateWhitelistRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	wl, err := w.whitelistService.UpsertWhitelist(ctx.Context(), *req.ToDomain())
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.WhitelistResponseFromDomain(wl))
}

// deleteWhitelistByEmail deletes a whitelist entry by email
// @Summary      Delete whitelist by email
// @Tags         whitelist
// @Produce      json
// @Param        email   path      string  true  "Email"
// @Success      204     "No Content"
// @Failure      401     {string}  string  "Unauthorized"
// @Failure      500     {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /whitelist/{email} [delete]
func (w *whitelist) deleteWhitelistByEmail(ctx *handler.Context) error {
	email := ctx.PathValue("email")
	if email == "" {
		return ctx.BadRequest(errors.New("missing email"))
	}

	if err := w.whitelistService.DeleteWhitelistByEmail(ctx.Context(), email); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSONWithStatus(nil, http.StatusNoContent)
}
