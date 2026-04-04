package rule

import (
	"slices"
	"uno/domain/model"
)

// FitsInSpotRange checks if a user fits in a spot range.
func FitsInSpotRange(user *model.User, spotRange *model.SpotRange) bool {
	if user.Year == nil {
		return false
	}
	return user.Year.Int() >= spotRange.MinYear && user.Year.Int() <= spotRange.MaxYear
}

// IsAvailableSpot checks if there is an available spot for a user in the given
// spot ranges considering existing registrations.
func IsAvailableSpot(
	spotRanges []model.SpotRange,
	registrations []model.Registration,
	usersByID map[string]*model.User,
	membershipsByUserID map[string][]string,
	hostGroups []string,
	user *model.User,
	canSkip bool,
) bool {
	waitlisted := []model.Registration{}
	for _, reg := range registrations {
		if reg.Status == model.RegistrationStatusWaitlisted {
			waitlisted = append(waitlisted, reg)
		}
	}

	isHost := func(userID string) bool {
		memberships, ok := membershipsByUserID[userID]
		if !ok {
			return false
		}
		for _, groupID := range memberships {
			if slices.Contains(hostGroups, groupID) {
				return true
			}
		}
		return false
	}

	relevantSpotRanges := []model.SpotRange{}
	for _, sr := range spotRanges {
		hasWaitlisted := false
		for _, wl := range waitlisted {
			wlUser := usersByID[wl.UserID]
			if wlUser != nil && (FitsInSpotRange(wlUser, &sr) || isHost(wl.UserID)) {
				hasWaitlisted = true
				break
			}
		}
		if !hasWaitlisted {
			relevantSpotRanges = append(relevantSpotRanges, sr)
		}
	}

	if len(relevantSpotRanges) == 0 {
		return false
	}

	sortedSpotRanges := make([]model.SpotRange, len(relevantSpotRanges))
	copy(sortedSpotRanges, relevantSpotRanges)

	for i := range sortedSpotRanges {
		for j := i + 1; j < len(sortedSpotRanges); j++ {
			sizeI := sortedSpotRanges[i].MaxYear - sortedSpotRanges[i].MinYear
			sizeJ := sortedSpotRanges[j].MaxYear - sortedSpotRanges[j].MinYear
			if sizeI > sizeJ {
				sortedSpotRanges[i], sortedSpotRanges[j] = sortedSpotRanges[j], sortedSpotRanges[i]
			}
		}
	}

	spotsLeft := make([]int, len(sortedSpotRanges))
	for i, sr := range sortedSpotRanges {
		spotsLeft[i] = sr.Spots
	}

	unallocatedRegistered := 0
	for _, reg := range registrations {
		regUser := usersByID[reg.UserID]

		allocated := false
		if regUser != nil {
			for i, sr := range sortedSpotRanges {
				if (FitsInSpotRange(regUser, &sr) || isHost(reg.UserID)) && spotsLeft[i] > 0 {
					spotsLeft[i]--
					allocated = true
					break
				}
			}
		}

		if !allocated && reg.Status == model.RegistrationStatusRegistered {
			unallocatedRegistered++
		}
	}

	for i, sr := range sortedSpotRanges {
		if FitsInSpotRange(user, &sr) || canSkip {
			if sr.Spots == 0 {
				return true
			}
			if spotsLeft[i]-unallocatedRegistered > 0 {
				return true
			}
			unallocatedRegistered -= spotsLeft[i]
			if unallocatedRegistered < 0 {
				unallocatedRegistered = 0
			}
		}
	}

	return false
}
