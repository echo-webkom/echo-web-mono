package api

import (
	"net/http"
	"uno/http/dto"
	"uno/http/router"
	"uno/http/util"
)

// HealthHandler returns the health status of the service
// @Summary	     Get health status
// @Tags         health
// @Produce      json
// @Success      200  {object}  dto.HealthCheckResponse  "OK"
// @Router       / [get]
func HealthHandler() router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		return util.JsonOk(w, dto.HealthCheckResponse{Status: "ok"})
	}
}
