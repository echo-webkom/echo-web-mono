package service

import (
	"context"
	"encoding/json"
	"slices"
	"time"
	"uno/domain/model"
	"uno/domain/ports"
)

type HappeningService struct {
	happeningRepo    ports.HappeningRepo
	userRepo         ports.UserRepo
	registrationRepo ports.RegistrationRepo
	banInfoRepo      ports.BanInfoRepo
}

func NewHappeningService(
	happeningRepo ports.HappeningRepo,
	userRepo ports.UserRepo,
	registrationRepo ports.RegistrationRepo,
	banInfoRepo ports.BanInfoRepo,
) *HappeningService {
	return &HappeningService{
		happeningRepo:    happeningRepo,
		userRepo:         userRepo,
		registrationRepo: registrationRepo,
		banInfoRepo:      banInfoRepo,
	}
}

func (hs *HappeningService) HappeningRepo() ports.HappeningRepo {
	return hs.happeningRepo
}

// RegisterResult represents the outcome of a registration attempt.
// This is a domain model for internal use in the service layer.
type RegisterResult struct {
	Success      bool
	Message      string
	IsWaitlisted bool
}

// Checks if a user fits in a spot range
// A user fits if it has filled out their year and is larger or equal to MinYear and smaller or equal to MaxYear
func fitsInSpotrange(user *model.User, spotRange *model.SpotRange) bool {
	if user.Year == nil {
		return false
	}
	return *user.Year >= spotRange.MinYear && *user.Year <= spotRange.MaxYear
}

// Checks if there is an available spot for a user in the given spot ranges considering existing registrations
func IsAvailableSpot(
	spotRanges []model.SpotRange,
	registrations []model.Registration,
	usersByID map[string]*model.User,
	membershipsByUserID map[string][]string,
	hostGroups []string,
	user *model.User,
	canSkip bool,
) bool {
	// Filter waitlisted registrations
	waitlisted := []model.Registration{}
	for _, reg := range registrations {
		if reg.Status == model.RegistrationStatusWaitlisted {
			waitlisted = append(waitlisted, reg)
		}
	}

	// Check if a user is host
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

	// Find relevant spot ranges (those without waitlisted users)
	relevantSpotRanges := []model.SpotRange{}
	for _, sr := range spotRanges {
		hasWaitlisted := false
		for _, wl := range waitlisted {
			wlUser := usersByID[wl.UserID]
			if wlUser != nil && (fitsInSpotrange(wlUser, &sr) || isHost(wl.UserID)) {
				hasWaitlisted = true
				break
			}
		}
		if !hasWaitlisted {
			relevantSpotRanges = append(relevantSpotRanges, sr)
		}
	}

	// No relevant spot ranges means no spots available
	if len(relevantSpotRanges) == 0 {
		return false
	}

	// Sort spot ranges by size (smaller ranges first)
	sortedSpotRanges := make([]model.SpotRange, len(relevantSpotRanges))
	copy(sortedSpotRanges, relevantSpotRanges)

	// Sort by size (MaxYear - MinYear)
	for i := range sortedSpotRanges {
		for j := i + 1; j < len(sortedSpotRanges); j++ {
			sizeI := sortedSpotRanges[i].MaxYear - sortedSpotRanges[i].MinYear
			sizeJ := sortedSpotRanges[j].MaxYear - sortedSpotRanges[j].MinYear
			if sizeI > sizeJ {
				sortedSpotRanges[i], sortedSpotRanges[j] = sortedSpotRanges[j], sortedSpotRanges[i]
			}
		}
	}

	// Track spots left
	spotsLeft := make([]int, len(sortedSpotRanges))
	for i, sr := range sortedSpotRanges {
		spotsLeft[i] = sr.Spots
	}

	// Allocate spots for existing registrations
	for _, reg := range registrations {
		regUser := usersByID[reg.UserID]
		if regUser == nil {
			continue
		}

		for i, sr := range sortedSpotRanges {
			if (fitsInSpotrange(regUser, &sr) || isHost(reg.UserID)) && spotsLeft[i] > 0 {
				spotsLeft[i]--
				break
			}
		}
	}

	// Check if user can fit
	for i, sr := range sortedSpotRanges {
		if fitsInSpotrange(user, &sr) || canSkip {
			if spotsLeft[i] > 0 || sr.Spots == 0 {
				return true
			}
		}
	}

	return false
}

// Validate that all required questions are answered correctly
func validateQuestions(questions []model.Question, answers []model.QuestionAnswer) bool {
	for _, question := range questions {
		// Find answer for this question
		var answer *model.QuestionAnswer
		for i := range answers {
			if answers[i].QuestionID == question.ID {
				answer = &answers[i]
				break
			}
		}

		// If no answer provided, check if required
		if answer == nil || len(answer.Answer) == 0 {
			if question.Required {
				return false
			}
			continue
		}

		// Validate based on type
		switch question.Type {
		case "text", "radio":
			var str string
			if err := json.Unmarshal(answer.Answer, &str); err != nil {
				return false
			}
			if question.Required && len(str) == 0 {
				return false
			}
		case "checkbox":
			var arr []string
			if err := json.Unmarshal(answer.Answer, &arr); err != nil {
				return false
			}
			if question.Required && len(arr) == 0 {
				return false
			}
			// Validate options if provided
			if question.Options != nil && len(arr) > 0 {
				var options []struct {
					Value string `json:"value"`
				}
				if err := json.Unmarshal(*question.Options, &options); err == nil {
					validValues := make(map[string]bool)
					for _, opt := range options {
						validValues[opt.Value] = true
					}
					for _, val := range arr {
						if !validValues[val] {
							return false
						}
					}
				}
			}
		default:
			return false
		}
	}
	return true
}

func (hs *HappeningService) Register(
	ctx context.Context,
	userID string,
	happeningID string,
	questions []model.QuestionAnswer,
) (*RegisterResult, error) {
	// 1. Get user
	user, err := hs.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return &RegisterResult{
			Success: false,
			Message: "Brukeren finnes ikke",
		}, err
	}

	// 2. Validate user has filled out study information
	if !user.IsProfileComplete() {
		return &RegisterResult{
			Success: false,
			Message: "Du må ha fylt ut studieinformasjon for å kunne registrere deg",
		}, nil
	}

	// 3. Get happening with questions
	happening, err := hs.happeningRepo.GetHappeningById(ctx, happeningID)
	if err != nil {
		return &RegisterResult{
			Success: false,
			Message: "Arrangementet finnes ikke",
		}, err
	}

	happeningQuestions, err := hs.happeningRepo.GetHappeningQuestions(ctx, happeningID)
	if err != nil {
		return &RegisterResult{Success: false, Message: "Kunne ikke hente spørsmål"}, err
	}

	// 4. Check if user is banned (for bedpres)
	if happening.IsBedpres() {
		banInfo, err := hs.banInfoRepo.GetBanInfoByUserID(ctx, userID)
		if err == nil && banInfo != nil && banInfo.ExpiresAt.After(time.Now()) {
			return &RegisterResult{
				Success: false,
				Message: "Du er bannet",
			}, nil
		}
	}

	// 5. Check if user is already registered
	existingReg, err := hs.registrationRepo.GetByUserAndHappening(ctx, userID, happeningID)
	if err == nil && existingReg != nil {
		if existingReg.IsActive() {
			message := "Du er allerede påmeldt dette arrangementet"
			if existingReg.IsWaitlisted() {
				message = "Du er allerede på venteliste til dette arrangementet"
			}
			return &RegisterResult{Success: false, Message: message}, nil
		}
	}

	// 6. Get user memberships
	memberships, err := hs.userRepo.GetUserMemberships(ctx, userID)
	if err != nil {
		memberships = []string{} // No memberships
	}

	// 7. Check registration window
	canEarlyRegister := false
	if happening.RegistrationGroups != nil {
		var regGroups []string
		if err := json.Unmarshal(*happening.RegistrationGroups, &regGroups); err == nil {
			for _, group := range regGroups {
				if slices.Contains(memberships, group) {
					canEarlyRegister = true
				}
				if canEarlyRegister {
					break
				}
			}
		}
	}

	// Check if registration is open
	if !canEarlyRegister {
		if happening.RegistrationStart == nil {
			return &RegisterResult{
				Success: false,
				Message: "Påmelding er bare for inviterte undergrupper",
			}, nil
		}
		if happening.RegistrationStart.After(time.Now()) {
			return &RegisterResult{
				Success: false,
				Message: "Påmeldingen har ikke startet",
			}, nil
		}
	}

	// Check if registration is closed
	if happening.RegistrationEnd != nil && happening.RegistrationEnd.Before(time.Now()) {
		return &RegisterResult{
			Success: false,
			Message: "Påmeldingen har allerede stengt",
		}, nil
	}

	// 8. Get spot ranges and host groups
	spotRanges, err := hs.happeningRepo.GetHappeningSpotRanges(ctx, happeningID)
	if err != nil {
		return &RegisterResult{Success: false, Message: "Kunne ikke hente plasser"}, err
	}

	hostGroups, err := hs.happeningRepo.GetHappeningHostGroups(ctx, happeningID)
	if err != nil {
		hostGroups = []string{} // No host groups
	}

	// 9. Check if user can skip spot range (is hosting the event)
	canSkipSpotRange := false
	for _, hostGroup := range hostGroups {
		if slices.Contains(memberships, hostGroup) {
			canSkipSpotRange = true
		}
		if canSkipSpotRange {
			break
		}
	}

	// 10. Check if user is eligible (fits in spot range or can skip)
	userIsEligible := canSkipSpotRange
	if !userIsEligible {
		for _, sr := range spotRanges {
			if fitsInSpotrange(&user, &sr) {
				userIsEligible = true
				break
			}
		}
	}
	if !userIsEligible {
		return &RegisterResult{
			Success: false,
			Message: "Du kan ikke melde deg på dette arrangementet",
		}, nil
	}

	// 11. Validate questions
	if !validateQuestions(happeningQuestions, questions) {
		return &RegisterResult{
			Success: false,
			Message: "Du må svare på alle spørsmålene",
		}, nil
	}

	// 12. Create registration (with transaction logic)
	_, isWaitlisted, err := hs.registrationRepo.CreateRegistration(
		ctx,
		userID,
		happeningID,
		spotRanges,
		hostGroups,
		canSkipSpotRange,
	)
	if err != nil {
		return &RegisterResult{Success: false, Message: "Kunne ikke registrere deg"}, err
	}

	// 13. Insert answers
	if len(questions) > 0 {
		// We don't want to fail the registration if inserting answers fails
		// since the main registration is already done
		//
		// TODO: Remove ignoring error once we have a retry mechanism for failed inserts
		_ = hs.registrationRepo.InsertAnswers(ctx, userID, happeningID, questions)
	}

	message := "Du er nå påmeldt arrangementet"
	if isWaitlisted {
		message = "Du er nå på venteliste"
	}

	return &RegisterResult{
		Success:      true,
		Message:      message,
		IsWaitlisted: isWaitlisted,
	}, nil
}
