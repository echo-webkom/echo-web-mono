package api

import (
	"net/http"
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

func NewAccessRequestMux(logger port.Logger, accessRequestService *service.AccessRequestService, admin handler.Middleware) *router.Mux {
	a := accessRequests{logger, accessRequestService}
	mux := router.NewMux()

	// Admin
	mux.Handle("GET", "/", a.GetAccessRequestsHandler, admin)

	return mux
}

// GetAccessRequestsHandler returns a list of access requests
// @Summary	     Get access requests
// @Tags         access-request
// @Produce      json
// @Success      200  {array}  dto.AccessRequestResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests [get]
func (a *accessRequests) GetAccessRequestsHandler(ctx *handler.Context) error {
	// Get domain models from service
	accessRequests, err := a.accessRequestService.AccessRequestRepo().GetAccessRequests(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTOs
	response := dto.AccessRequestsFromDomainList(accessRequests)
	return ctx.JSON(response)
}
