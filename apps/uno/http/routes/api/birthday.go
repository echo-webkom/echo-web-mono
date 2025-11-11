package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
)

// BirthdaysTodayHandler returns a list of names
// @Summary	     Get users with birthdays
// @Description  Gets all the users who have birthday today
// @Tags         birthdays
// @Produce      json
// @Success      200  {array}  string  "OK"
// @Router       /birthdays [get]
func BirthdaysTodayHandler(logger port.Logger, userService *service.UserService) handler.Handler {
	return func(ctx *handler.Context) error {
		users, err := userService.GetUsersWithBirthdayToday(ctx.Context())
		if err != nil {
			return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
		}

		var names []string
		for _, user := range users {
			if user.Name != nil {
				names = append(names, *user.Name)
			}
		}

		return ctx.JSON(names)
	}
}
