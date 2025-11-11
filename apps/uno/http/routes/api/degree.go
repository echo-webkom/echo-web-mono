package api

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type degrees struct {
	logger        port.Logger
	degreeService *service.DegreeService
}

func NewDegreeMux(logger port.Logger, degreeService *service.DegreeService) *router.Mux {
	mux := router.NewMux()
	d := degrees{logger, degreeService}

	mux.Handle("GET", "/", d.GetDegreesHandler)
	mux.Handle("POST", "/", d.CreateDegreeHandler)
	mux.Handle("POST", "/{id}", d.UpdateDegreeHandler)
	mux.Handle("DELETE", "/{id}", d.DeleteDegreeHandler)

	return mux
}

// GetDegreesHandler returns a list of degrees
// @Summary	     Get degrees
// @Tags         degrees
// @Produce      json
// @Success      200  {array}  dto.DegreeResponse  "OK"
// @Router       /degrees [get]
func (d *degrees) GetDegreesHandler(ctx *handler.Context) error {
	// Fetch degrees from the service
	degrees, err := d.degreeService.DegreeRepo().GetAllDegrees(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Map domain models to DTOs
	response := dto.DegreesFromDomainList(degrees)
	return ctx.JSON(response)
}

// CreateDegreeHandler creates a new degree
// @Summary	     Create degree
// @Tags         degrees
// @Accept       json
// @Produce      json
// @Param        degree  body   dto.CreateDegreeRequest  true  "Degree to create"
// @Success      201  {object}  dto.DegreeResponse  "Created"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees [post]
func (d *degrees) CreateDegreeHandler(ctx *handler.Context) error {
	// Read and parse the request body
	var degree dto.CreateDegreeRequest
	if err := ctx.ReadJSON(&degree); err != nil {
		return ctx.Error(errors.New("bad json data"), http.StatusBadRequest)
	}

	// Create the degree in the database
	createdDegree, err := d.degreeService.DegreeRepo().CreateDegree(ctx.Context(), *degree.ToDomain())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Map domain model to DTO
	response := dto.DegreeResponse{
		ID:   createdDegree.ID,
		Name: createdDegree.Name,
	}

	return ctx.JSON(response)
}

// UpdateDegreeHandler updates an existing degree
// @Summary	     Update degree
// @Tags         degrees
// @Accept       json
// @Produce      json
// @Param        degree  body   dto.UpdateDegreeRequest  true  "Degree to update"
// @Success      200  {object}  dto.DegreeResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees/{id} [post]
func (d *degrees) UpdateDegreeHandler(ctx *handler.Context) error {
	// Read and parse the request body
	var degree dto.UpdateDegreeRequest
	if err := ctx.ReadJSON(&degree); err != nil {
		return ctx.Error(errors.New("failed to read json"), http.StatusBadRequest)
	}

	// Update the degree in the database
	updatedDegree, err := d.degreeService.DegreeRepo().UpdateDegree(ctx.Context(), *degree.ToDomain())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Map domain model to DTO
	response := dto.DegreeResponse{
		ID:   updatedDegree.ID,
		Name: updatedDegree.Name,
	}

	return ctx.JSON(response)
}

// DeleteDegreeHandler deletes a degree
// @Summary	     Delete degree
// @Tags         degrees
// @Param        id   path      string  true  "Degree ID"
// @Success      204  "No Content"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees/{id} [delete]
func (d *degrees) DeleteDegreeHandler(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.Error(errors.New("missing id parameter"), http.StatusBadRequest)
	}

	if err := d.degreeService.DegreeRepo().DeleteDegree(ctx.Context(), id); err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.Ok()
}
