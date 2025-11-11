package api

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
)

var (
	errMissingId = errors.New("missing id parameter")
)

type comments struct {
	logger         port.Logger
	commentService *service.CommentService
}

func NewCommentMux(logger port.Logger, commentService *service.CommentService) *router.Mux {
	c := comments{logger, commentService}
	mux := router.NewMux()

	mux.Handle("POST", "/", c.CreateCommentHandler)
	mux.Handle("GET", "/{id}", c.GetCommentsByIDHandler)
	mux.Handle("GET", "/{id}/reaction", c.ReactToCommentHandler)

	return mux
}

// GetCommentsByIDHandler returns a comment by its ID
// @Summary      Get comments by ID
// @Tags         comments
// @Produce      json
// @Param        id   path      string  true  "Comment ID"
// @Success      200  {array}   port.CommentWithReactionsAndUser  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments/{id} [get]
func (c *comments) GetCommentsByIDHandler(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.Error(errMissingId, http.StatusBadRequest)
	}

	comments, err := c.commentService.CommentRepo().GetCommentsByID(ctx.Context(), id)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.JSON(comments)
}

type CreateCommentRequest struct {
	Content         string  `json:"content"`
	PostID          string  `json:"postId"`
	UserID          string  `json:"userId"`
	ParentCommentID *string `json:"parentCommentId"`
}

// CreateCommentHandler creates a new comment
// @Summary      Create a new comment
// @Tags         comments
// @Accept       json
// @Produce      json
// @Param        comment  body      CreateCommentRequest  true  "Comment to create"
// @Success      200      {object}  map[string]bool             "OK"
// @Failure      400      {string}  string                      "Bad Request"
// @Failure      401      {string}  string                      "Unauthorized"
// @Failure      500      {string}  string                      "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments [post]
func (c *comments) CreateCommentHandler(ctx *handler.Context) error {
	var req CreateCommentRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(errors.New("bad request data"), http.StatusBadRequest)
	}

	err := c.commentService.CommentRepo().CreateComment(ctx.Context(), req.Content, req.PostID, req.UserID, req.ParentCommentID)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.JSON(map[string]bool{"success": true})
}

type ReactToCommentRequest struct {
	CommentID string `json:"commentId"`
	UserID    string `json:"userId"`
}

// ReactToCommentHandler adds or removes a reaction to a comment
// @Summary      React to a comment
// @Tags         comments
// @Accept       json
// @Produce      json
// @Param        id        path      string                 true  "Comment ID"
// @Param        reaction  body      ReactToCommentRequest  true  "Reaction to add or remove"
// @Success      200       {object}  map[string]bool              "OK"
// @Failure      400       {string}  string                       "Bad Request"
// @Failure      401       {string}  string                       "Unauthorized"
// @Failure      500       {string}  string                       "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments/{id}/reaction [post]
func (c *comments) ReactToCommentHandler(ctx *handler.Context) error {
	commentID := ctx.PathValue("id")
	if commentID == "" {
		return ctx.Error(errMissingId, http.StatusBadRequest)
	}

	var req ReactToCommentRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(errors.New("bad json data"), http.StatusBadRequest)
	}

	err := c.commentService.ReactToComment(ctx.Context(), commentID, req.UserID)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.JSON(map[string]bool{"success": true})
}
