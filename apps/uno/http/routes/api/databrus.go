package api

import (
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type databrus struct {
	logger          port.Logger
	databrusService *service.DatabrusService
}

func NewDatabrusMux(logger port.Logger, databrusService *service.DatabrusService) *router.Mux {
	d := databrus{logger, databrusService}
	mux := router.NewMux()

	mux.Handle("GET", "/matches", d.GetMatchesHandler)
	mux.Handle("GET", "/table", d.GetTableHandler)

	return mux
}

// GetMatchesHandler returns the upcoming matches for Databrus
// @Summary      Get matches for Databrus
// @Tags         databrus
// @Produce      json
// @Success      200  {array}   dto.DatabrusMatchDTO  "OK"
// @Failure      500  {string}  string       "Internal Server Error"
// @Router       /databrus/matches [get]
func (d *databrus) GetMatchesHandler(ctx *handler.Context) error {
	matches, err := d.databrusService.GetMatches(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, 500)
	}

	response := dto.DatabrusMatchesFromDomain(matches)
	return ctx.JSON(response)
}

// GetTableHandler returns the current table for Databrus
// @Summary      Get current table for Databrus
// @Tags         databrus
// @Produce      json
// @Success      200  {object}  dto.DatabrusTableResponse   "OK"
// @Failure      500  {string}  string        "Internal Server Error"
// @Router       /databrus/table [get]
func (d *databrus) GetTableHandler(ctx *handler.Context) error {
	table, err := d.databrusService.GetTable(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, 500)
	}

	response := dto.DatabrusTableFromDomain(table)
	return ctx.JSON(response)
}
