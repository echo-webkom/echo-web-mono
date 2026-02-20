package degree

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/pkg/uno"
)

type degrees struct {
	logger        port.Logger
	degreeService *service.DegreeService
}

func NewMux(logger port.Logger, degreeService *service.DegreeService, admin uno.Middleware) *uno.Mux {
	mux := uno.NewMux()
	d := degrees{logger, degreeService}

	mux.Handle("GET", "/", d.getDegrees)

	// Admin
	mux.Handle("POST", "/", d.createDegree, admin)
	mux.Handle("POST", "/{id}", d.updateDegree, admin)
	mux.Handle("DELETE", "/{id}", d.deleteDegree, admin)

	return mux
}

// getDegrees returns a list of degrees
// @Summary	     Get degrees
// @Tags         degrees
// @Produce      json
// @Success      200  {array}  DegreeResponse  "OK"
// @Router       /degrees [get]
func (d *degrees) getDegrees(ctx *uno.Context) error {
	// Fetch degrees from the service
	degrees, err := d.degreeService.DegreeRepo().GetAllDegrees(ctx.Context())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Map domain models to DTOs
	response := DegreesFromDomainList(degrees)
	return ctx.JSON(response)
}

// createDegree creates a new degree
// @Summary	     Create degree
// @Tags         degrees
// @Accept       json
// @Produce      json
// @Param        degree  body   CreateDegreeRequest  true  "Degree to create"
// @Success      201  {object}  DegreeResponse  "Created"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees [post]
func (d *degrees) createDegree(ctx *uno.Context) error {
	// Read and parse the request body
	var degree CreateDegreeRequest
	if err := ctx.ReadJSON(&degree); err != nil {
		return ctx.Error(errors.New("bad json data"), http.StatusBadRequest)
	}

	// Create the degree in the database
	createdDegree, err := d.degreeService.DegreeRepo().CreateDegree(ctx.Context(), *degree.ToDomain())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Map domain model to DTO
	response := DegreeResponse{
		ID:   createdDegree.ID,
		Name: createdDegree.Name,
	}

	return ctx.JSONWithStatus(response, http.StatusCreated)
}

// updateDegree updates an existing degree
// @Summary	     Update degree
// @Tags         degrees
// @Accept       json
// @Produce      json
// @Param        degree  body   UpdateDegreeRequest  true  "Degree to update"
// @Success      200  {object}  DegreeResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees/{id} [post]
func (d *degrees) updateDegree(ctx *uno.Context) error {
	// Read and parse the request body
	var degree UpdateDegreeRequest
	if err := ctx.ReadJSON(&degree); err != nil {
		return ctx.Error(errors.New("failed to read json"), http.StatusBadRequest)
	}

	// Update the degree in the database
	updatedDegree, err := d.degreeService.DegreeRepo().UpdateDegree(ctx.Context(), *degree.ToDomain())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Map domain model to DTO
	response := DegreeResponse{
		ID:   updatedDegree.ID,
		Name: updatedDegree.Name,
	}

	return ctx.JSON(response)
}

// deleteDegree deletes a degree
// @Summary	     Delete degree
// @Tags         degrees
// @Param        id   path      string  true  "Degree ID"
// @Success      204  "No Content"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees/{id} [delete]
func (d *degrees) deleteDegree(ctx *uno.Context) error {
	id := ctx.PathValue("id")

	if err := d.degreeService.DegreeRepo().DeleteDegree(ctx.Context(), id); err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	ctx.SetStatus(http.StatusNoContent)
	return ctx.Ok()
}
