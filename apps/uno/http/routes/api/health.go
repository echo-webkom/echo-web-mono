package api

import (
	"uno/http/dto"
	"uno/http/handler"
)

// HealthHandler returns the health status of the service
// @Summary	     Get health status
// @Tags         health
// @Produce      json
// @Success      200  {object}  dto.HealthCheckResponse  "OK"
// @Router       / [get]
func HealthHandler(ctx *handler.Context) error {
	return ctx.JSON(dto.HealthCheckResponse{Status: "ok"})
}
