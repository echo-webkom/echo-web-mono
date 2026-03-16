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

type quotes struct {
	logger       port.Logger
	quoteService *service.QuoteService
}

func NewQuoteMux(
	logger port.Logger,
	quoteService *service.QuoteService,
	sessionOrAdmin handler.Middleware,
	session handler.Middleware,
	admin handler.Middleware,
) *router.Mux {
	q := quotes{logger, quoteService}
	mux := router.NewMux()

	// Admin
	mux.Handle(http.MethodGet, "/", q.getQuotes, sessionOrAdmin)
	mux.Handle(http.MethodPost, "/", q.createQuote, session)
	mux.Handle(http.MethodDelete, "/{id}", q.deleteQuote, admin)

	return mux
}

// getQuotes returns all quotes
// @Summary	     Get all quotes
// @Tags         quotes
// @Accept       json
// @Produce      json
// @Success      200  {array}  dto.QuoteResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /quotes/ [get]
// @Security     BearerAuth
func (q *quotes) getQuotes(ctx *handler.Context) error {
	quotes, err := q.quoteService.Repo().GetQuotes(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.QuotesResponseFromDomainList(quotes)
	return ctx.JSON(response)
}

// createQuote creates a new quote
// @Summary	     Create a new quote
// @Tags         quotes
// @Accept       json
// @Produce      json
// @Param        quote  body      dto.QuoteRequest  true  "Quote to create"
// @Success      200  {string}  string  "Created"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  string  "Internal Server Error"
// @Router       /quotes/ [post]
// @Security     BearerAuth
func (q *quotes) createQuote(ctx *handler.Context) error {
	var req dto.QuoteRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	user, ok := handler.UserFromContext(ctx.Context())
	if !ok {
		return ctx.Unauthorized(errors.New("user not found"))
	}

	quote := req.ToDomain()
	if err := q.quoteService.Repo().CreateQuote(ctx.Context(), quote, user.ID); err != nil {
		return ctx.InternalServerError()
	}

	response := dto.QuoteFromDomain(quote)
	return ctx.JSON(response)
}

// deleteQuote deletes a quote by ID
// @Summary	     Delete a quote by ID
// @Tags         quotes
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Quote ID"
// @Success      200  {string}  string  "Deleted"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /quotes/{id} [delete]
// @Security     ApiKeyAuth
// @Security     BearerAuth
func (q *quotes) deleteQuote(ctx *handler.Context) error {
	quoteID := ctx.PathValue("id")
	if quoteID == "" {
		return ctx.BadRequest(errors.New("quote ID is required"))
	}
	if err := q.quoteService.Repo().DeleteQuote(ctx.Context(), quoteID); err != nil {
		return ctx.InternalServerError()
	}
	return nil
}
