package health

import (
	"uno/http/handler"
)

// HealthHandler returns the health status of the service
// @Summary	     Get health status
// @Tags         health
// @Produce      json
// @Success      200  {object}  HealthCheckResponse  "OK"
// @Router       / [get]
func HealthHandler(ctx *handler.Context) error {
	return ctx.JSON(HealthCheckResponse{Status: "ok"})
}
