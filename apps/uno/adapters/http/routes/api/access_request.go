package api

import (
	"net/http"
	"uno/adapters/http/dto"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/ports"
	"uno/domain/service"
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
func GetAccessRequestsHandler(logger ports.Logger, accessRequestService *service.AccessRequestService) router.Handler {
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
