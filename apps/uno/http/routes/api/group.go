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

	"github.com/lib/pq"
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
	mux.Handle("GET", "/{id}", gh.getGroupByID)

	mux.Handle("DELETE", "/{id}", gh.deleteGroupByID, admin)
	mux.Handle("POST", "/", gh.createGroup, admin)
	mux.Handle("POST", "/{id}", gh.updateGroupByID, admin)
	mux.Handle("GET", "/{id}/members", gh.getGroupMembers, admin)
	mux.Handle("POST", "/{id}/members", gh.addUserToGroup, admin)
	mux.Handle("DELETE", "/{id}/members/{userId}", gh.removeUserFromGroup, admin)
	mux.Handle("POST", "/{id}/members/{userId}/leader", gh.setGroupMemberLeader, admin)

	return mux
}

// getGroups returns a list of all groups.
// @Summary Get a list of all groups
// @Tags groups
// @Success 200 {array} dto.GroupResponse "OK"
// @Failure 500 {object} string "Internal Server Error"
// @Router /groups [get]
func (gh *group) getGroups(ctx *handler.Context) error {
	groups, err := gh.groupService.GroupRepo().GetAllGroups(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.GroupResponseFromDomain(groups))
}

// getGroupByID returns a group by ID.
// @Summary Get a group by ID
// @Tags groups
// @Param id path string true "Group ID"
// @Success 200 {object} dto.GroupResponse "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Router /groups/{id} [get]
func (gh *group) getGroupByID(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	group, err := gh.groupService.GroupRepo().GetGroupByID(ctx.Context(), groupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("group not found"))
		}

		return ctx.Error(err, http.StatusInternalServerError)
	}

	return ctx.JSON(dto.GroupResponse{ID: group.ID, Name: group.Name})
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
// @Router /groups/{id} [delete]
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
// @Router /groups [post]
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
// @Router /groups/{id}/members [get]
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
// @Router /groups/{id} [post]
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

// setGroupMemberLeader sets leader status for a group member.
// @Summary Set group member leader status
// @Tags groups
// @Accept json
// @Param id path string true "Group ID"
// @Param userId path string true "User ID"
// @Param request body dto.UpdateGroupMemberLeaderRequest true "Leader status payload"
// @Success 200 {string} string "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /groups/{id}/members/{userId}/leader [post]
func (gh *group) setGroupMemberLeader(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	userID := ctx.PathValue("userId")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	var req dto.UpdateGroupMemberLeaderRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	member, err := gh.groupService.GroupRepo().GetUserGroupMembership(ctx.Context(), groupID, userID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if member == nil {
		return ctx.NotFound(errors.New("user is not a member of the group"))
	}

	if err = gh.groupService.GroupRepo().SetGroupMemberLeader(ctx.Context(), groupID, userID, req.Leader); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// removeUserFromGroup removes a user from a group.
// @Summary Remove user from group
// @Tags groups
// @Param id path string true "Group ID"
// @Param userId path string true "User ID"
// @Success 200 {string} string "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /groups/{id}/members/{userId} [delete]
func (gh *group) removeUserFromGroup(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	userID := ctx.PathValue("userId")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	member, err := gh.groupService.GroupRepo().GetUserGroupMembership(ctx.Context(), groupID, userID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if member == nil {
		return ctx.NotFound(errors.New("user is not a member of the group"))
	}
	if member.IsLeader {
		return ctx.BadRequest(errors.New("cannot remove a group leader"))
	}

	if err = gh.groupService.GroupRepo().RemoveUserFromGroup(ctx.Context(), groupID, userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// addUserToGroup adds a user to a group.
// @Summary Add user to group
// @Tags groups
// @Accept json
// @Param id path string true "Group ID"
// @Param request body dto.AddGroupMemberRequest true "Group member payload"
// @Success 200 {string} string "OK"
// @Failure 400 {object} string "Bad Request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "Not Found"
// @Failure 500 {object} string "Internal Server Error"
// @Security ApiKeyAuth
// @Router /groups/{id}/members [post]
func (gh *group) addUserToGroup(ctx *handler.Context) error {
	groupID := ctx.PathValue("id")
	if groupID == "" {
		return ctx.BadRequest(errors.New("missing group ID"))
	}

	var req dto.AddGroupMemberRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}
	if req.UserID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	member, err := gh.groupService.GroupRepo().GetUserGroupMembership(ctx.Context(), groupID, req.UserID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if member != nil {
		return ctx.BadRequest(errors.New("user is already a member of the group"))
	}

	if _, err = gh.groupService.GroupRepo().GetGroupByID(ctx.Context(), groupID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("group not found"))
		}
		return ctx.InternalServerError()
	}

	if err = gh.groupService.GroupRepo().AddUserToGroup(ctx.Context(), groupID, req.UserID); err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23503" {
			return ctx.NotFound(errors.New("user not found"))
		}
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
