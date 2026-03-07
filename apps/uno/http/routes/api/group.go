package api

import (
	"database/sql"
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type group struct {
	logger       port.Logger
	groupService *service.GroupService
}

func NewGroupMux(logger port.Logger, groupService *service.GroupService, admin handler.Middleware) *router.Mux {
	gh := &group{
		logger:       logger,
		groupService: groupService,
	}

	mux := router.NewMux()
	mux.Handle("GET", "/", gh.getGroups)

	mux.Handle("DELETE", "/{id}", gh.deleteGroupByID, admin)
	mux.Handle("POST", "/", gh.createGroup, admin)
	mux.Handle("POST", "/{id}", gh.updateGroupByID, admin)
	mux.Handle("GET", "/{id}/members", gh.getGroupMembers, admin)

	return mux
}

// getGroups returns a list of all groups.
// @Summary Get a list of all groups
// @Tags groups
// @Success 200 {array} dto.GroupResponse "OK"
// @Failure 500 {object} string "Internal Server Error"
// @Router /group [get]
func (gh *group) getGroups(ctx *handler.Context) error {
	groups, err := gh.groupService.GroupRepo().GetAllGroups(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.GroupResponseFromDomain(groups))
}

// deleteGroupByID deletes a group by ID.
// @Summary Delete a group by ID
// @Tags groups
// @Param id path string true "Group ID"
// @Success 200 {string} string "Deleted"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /group/{id} [delete]
func (gh *group) deleteGroupByID(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	err := gh.groupService.GroupRepo().DeleteGroup(ctx.Context(), groupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("group not found"))
		}

		return ctx.Error(err, http.StatusInternalServerError)
	}

	return ctx.Text("group deleted")
}

// createGroup creates a new group.
// @Summary Create a new group
// @Tags groups
// @Accept json
// @Produce json
// @Param group body dto.CreateGroupRequest true "Group data"
// @Success 201 {object} dto.GroupResponse "Created"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /group [post]
func (gh *group) createGroup(ctx *handler.Context) error {
	var req dto.CreateGroupRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	newGroup := req.ToNewGroupDomain()

	group, err := gh.groupService.GroupRepo().CreateGroup(ctx.Context(), newGroup)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.GroupResponse{
		ID:   group.ID,
		Name: group.Name,
	})
}

// getGroupMembers returns the members of a group by ID.
// @Summary Get members of a group
// @Tags groups
// @Param id path string true "Group ID"
// @Success 200 {array} dto.GroupMemberResponse "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /group/{id}/members [get]
func (gh *group) getGroupMembers(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	members, err := gh.groupService.GroupRepo().GetGroupMembers(ctx.Context(), groupID)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.GroupMemberResponseFromDomain(members))
}

// updateGroupByID updates a group by ID.
// @Summary Update a group by ID
// @Tags groups
// @Accept json
// @Produce json
// @Param id path string true "Group ID"
// @Param group body dto.UpdateGroupRequest true "Group data"
// @Success 200 {object} dto.GroupResponse "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /group/{id} [post]
func (gh *group) updateGroupByID(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	var req dto.UpdateGroupRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	group, err := gh.groupService.GroupRepo().GetGroupByID(ctx.Context(), groupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("group not found"))
		}

		return ctx.Error(err, http.StatusInternalServerError)
	}

	group.Name = req.Name
	updatedGroup, err := gh.groupService.GroupRepo().UpdateGroup(ctx.Context(), group)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.GroupResponse{
		ID:   updatedGroup.ID,
		Name: updatedGroup.Name,
	})
}
