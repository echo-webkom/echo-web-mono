package databrus

import (
	"uno/domain/port"
	"uno/domain/service"
	"uno/pkg/uno"
)

type databrus struct {
	logger          port.Logger
	databrusService *service.DatabrusService
}

func NewMux(logger port.Logger, databrusService *service.DatabrusService) *uno.Mux {
	d := databrus{logger, databrusService}
	mux := uno.NewMux()

	mux.Handle("GET", "/matches", d.getMatches)
	mux.Handle("GET", "/table", d.getTable)

	return mux
}

// getMatches returns the upcoming matches for Databrus
// @Summary      Get matches for Databrus
// @Tags         databrus
// @Produce      json
// @Success      200  {array}   DatabrusMatchDTO  "OK"
// @Failure      500  {string}  string       "Internal Server Error"
// @Router       /databrus/matches [get]
func (d *databrus) getMatches(ctx *uno.Context) error {
	matches, err := d.databrusService.GetMatches(ctx.Context())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, 500)
	}

	response := DatabrusMatchesFromDomain(matches)
	return ctx.JSON(response)
}

// getTable returns the current table for Databrus
// @Summary      Get current table for Databrus
// @Tags         databrus
// @Produce      json
// @Success      200  {object}  DatabrusTableResponse   "OK"
// @Failure      500  {string}  string        "Internal Server Error"
// @Router       /databrus/table [get]
func (d *databrus) getTable(ctx *uno.Context) error {
	table, err := d.databrusService.GetTable(ctx.Context())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, 500)
	}

	response := DatabrusTableFromDomain(table)
	return ctx.JSON(response)
}
