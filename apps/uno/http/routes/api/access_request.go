package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/router"
	"uno/http/util"
)

// GetAccessRequestsHandler returns a list of access requests
// @Summary	     Get access requests
// @Tags         access-request
// @Produce      json
// @Success      200  {array}  dto.AccessRequestResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests [get]
func GetAccessRequestsHandler(logger port.Logger, accessRequestService *service.AccessRequestService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		// Get domain models from service
		accessRequests, err := accessRequestService.AccessRequestRepo().GetAccessRequests(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Convert to DTOs
		response := dto.AccessRequestsFromDomainList(accessRequests)

		return util.JsonOk(w, response)
	}
}
