package api

import (
	"net/http"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type notifications struct {
	notificationService *service.NotificationService
}

func NewNotificationMux(notificationService *service.NotificationService, session handler.Middleware) *router.Mux {
	n := notifications{notificationService}
	mux := router.NewMux()

	mux.GET("/", n.getNotifications, session)
	mux.PATCH("/{id}/archive", n.archiveNotification, session)
	mux.PATCH("/{id}/seen", n.markSeen, session)

	return mux
}

// getNotifications returns all active notifications for the current user
// @Summary      Get notifications
// @Tags         notifications
// @Produce      json
// @Success      200  {array}   dto.NotificationResponse  "OK"
// @Failure      401  {string}  string                    "Unauthorized"
// @Failure      500  {string}  string                    "Internal Server Error"
// @Security     BearerAuth
// @Router       /notifications [get]
func (n *notifications) getNotifications(ctx *handler.Context) error {
	user, ok := handler.UserFromContext(ctx.Context())
	if !ok {
		return ctx.Error(nil, http.StatusUnauthorized)
	}

	items, err := n.notificationService.GetByUserID(ctx.Context(), user.ID)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.NotificationsFromDomainList(items))
}

// archiveNotification archives a notification by ID for the current user
// @Summary      Archive notification
// @Tags         notifications
// @Produce      json
// @Param        id   path      int  true  "Notification ID"
// @Success      200  {object}  map[string]bool  "OK"
// @Failure      400  {string}  string           "Bad Request"
// @Failure      401  {string}  string           "Unauthorized"
// @Failure      500  {string}  string           "Internal Server Error"
// @Security     BearerAuth
// @Router       /notifications/{id}/archive [patch]
func (n *notifications) archiveNotification(ctx *handler.Context) error {
	user, ok := handler.UserFromContext(ctx.Context())
	if !ok {
		return ctx.Error(nil, http.StatusUnauthorized)
	}

	id, err := ctx.PathValueInt("id")
	if err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if err := n.notificationService.Archive(ctx.Context(), id, user.ID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// markSeen marks a notification as seen for the current user
// @Summary      Mark notification as seen
// @Tags         notifications
// @Produce      json
// @Param        id   path      int  true  "Notification ID"
// @Success      200  {object}  map[string]bool  "OK"
// @Failure      400  {string}  string           "Bad Request"
// @Failure      401  {string}  string           "Unauthorized"
// @Failure      500  {string}  string           "Internal Server Error"
// @Security     BearerAuth
// @Router       /notifications/{id}/seen [patch]
func (n *notifications) markSeen(ctx *handler.Context) error {
	user, ok := handler.UserFromContext(ctx.Context())
	if !ok {
		return ctx.Error(nil, http.StatusUnauthorized)
	}

	id, err := ctx.PathValueInt("id")
	if err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if err := n.notificationService.MarkSeen(ctx.Context(), id, user.ID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
