package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/services"

	_ "uno/domain/repo"
)

// UnbanUsersWithExpiredStrikesHandler bans users with expired strikes and bans
// @Summary	     Unban users with expired strikes and bans
// @Tags         strikes
// @Success      200  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/unban [post]
func UnbanUsersWithExpiredStrikesHandler(strikeService *services.StrikeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		if err := strikeService.UnbanUsersWithExpiredStrikes(r.Context()); err != nil {
			return http.StatusInternalServerError, err
		}
		return http.StatusOK, nil
	}
}

// GetUsersWithStrikesHandler returns all users with strikes and bans
// @Summary	     Gets users with strikes and bans
// @Tags         strikes
// @Success      200  {array}  repo.UserWithStrikes  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/users [get]
func GetUsersWithStrikesHandler(strikeService *services.StrikeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		users, err := strikeService.GetUsersWithStrikes(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, users)
	}
}

// GetBannedUsers returns all banned users
// @Summary	     Gets all users that are banned
// @Tags         strikes
// @Success      200  {array}  repo.UserWithBanInfo  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/banned [get]
func GetBannedUsers(strikeService *services.StrikeService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		users, err := strikeService.GetBannedUsers(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return util.JsonOk(w, users)
	}
}
