package birthday

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/pkg/uno"
)

type birthdays struct {
	logger      port.Logger
	userService *service.UserService
}

func NewMux(logger port.Logger, userService *service.UserService) *uno.Mux {
	b := birthdays{logger, userService}
	mux := uno.NewMux()

	mux.Handle("GET", "/", b.birthdaysToday)

	return mux
}

// birthdaysToday returns a list of names
// @Summary	     Get users with birthdays
// @Description  Gets all the users who have birthday today
// @Tags         birthdays
// @Produce      json
// @Success      200  {array}  string  "OK"
// @Router       /birthdays [get]
func (b *birthdays) birthdaysToday(ctx *uno.Context) error {
	users, err := b.userService.GetUsersWithBirthdayToday(ctx.Context())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
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
