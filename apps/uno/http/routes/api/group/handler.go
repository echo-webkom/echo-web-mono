package group

import (
	"database/sql"
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
)

type group struct {
	logger       port.Logger
	groupService *service.GroupService
}

func NewMux(logger port.Logger, groupService *service.GroupService, admin handler.Middleware) *router.Mux {
	gh := &group{
		logger:       logger,
		groupService: groupService,
	}

	mux := router.NewMux()
	mux.Handle("GET", "/", gh.getGroups)

	mux.Handle("DELETE", "/{id}", gh.deleteGroupByID, admin)
	mux.Handle("POST", "/", gh.createGroup, admin)
	mux.Handle("POST", "/{id}", gh.updateGroupByID, admin)

	return mux
}

// getGroups returns a list of all groups.
// @Summary Get a list of all groups
// @Tags groups
// @Success 200 {array} GroupResponse "OK"
// @Failure 500 {object} string "Internal Server Error"
// @Router /group [get]
func (gh *group) getGroups(ctx *handler.Context) error {
	groups, err := gh.groupService.GroupRepo().GetAllGroups(ctx.Context())
	if err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	response := make([]GroupResponse, len(groups))
	for i, group := range groups {
		response[i] = GroupResponse{
			ID:   group.ID,
			Name: group.Name,
		}
	}

	return ctx.JSON(response)
}

// deleteGroupByID deletes a group by ID.
// @Summary Delete a group by ID
// @Tags groups
// @Param id path string true "Group ID"
// @Success 204 {string} string "No Content"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Router /group/{id} [delete]
func (gh *group) deleteGroupByID(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.Error(errors.New("group ID is required"), http.StatusBadRequest)
	}

	err := gh.groupService.GroupRepo().DeleteGroup(ctx.Context(), groupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Error(errors.New("group not found"), http.StatusNotFound)
		}

		return ctx.Error(err, http.StatusInternalServerError)
	}

	return nil
}

// createGroup creates a new group.
// @Summary Create a new group
// @Tags groups
// @Accept json
// @Produce json
// @Param group body CreateGroupRequest true "Group data"
// @Success 201 {object} GroupResponse "Created"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 500 {object} string "Internal Server Error"
// @Router /group [post]
func (gh *group) createGroup(ctx *handler.Context) error {
	var req CreateGroupRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(err, http.StatusBadRequest)
	}

	newGroup := req.ToNewGroupDomain()

	group, err := gh.groupService.GroupRepo().CreateGroup(ctx.Context(), newGroup)
	if err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	response := GroupResponse{
		ID:   group.ID,
		Name: group.Name,
	}

	return ctx.JSON(response)
}

// updateGroupByID updates a group by ID.
// @Summary Update a group by ID
// @Tags groups
// @Accept json
// @Produce json
// @Param id path string true "Group ID"
// @Param group body UpdateGroupRequest true "Group data"
// @Success 200 {object} GroupResponse "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Router /group/{id} [post]
func (gh *group) updateGroupByID(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.Error(errors.New("group ID is required"), http.StatusBadRequest)
	}

	var req UpdateGroupRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(err, http.StatusBadRequest)
	}

	group, err := gh.groupService.GroupRepo().GetGroupByID(ctx.Context(), groupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Error(errors.New("group not found"), http.StatusNotFound)
		}

		return ctx.Error(err, http.StatusInternalServerError)
	}

	group.Name = req.Name

	updatedGroup, err := gh.groupService.GroupRepo().UpdateGroup(ctx.Context(), group)
	if err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	response := GroupResponse{
		ID:   updatedGroup.ID,
		Name: updatedGroup.Name,
	}

	return ctx.JSON(response)
}
