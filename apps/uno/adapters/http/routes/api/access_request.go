package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/services"

	_ "uno/domain/model"
)

// GetAccessRequestsHandler returns a list of access requests
// @Summary	     Get access requests
// @Tags         access-request
// @Produce      json
// @Success      200  {array}  model.AccessRequest  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /access-requests [get]
func GetAccessRequestsHandler(accessRequestService *services.AccessRequestService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		accessRequests, err := accessRequestService.Queries().GetAccessRequests(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, accessRequests)
	}
}
