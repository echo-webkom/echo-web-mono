package dto

import (
	"uno/domain/model"
)

type UserWithStrikesResponse struct {
	ID       string  `json:"id" validate:"required"`
	Name     *string `json:"name" validate:"required"`
	HasImage bool    `json:"hasImage" validate:"required"`
	IsBanned bool    `json:"isBanned" validate:"required"`
	Strikes  int     `json:"strikes" validate:"required"`
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

//	Array<{
//	  id: string;
//	  name: string | null;
//	  image: string | null;
//	  banInfo: {
//	    id: number;
//	    reason: string;
//	    createdAt: Date;
//	    userId: string;
//	    bannedBy: string;
//	    expiresAt: Date;
//	    bannedByUser: {
//	      name: string | null;
//	    };
//	  };
//	  dots: Array<{
//	    id: number;
//	    reason: string;
//	    createdAt: Date;
//	    userId: string;
//	    expiresAt: Date;
//	    count: number;
//	    strikedBy: string;
//	    strikedByUser: {
//	      name: string;
//	    };
//	  }>;
//	}>

type BannedStrikedByUser struct {
	Name *string `json:"name"`
}

type BanInfo struct {
	ID           int                 `json:"id" validate:"required"`
	Reason       string              `json:"reason" validate:"required"`
	CreatedAt    string              `json:"createdAt" validate:"required"`
	UserID       string              `json:"userId" validate:"required"`
	BannedBy     string              `json:"bannedBy" validate:"required"`
	ExpiresAt    string              `json:"expiresAt" validate:"required"`
	BannedByUser BannedStrikedByUser `json:"bannedByUser" validate:"required"`
}

type DotInfo struct {
	ID            int                 `json:"id" validate:"required"`
	Reason        string              `json:"reason" validate:"required"`
	CreatedAt     string              `json:"createdAt" validate:"required"`
	UserID        string              `json:"userId" validate:"required"`
	ExpiresAt     string              `json:"expiresAt" validate:"required"`
	Count         int                 `json:"count" validate:"required"`
	StrikedBy     string              `json:"strikedBy" validate:"required"`
	StrikedByUser BannedStrikedByUser `json:"strikedByUser" validate:"required"`
}

type UserWithBanInfoResponse struct {
	ID       string    `json:"id" validate:"required"`
	Name     *string   `json:"name" validate:"required"`
	HasImage bool      `json:"hasImage" validate:"required"`
	BanInfo  *BanInfo  `json:"banInfo" validate:"required"`
	Dots     []DotInfo `json:"dots" validate:"required"`
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
