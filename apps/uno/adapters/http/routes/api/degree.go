package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/model"
	"uno/domain/services"
)

// GetDegreesHandler returns a list of degrees
// @Summary	     Get degrees
// @Tags         degrees
// @Produce      json
// @Success      200  {array}  model.Degree  "OK"
// @Router       /degrees [get]
func GetDegreesHandler(ds *services.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		degrees, err := ds.GetAllDegrees(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, degrees)
	}
}

// CreateDegreeHandler creates a new degree
// @Summary	     Create degree
// @Tags         degrees
// @Accept       json
// @Produce      json
// @Param        degree  body   model.Degree  true  "Degree to create"
// @Success      201  {object}  model.Degree  "Created"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees [post]
func CreateDegreeHandler(ds *services.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		var degree model.Degree
		if err := util.ReadJson(r, &degree); err != nil {
			return http.StatusBadRequest, err
		}

		createdDegree, err := ds.CreateDegree(r.Context(), degree)
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.Json(w, http.StatusCreated, createdDegree)
	}
}

// UpdateDegreeHandler updates an existing degree
// @Summary	     Update degree
// @Tags         degrees
// @Accept       json
// @Produce      json
// @Param        degree  body   model.Degree  true  "Degree to update"
// @Success      200  {object}  model.Degree  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /degrees/{id} [post]
func UpdateDegreeHandler(ds *services.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		var degree model.Degree
		if err := util.ReadJson(r, &degree); err != nil {
			return http.StatusBadRequest, err
		}

		updatedDegree, err := ds.UpdateDegree(r.Context(), degree)
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, updatedDegree)
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
func DeleteDegreeHandler(ds *services.DegreeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.URL.Query().Get("id")
		if id == "" {
			return http.StatusBadRequest, nil
		}

		if err := ds.DeleteDegree(r.Context(), id); err != nil {
			return http.StatusInternalServerError, err
		}
		return http.StatusNoContent, nil
	}
}
