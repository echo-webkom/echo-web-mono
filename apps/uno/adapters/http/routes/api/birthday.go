package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/port"
	"uno/domain/service"
)

// BirthdaysTodayHandler returns a list of names
// @Summary	     Get users with birthdays
// @Description  Gets all the users who have birthday today
// @Tags         birthdays
// @Produce      json
// @Success      200  {array}  string  "OK"
// @Router       /birthdays [get]
func BirthdaysTodayHandler(logger port.Logger, userService *service.UserService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		users, err := userService.GetUsersWithBirthdayToday(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		var names []string
		for _, user := range users {
			if user.Name != nil {
				names = append(names, *user.Name)
			}
		}

		return util.JsonOk(w, names)
	}
}
