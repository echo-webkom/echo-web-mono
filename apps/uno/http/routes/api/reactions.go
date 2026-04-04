package api

import (
	"errors"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type reactions struct {
	logger          port.Logger
	reactionService *service.ReactionService
}

func NewReactionMux(logger port.Logger, reactionService *service.ReactionService, admin handler.Middleware) *router.Mux {
	r := reactions{logger, reactionService}

	mux := router.NewMux()

	mux.GET("/{key}", r.getReactions, admin)
	mux.POST("/{key}", r.toggleReaction, admin)

	return mux
}

// getReactions returns a list of reactions for a given key
// @Summary	     Get reactions for a given key
// @Tags         reactions
// @Accept       json
// @Produce      json
// @Param        key  path  string  true  "Key to get reactions for"
// @Success      200  {array}  dto.ReactionResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /reactions/{key} [get]
func (r *reactions) getReactions(ctx *handler.Context) error {
	key := ctx.PathValue("key")
	if key == "" {
		return ctx.BadRequest(errors.New("missing reaction key"))
	}

	reactions, err := r.reactionService.GetReactionsByID(ctx.Context(), key)
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.ReactionResponsesFromDomain(reactions)
	return ctx.JSON(response)
}

// toggleReaction toggles a reaction for a given key and user
// @Summary	     Toggle a reaction for a given key and user
// @Tags         reactions
// @Accept       json
// @Produce      json
// @Param        key  path  string  true  "Key to toggle reaction for"
// @Param        request body dto.ToggleReactionRequest true "Toggle Reaction Request"
// @Success      200  {array}  dto.ReactionResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /reactions/{key} [post]
func (r *reactions) toggleReaction(ctx *handler.Context) error {
	key := ctx.PathValue("key")
	if key == "" {
		return ctx.BadRequest(errors.New("missing reaction key"))
	}

	var req dto.ToggleReactionRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	reaction := model.NewReaction{
		UserID:     req.UserID,
		ReactToKey: key,
		EmojiID:    req.EmojiID,
	}

	err := r.reactionService.ToggleReaction(ctx.Context(), reaction)
	if err != nil {
		return ctx.InternalServerError()
	}

	reactions, err := r.reactionService.GetReactionsByID(ctx.Context(), key)
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.ReactionResponsesFromDomain(reactions)
	return ctx.JSON(response)
}
