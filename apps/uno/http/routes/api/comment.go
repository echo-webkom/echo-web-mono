package api

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/router"
	"uno/http/util"
)

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
func GetCommentsByIDHandler(logger port.Logger, commentService *service.CommentService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, nil
		}
		comments, err := commentService.CommentRepo().GetCommentsByID(ctx, id)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, comments)
	}
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
func CreateCommentHandler(logger port.Logger, commentService *service.CommentService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()
		var req CreateCommentRequest
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, errors.New("invalid request")
		}
		err := commentService.CommentRepo().CreateComment(ctx, req.Content, req.PostID, req.UserID, req.ParentCommentID)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, map[string]bool{"success": true})
	}
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
func ReactToCommentHandler(logger port.Logger, commentService *service.CommentService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()
		commentID := r.PathValue("id")
		if commentID == "" {
			return http.StatusBadRequest, nil
		}
		var req ReactToCommentRequest
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, errors.New("failed to read json")
		}
		err := commentService.ReactToComment(ctx, commentID, req.UserID)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, map[string]bool{"success": true})
	}
}
