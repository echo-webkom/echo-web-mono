package dto

import (
	"uno/domain/model"
)

type UserWithStrikesResponse struct {
	ID       string  `json:"id"`
	Name     *string `json:"name"`
	HasImage bool    `json:"hasImage"`
	IsBanned bool    `json:"isBanned"`
	Strikes  int     `json:"strikes"`
}

type AddStrikeRequest struct {
	UserID              string `json:"userId"`
	Count               int    `json:"count"`
	Reason              string `json:"reason"`
	StrikeExpiresMonths int    `json:"strikeExpiresInMonths"`
	BanExpiresMonths    int    `json:"banExpiresInMonths"`
	StrikedBy           string `json:"strikedBy"`
}

func UsersWithStrikesFromDomainList(users []model.UserWithStrikes) []UserWithStrikesResponse {
	resp := make([]UserWithStrikesResponse, len(users))
	for i, user := range users {
		resp[i] = UserWithStrikesResponse{
			ID:       user.ID,
			Name:     user.Name,
			HasImage: user.HasImage,
			IsBanned: user.IsBanned,
			Strikes:  user.Strikes,
		}
	}

	return resp
}

type BannedStrikedByUser struct {
	Name *string `json:"name"`
}

type BanInfo struct {
	ID           int                 `json:"id"`
	Reason       string              `json:"reason"`
	CreatedAt    string              `json:"createdAt"`
	UserID       string              `json:"userId"`
	BannedBy     string              `json:"bannedBy"`
	ExpiresAt    string              `json:"expiresAt"`
	BannedByUser BannedStrikedByUser `json:"bannedByUser"`
}

type DotInfo struct {
	ID            int                 `json:"id"`
	Reason        string              `json:"reason"`
	CreatedAt     string              `json:"createdAt"`
	UserID        string              `json:"userId"`
	ExpiresAt     string              `json:"expiresAt"`
	Count         int                 `json:"count"`
	StrikedBy     string              `json:"strikedBy"`
	StrikedByUser BannedStrikedByUser `json:"strikedByUser"`
}

type UserWithBanInfoResponse struct {
	ID       string    `json:"id"`
	Name     *string   `json:"name"`
	HasImage bool      `json:"hasImage"`
	BanInfo  *BanInfo  `json:"banInfo"`
	Dots     []DotInfo `json:"dots"`
}

type UserWithStrikeDetailsResponse struct {
	ID       string    `json:"id"`
	Name     *string   `json:"name"`
	HasImage bool      `json:"hasImage"`
	BanInfo  *BanInfo  `json:"banInfo"`
	Dots     []DotInfo `json:"dots"`
}

func BannedUsersFromDomainList(users []model.UserWithBanInfo) []UserWithBanInfoResponse {
	resp := make([]UserWithBanInfoResponse, len(users))
	for i, user := range users {
		banInfo := &BanInfo{
			ID:        user.BanInfo.ID,
			Reason:    user.BanInfo.Reason,
			CreatedAt: FormatISO8601(user.BanInfo.CreatedAt),
			UserID:    user.BanInfo.UserID,
			BannedBy:  user.BanInfo.BannedByID,
			ExpiresAt: FormatISO8601(user.BanInfo.ExpiresAt),
			BannedByUser: BannedStrikedByUser{
				Name: user.BanInfo.BannedByName,
			},
		}

		dots := make([]DotInfo, len(user.Dots))
		for j, dot := range user.Dots {
			dots[j] = DotInfo{
				ID:        dot.ID,
				Reason:    dot.Reason,
				CreatedAt: FormatISO8601(dot.CreatedAt),
				UserID:    dot.UserID,
				ExpiresAt: FormatISO8601(dot.ExpiresAt),
				Count:     dot.Count,
				StrikedBy: dot.StrikedByID,
				StrikedByUser: BannedStrikedByUser{
					Name: dot.StrikedByName,
				},
			}
		}

		resp[i] = UserWithBanInfoResponse{
			ID:       user.ID,
			Name:     user.Name,
			HasImage: user.HasImage,
			BanInfo:  banInfo,
			Dots:     dots,
		}
	}

	return resp
}

func UsersWithStrikeDetailsFromDomainList(users []model.UserWithStrikeDetails) []UserWithStrikeDetailsResponse {
	resp := make([]UserWithStrikeDetailsResponse, len(users))
	for i, user := range users {
		resp[i] = UserWithStrikeDetailsFromDomain(user)
	}

	return resp
}

func UserWithStrikeDetailsFromDomain(user model.UserWithStrikeDetails) UserWithStrikeDetailsResponse {
	var banInfo *BanInfo
	if user.BanInfo != nil {
		banInfo = &BanInfo{
			ID:        user.BanInfo.ID,
			Reason:    user.BanInfo.Reason,
			CreatedAt: FormatISO8601(user.BanInfo.CreatedAt),
			UserID:    user.BanInfo.UserID,
			BannedBy:  user.BanInfo.BannedByID,
			ExpiresAt: FormatISO8601(user.BanInfo.ExpiresAt),
			BannedByUser: BannedStrikedByUser{
				Name: user.BanInfo.BannedByName,
			},
		}
	}

	dots := make([]DotInfo, len(user.Dots))
	for j, dot := range user.Dots {
		dots[j] = DotInfo{
			ID:        dot.ID,
			Reason:    dot.Reason,
			CreatedAt: FormatISO8601(dot.CreatedAt),
			UserID:    dot.UserID,
			ExpiresAt: FormatISO8601(dot.ExpiresAt),
			Count:     dot.Count,
			StrikedBy: dot.StrikedByID,
			StrikedByUser: BannedStrikedByUser{
				Name: dot.StrikedByName,
			},
		}
	}

	return UserWithStrikeDetailsResponse{
		ID:       user.ID,
		Name:     user.Name,
		HasImage: user.HasImage,
		BanInfo:  banInfo,
		Dots:     dots,
	}
}

// AddStrikeResponse represents the response for adding a strike
type AddStrikeResponse struct {
	IsBanned bool   `json:"isBanned"`
	Message  string `json:"message"`
}
