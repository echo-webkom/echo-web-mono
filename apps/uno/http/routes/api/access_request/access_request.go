package accessrequest

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
	"uno/http/routes/api"
)

type accessRequests struct {
	logger               port.Logger
	accessRequestService *service.AccessRequestService
}

func NewMux(logger port.Logger, accessRequestService *service.AccessRequestService, admin handler.Middleware) *router.Mux {
	a := accessRequests{logger, accessRequestService}
	mux := router.NewMux()

	// Admin
	mux.Handle("GET", "/", a.getAccessRequests, admin)

	return mux
}

// getAccessRequests returns a list of access requests
// @Summary	     Get access requests
// @Tags         access-request
// @Produce      json
// @Success      200  {array}  AccessRequestResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests [get]
func (a *accessRequests) getAccessRequests(ctx *handler.Context) error {
	// Get domain models from service
	accessRequests, err := a.accessRequestService.AccessRequestRepo().GetAccessRequests(ctx.Context())
	if err != nil {
		return ctx.Error(api.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTOs
	response := AccessRequestsFromDomainList(accessRequests)
	return ctx.JSON(response)
}
