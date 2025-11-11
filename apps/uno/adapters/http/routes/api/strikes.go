package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/port"
	"uno/domain/service"
)

// UnbanUsersWithExpiredStrikesHandler bans users with expired strikes and bans
// @Summary	     Unban users with expired strikes and bans
// @Tags         strikes
// @Success      200  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/unban [post]
func UnbanUsersWithExpiredStrikesHandler(logger port.Logger, strikeService *service.StrikeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		if err := strikeService.UnbanUsersWithExpiredStrikes(r.Context()); err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return http.StatusOK, nil
	}
}

// GetUsersWithStrikesHandler returns all users with strikes and bans
// @Summary	     Gets users with strikes and bans
// @Tags         strikes
// @Success      200  {array}  port.UserWithStrikes  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/users [get]
func GetUsersWithStrikesHandler(logger port.Logger, strikeService *service.StrikeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		users, err := strikeService.GetUsersWithStrikes(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, users)
	}
}

// GetBannedUsers returns all banned users
// @Summary	     Gets all users that are banned
// @Tags         strikes
// @Success      200  {array}  port.UserWithBanInfo  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/banned [get]
func GetBannedUsers(logger port.Logger, strikeService *service.StrikeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		users, err := strikeService.GetBannedUsers(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, users)
	}
}
