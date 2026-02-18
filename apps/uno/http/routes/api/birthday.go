package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
)

type birthdays struct {
	logger      port.Logger
	userService *service.UserService
}

func NewBirthdayMux(logger port.Logger, userService *service.UserService) *router.Mux {
	b := birthdays{logger, userService}
	mux := router.NewMux()

	mux.Handle("GET", "/", b.BirthdaysTodayHandler)

	return mux
}

// BirthdaysTodayHandler returns a list of names
// @Summary	     Get users with birthdays
// @Description  Gets all the users who have birthday today
// @Tags         birthdays
// @Produce      json
// @Success      200  {array}  string  "OK"
// @Router       /birthdays [get]
func (b *birthdays) BirthdaysTodayHandler(ctx *handler.Context) error {
	users, err := b.userService.GetUsersWithBirthdayToday(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	names := []string{}
	for _, user := range users {
		if user.Name != nil {
			names = append(names, *user.Name)
		}
	}

	return ctx.JSON(names)
}
