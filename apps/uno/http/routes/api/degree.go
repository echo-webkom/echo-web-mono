package api

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/router"
	"uno/http/util"
)

// GetDegreesHandler returns a list of degrees
// @Summary	     Get degrees
// @Tags         degrees
// @Produce      json
// @Success      200  {array}  dto.DegreeResponse  "OK"
// @Router       /degrees [get]
func GetDegreesHandler(logger port.Logger, degreeService *service.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Fetch degrees from the service
		degrees, err := degreeService.DegreeRepo().GetAllDegrees(ctx)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Map domain models to DTOs
		response := dto.DegreesFromDomainList(degrees)

		return util.JsonOk(w, response)
	}
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
func CreateDegreeHandler(logger port.Logger, degreeService *service.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Read and parse the request body
		var degree dto.CreateDegreeRequest
		if err := util.ReadJson(r, &degree); err != nil {
			return http.StatusBadRequest, errors.New("failed to read json")
		}

		// Create the degree in the database
		createdDegree, err := degreeService.DegreeRepo().CreateDegree(ctx, *degree.ToDomain())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Map domain model to DTO
		response := dto.DegreeResponse{
			ID:   createdDegree.ID,
			Name: createdDegree.Name,
		}

		return util.Json(w, http.StatusCreated, response)
	}
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
func UpdateDegreeHandler(logger port.Logger, degreeService *service.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Read and parse the request body
		var degree dto.UpdateDegreeRequest
		if err := util.ReadJson(r, &degree); err != nil {
			return http.StatusBadRequest, errors.New("failed to read json")
		}

		// Update the degree in the database
		updatedDegree, err := degreeService.DegreeRepo().UpdateDegree(ctx, *degree.ToDomain())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Map domain model to DTO
		response := dto.DegreeResponse{
			ID:   updatedDegree.ID,
			Name: updatedDegree.Name,
		}

		return util.JsonOk(w, response)
	}
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
func DeleteDegreeHandler(logger port.Logger, degreeService *service.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, nil
		}

		if err := degreeService.DegreeRepo().DeleteDegree(r.Context(), id); err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return http.StatusNoContent, nil
	}
}
