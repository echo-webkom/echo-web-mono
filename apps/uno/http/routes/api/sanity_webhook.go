package api

import (
	"errors"
	"fmt"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type sanityWebhook struct {
	logger           port.Logger
	happeningService *service.HappeningService
}

func NewSanityWebhookMux(logger port.Logger, happeningService *service.HappeningService, admin handler.Middleware) *router.Mux {
	sw := &sanityWebhook{
		logger:           logger,
		happeningService: happeningService,
	}

	mux := router.NewMux()
	mux.Handle("POST", "/webhook", sw.handleWebhook, admin)

	return mux
}

// handleWebhook processes incoming webhooks from Sanity. It uses the data to update the database accordingly.
// @Summary	     Process Sanity webhook
// @Tags         sanity
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]string  "Success"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /sanity/webhook [get]
func (sw *sanityWebhook) handleWebhook(ctx *handler.Context) error {
	var req dto.SanityWebhookRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(fmt.Errorf("failed to parse request body: %w", err), http.StatusBadRequest)
	}

	sw.logger.Info(ctx.Context(), "sanity webhook received",
		"operation", req.Operation,
		"document_id", req.DocumentID,
	)

	switch req.Operation {
	case "create", "update", "delete":
		// valid
	default:
		return ctx.Error(fmt.Errorf("unknown operation %s", req.Operation), http.StatusBadRequest)
	}

	// Skip external happenings
	if req.Data != nil && req.Data.HappeningType == "external" {
		return ctx.JSON(map[string]string{
			"message": fmt.Sprintf("Happening with id %s is external. Nothing done.", req.Data.ID),
		})
	}

	// Delete the happening if the operation is "delete".
	if req.Operation == "delete" {
		if err := sw.happeningService.HappeningRepo().DeleteHappening(ctx.Context(), req.DocumentID); err != nil {
			return ctx.Error(err, http.StatusInternalServerError)
		}

		return ctx.JSON(map[string]string{
			"status":  "success",
			"message": fmt.Sprintf("Deleted happening with id %s", req.DocumentID),
		})
	}

	if req.Data == nil {
		sw.logger.Warn(ctx.Context(), "no data provided")
		return ctx.Error(errors.New("no data provided"), http.StatusBadRequest)
	}

	// Sync the happening for "create" and "update" operations.
	if err := sw.happeningService.SyncHappening(ctx.Context(), req.Data.ToServiceData()); err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	actionStr := "inserted"
	if req.Operation == "update" {
		actionStr = "updated"
	}

	return ctx.JSON(map[string]string{
		"status":  "success",
		"message": fmt.Sprintf("Happening with id %s %s", req.Data.ID, actionStr),
	})
}
