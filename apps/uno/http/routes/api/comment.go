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

type comments struct {
	logger              port.Logger
	commentService      *service.CommentService
	notificationService *service.NotificationService
}

func NewCommentMux(logger port.Logger, commentService *service.CommentService, notificationService *service.NotificationService, admin handler.Middleware) *router.Mux {
	c := comments{logger, commentService, notificationService}
	mux := router.NewMux()

	// Admin
	mux.POST("/", c.createComment, admin)
	mux.GET("/{id}", c.getCommentsByID, admin)
	mux.POST("/{id}/reaction", c.reactToComment, admin)
	mux.DELETE("/{id}", c.deleteComment, admin)

	return mux
}

// getCommentsByID returns a comment by its ID
// @Summary      Get comments by ID
// @Tags         comments
// @Produce      json
// @Param        id   path      string  true  "Comment ID"
// @Success      200  {array}   dto.CommentResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments/{id} [get]
func (c *comments) getCommentsByID(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.Error(errors.New("missing comment ID"), http.StatusBadRequest)
	}

	comments, err := c.commentService.GetCommentsByID(ctx.Context(), id)
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.CommentsFromDomainList(comments)
	return ctx.JSON(response)
}

// createComment creates a new comment
// @Summary      Create a new comment
// @Tags         comments
// @Accept       json
// @Produce      json
// @Param        comment  body  dto.CreateCommentRequest  true  "Comment to create"
// @Success      200      "OK"
// @Failure      400      {string}  string                      "Bad Request"
// @Failure      401      {string}  string                      "Unauthorized"
// @Failure      500      {string}  string                      "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments [post]
func (c *comments) createComment(ctx *handler.Context) error {
	var req dto.CreateCommentRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if err := c.commentService.CreateComment(ctx.Context(), req.Content, req.PostID, req.UserID, req.ParentCommentID); err != nil {
		return ctx.InternalServerError()
	}

	if req.ParentCommentID != nil {
		if err := c.notificationService.CreateReplyNotifications(ctx.Context(), *req.ParentCommentID, req.UserID, req.PostID); err != nil {
			c.logger.Error(ctx.Context(), "failed to create reply notifications", "error", err)
		}
	}

	return ctx.Ok()
}

// reactToComment adds or removes a reaction to a comment
// @Summary      React to a comment
// @Tags         comments
// @Accept       json
// @Produce      json
// @Param        id        path      string                 true  "Comment ID"
// @Param        reaction  body      dto.ReactToCommentRequest  true  "Reaction to add or remove"
// @Success      200       "OK"
// @Failure      400       {string}  string                       "Bad Request"
// @Failure      401       {string}  string                       "Unauthorized"
// @Failure      500       {string}  string                       "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments/{id}/reaction [post]
func (c *comments) reactToComment(ctx *handler.Context) error {
	commentID := ctx.PathValue("id")
	if commentID == "" {
		return ctx.Error(errors.New("missing comment ID"), http.StatusBadRequest)
	}

	var req dto.ReactToCommentRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	err := c.commentService.ReactToComment(ctx.Context(), commentID, req.UserID)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// deleteComment deletes a comment by id
// @Summary      Delete comment
// @Tags         comments
// @Produce      json
// @Param        id   path      string  true  "Comment ID"
// @Success      200  "OK"
// @Failure      400  {string}  string           "Bad Request"
// @Failure      401  {string}  string           "Unauthorized"
// @Failure      500  {string}  string           "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments/{id} [delete]
func (c *comments) deleteComment(ctx *handler.Context) error {
	commentID := ctx.PathValue("id")
	if commentID == "" {
		return ctx.Error(errors.New("missing comment ID"), http.StatusBadRequest)
	}

	if err := c.commentService.DeleteComment(ctx.Context(), commentID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
