package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/services"

	_ "uno/domain/repo"
)

// GetCommentsByIDHandler returns a comment by its ID
// @Summary      Get comments by ID
// @Tags         comments
// @Produce      json
// @Param        id   path      string  true  "Comment ID"
// @Success      200  {array}   repo.CommentWithReactionsAndUser  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /comments/{id} [get]
func GetCommentsByIDHandler(commentService *services.CommentService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, nil
		}
		comments, err := commentService.Queries().GetCommentsByID(r.Context(), id)
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, comments)
	}
}

type CreateCommentRequest struct {
	Content         string  `json:"content"`
	PostID          string  `json:"post_id"`
	UserID          string  `json:"user_id"`
	ParentCommentID *string `json:"parent_comment_id"`
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
func CreateCommentHandler(commentService *services.CommentService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		var req CreateCommentRequest
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, err
		}
		err := commentService.Queries().CreateComment(r.Context(), req.Content, req.PostID, req.UserID, req.ParentCommentID)
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, map[string]bool{"success": true})
	}
}

type ReactToCommentRequest struct {
	CommentID string `json:"comment_id"`
	UserID    string `json:"user_id"`
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
func ReactToCommentHandler(commentService *services.CommentService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		commentID := r.PathValue("id")
		if commentID == "" {
			return http.StatusBadRequest, nil
		}
		var req struct {
			CommentID string `json:"comment_id"`
			UserID    string `json:"user_id"`
		}
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, err
		}
		err := commentService.ReactToComment(r.Context(), commentID, req.UserID)
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, map[string]bool{"success": true})
	}
}
