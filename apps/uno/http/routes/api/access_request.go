package api

import (
	"database/sql"
	"errors"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type accessRequests struct {
	logger               port.Logger
	accessRequestService *service.AccessRequestService
}

func NewAccessRequestMux(
	logger port.Logger,
	accessRequestService *service.AccessRequestService,
	admin handler.Middleware,
) *router.Mux {
	a := accessRequests{logger, accessRequestService}
	mux := router.NewMux()

	// Admin
	mux.POST("/", a.createAccessRequest, admin)
	mux.GET("/", a.getAccessRequests, admin)
	mux.DELETE("/{id}", a.deleteAccessRequest, admin)
	mux.POST("/{id}/approve", a.approveAccessRequest, admin)
	mux.POST("/{id}/deny", a.denyAccessRequest, admin)

	return mux
}

// getAccessRequests returns a list of access requests
// @Summary	     Get access requests
// @Tags         access-request
// @Produce      json
// @Success      200  {array}  dto.AccessRequestResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests [get]
func (a *accessRequests) getAccessRequests(ctx *handler.Context) error {
	accessRequests, err := a.accessRequestService.GetAccessRequests(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.AccessRequestsFromDomainList(accessRequests)
	return ctx.JSON(response)
}

// createAccessRequest creates a new access request
// @Summary      Create access request
// @Tags         access-request
// @Accept       json
// @Produce      json
// @Param        request  body      dto.CreateAccessRequestRequest  true  "Access request payload"
// @Success      200      {object}  dto.AccessRequestResponse       "OK"
// @Failure      400      {string}  string                          "Bad Request"
// @Failure      500      {string}  string                          "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests [post]
func (a *accessRequests) createAccessRequest(ctx *handler.Context) error {
	var req dto.CreateAccessRequestRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	created, err := a.accessRequestService.CreateAccessRequest(ctx.Context(), req.ToDomain())
	if err != nil {
		return ctx.InternalServerError()
	}

	response := new(dto.AccessRequestResponse).FromDomain(created)
	return ctx.JSON(response)
}

// deleteAccessRequest deletes an access request by id
// @Summary      Delete access request
// @Tags         access-request
// @Produce      json
// @Param        id   path      string  true  "Access request ID"
// @Success      200  {string}  string  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests/{id} [delete]
func (a *accessRequests) deleteAccessRequest(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing access request id"))
	}

	_, err := a.accessRequestService.GetAccessRequestByID(ctx.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("access request not found"))
		}
		return ctx.InternalServerError()
	}

	if err = a.accessRequestService.DeleteAccessRequestByID(ctx.Context(), id); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// approveAccessRequest approves an access request, adding the email to the whitelist and sending a confirmation email.
// @Summary      Approve access request
// @Tags         access-request
// @Produce      json
// @Param        id   path      string  true  "Access request ID"
// @Success      200  {string}  string  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests/{id}/approve [post]
func (a *accessRequests) approveAccessRequest(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing access request id"))
	}

	if err := a.accessRequestService.ApproveAccessRequest(ctx.Context(), id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("access request not found"))
		}
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// denyAccessRequest denies an access request, deleting it and sending a rejection email.
// @Summary      Deny access request
// @Tags         access-request
// @Accept       json
// @Produce      json
// @Param        id    path  string                        true  "Access request ID"
// @Param        body  body  dto.DenyAccessRequestRequest  true  "Denial payload"
// @Success      200  {string}  string  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests/{id}/deny [post]
func (a *accessRequests) denyAccessRequest(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing access request id"))
	}

	var req dto.DenyAccessRequestRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if err := a.accessRequestService.DenyAccessRequest(ctx.Context(), id, req.Reason); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("access request not found"))
		}
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
