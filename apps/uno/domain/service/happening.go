package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/rule"
)

type HappeningService struct {
	happeningRepo    port.HappeningRepo
	userRepo         port.UserRepo
	registrationRepo port.RegistrationRepo
	banInfoRepo      port.BanInfoRepo
	groupRepo        port.GroupRepo
}

func NewHappeningService(
	happeningRepo port.HappeningRepo,
	userRepo port.UserRepo,
	registrationRepo port.RegistrationRepo,
	banInfoRepo port.BanInfoRepo,
	groupRepo port.GroupRepo,
) *HappeningService {
	return &HappeningService{
		happeningRepo:    happeningRepo,
		userRepo:         userRepo,
		registrationRepo: registrationRepo,
		banInfoRepo:      banInfoRepo,
		groupRepo:        groupRepo,
	}
}

func (hs *HappeningService) GetUserRegistrations(ctx context.Context, userID string) ([]model.RegistrationWithHappening, error) {
	return hs.registrationRepo.GetByUserID(ctx, userID)
}

func (hs *HappeningService) GetAllHappenings(ctx context.Context) ([]model.Happening, error) {
	return hs.happeningRepo.GetAllHappenings(ctx)
}

func (hs *HappeningService) GetHappeningByID(ctx context.Context, id string) (model.Happening, error) {
	return hs.happeningRepo.GetHappeningById(ctx, id)
}

func (hs *HappeningService) GetHappeningRegistrationCounts(ctx context.Context, ids []string) ([]model.RegistrationCount, error) {
	return hs.happeningRepo.GetHappeningRegistrationCounts(ctx, ids)
}

func (hs *HappeningService) GetHappeningRegistrations(ctx context.Context, happeningID string) ([]model.HappeningRegistration, error) {
	return hs.happeningRepo.GetHappeningRegistrations(ctx, happeningID)
}

func (hs *HappeningService) GetRegistrationByUserAndHappening(ctx context.Context, userID string, happeningID string) (*model.Registration, error) {
	return hs.registrationRepo.GetByUserAndHappening(ctx, userID, happeningID)
}

func (hs *HappeningService) GetFullHappeningBySlug(ctx context.Context, slug string) (model.FullHappening, error) {
	return hs.happeningRepo.GetFullHappeningBySlug(ctx, slug)
}

func (hs *HappeningService) GetUsersByIDs(ctx context.Context, ids []string) ([]model.User, error) {
	return hs.userRepo.GetUsersByIDs(ctx, ids)
}

func (hs *HappeningService) GetHappeningSpotRanges(ctx context.Context, happeningID string) ([]model.SpotRange, error) {
	return hs.happeningRepo.GetHappeningSpotRanges(ctx, happeningID)
}

func (hs *HappeningService) GetHappeningQuestions(ctx context.Context, happeningID string) ([]model.Question, error) {
	return hs.happeningRepo.GetHappeningQuestions(ctx, happeningID)
}

func (hs *HappeningService) UpdateRegistrationStatus(
	ctx context.Context,
	userID string,
	happeningID string,
	status model.RegistrationStatus,
	prevStatus *string,
	changedBy *string,
	changedAt *time.Time,
	unregisterReason *string,
) error {
	return hs.registrationRepo.UpdateRegistrationStatus(ctx, userID, happeningID, status, prevStatus, changedBy, changedAt, unregisterReason)
}

func (hs *HappeningService) DeleteAnswersByUserAndHappening(ctx context.Context, userID string, happeningID string) error {
	return hs.registrationRepo.DeleteAnswersByUserAndHappening(ctx, userID, happeningID)
}

func (hs *HappeningService) DeleteRegistrationsByHappeningID(ctx context.Context, happeningID string) error {
	return hs.registrationRepo.DeleteRegistrationsByHappeningID(ctx, happeningID)
}

func (hs *HappeningService) DeleteHappening(ctx context.Context, id string) error {
	return hs.happeningRepo.DeleteHappening(ctx, id)
}

// RegisterResult represents the outcome of a registration attempt.
// This is a domain model for internal use in the service layer.
type RegisterResult struct {
	Success      bool
	Message      string
	IsWaitlisted bool
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
			if rule.FitsInSpotRange(&user, &sr) {
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
	if !rule.ValidateQuestionsAgainstAnswers(happeningQuestions, questions) {
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
		rule.IsAvailableSpot,
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

func (hs *HappeningService) GetRegisterCount(ctx context.Context, happeningID string) (model.RegistrationCount, error) {
	// Fetch the happening from the repository
	hap, err := hs.happeningRepo.GetHappeningById(ctx, happeningID)
	if err != nil {
		return model.RegistrationCount{}, errors.New("could not fetch happening")
	}

	// Fetch spot ranges
	spotRanges, err := hs.happeningRepo.GetHappeningSpotRanges(ctx, hap.ID)
	if err != nil {
		return model.RegistrationCount{}, errors.New("could not fetch spot ranges")
	}

	// Fetch registrations
	// TODO: Aggregate directly in SQL query
	regs, err := hs.happeningRepo.GetHappeningRegistrations(ctx, hap.ID)
	if err != nil {
		return model.RegistrationCount{}, errors.New("could not fetch registrations")
	}

	// Aggregate registration counts
	// - Max spots from spot ranges
	// - Count of registered and waiting registrations
	grp := model.RegistrationCount{}
	if len(spotRanges) > 0 {
		count := 0
		for _, spot := range spotRanges {
			count += spot.Spots
		}
		grp.Max = &count
	}

	for _, reg := range regs {
		switch reg.Status {
		case "waiting":
			grp.Waiting++
		case "registered":
			grp.Registered++
		}
	}

	return grp, nil
}

// SanityHappeningData represents the data sent from a Sanity webhook for a happening.
type SanityHappeningData struct {
	ID                      string
	Title                   string
	Slug                    string
	Date                    string
	HappeningType           string
	RegistrationStartGroups *string
	RegistrationGroups      []string
	RegistrationStart       *string
	RegistrationEnd         *string
	Groups                  []string
	SpotRanges              []SanitySpotRange
	Questions               []SanityQuestion
}

type SanitySpotRange struct {
	Spots   int
	MinYear int
	MaxYear int
}

type SanityQuestion struct {
	ID          string
	Title       string
	Required    bool
	Type        string
	IsSensitive bool
	Options     []string
}

// SyncHappening syncs a happening from Sanity to the database (create or update).
func (hs *HappeningService) SyncHappening(ctx context.Context, data SanityHappeningData) error {
	happening, err := mapSanityHappening(data)
	if err != nil {
		return fmt.Errorf("failed to map happening: %w", err)
	}

	if err = hs.happeningRepo.UpsertHappening(ctx, happening); err != nil {
		return fmt.Errorf("failed to upsert happening: %w", err)
	}

	groupIDs, err := hs.mapValidGroups(ctx, data.Groups)
	if err != nil {
		return fmt.Errorf("failed to map groups: %w", err)
	}

	if err := hs.happeningRepo.ReplaceHappeningGroups(ctx, happening.ID, groupIDs); err != nil {
		return fmt.Errorf("failed to replace groups: %w", err)
	}

	spotRanges := make([]model.SpotRange, len(data.SpotRanges))
	for i, sr := range data.SpotRanges {
		spotRanges[i] = model.SpotRange{
			HappeningID: happening.ID,
			Spots:       sr.Spots,
			MinYear:     sr.MinYear,
			MaxYear:     sr.MaxYear,
		}
	}

	if err := hs.happeningRepo.ReplaceSpotRanges(ctx, happening.ID, spotRanges); err != nil {
		return fmt.Errorf("failed to replace spot ranges: %w", err)
	}

	questions := make([]model.Question, len(data.Questions))
	for i, q := range data.Questions {
		var options *json.RawMessage
		if len(q.Options) > 0 {
			mapped := make([]map[string]string, len(q.Options))
			for j, o := range q.Options {
				mapped[j] = map[string]string{"id": o, "value": o}
			}
			raw, _ := json.Marshal(mapped)
			rawMsg := json.RawMessage(raw)
			options = &rawMsg
		}

		questions[i] = model.Question{
			ID:          q.ID,
			HappeningID: happening.ID,
			Title:       q.Title,
			Required:    q.Required,
			Type:        q.Type,
			IsSensitive: q.IsSensitive,
			Options:     options,
		}
	}

	if err := hs.happeningRepo.SyncQuestions(ctx, happening.ID, questions); err != nil {
		return fmt.Errorf("failed to sync questions: %w", err)
	}

	return nil
}

func mapSanityHappening(data SanityHappeningData) (model.Happening, error) {
	loc, err := time.LoadLocation("Europe/Oslo")
	if err != nil {
		return model.Happening{}, fmt.Errorf("failed to load timezone: %w", err)
	}

	date, err := time.Parse(time.RFC3339, data.Date)
	if err != nil {
		date, err = time.ParseInLocation("2006-01-02", data.Date, loc)
		if err != nil {
			return model.Happening{}, fmt.Errorf("failed to parse date %q: %w", data.Date, err)
		}
	} else {
		date = date.In(loc)
	}

	regGroups := make([]string, 0, len(data.RegistrationGroups))
	for _, g := range data.RegistrationGroups {
		if model.IsBoardID(g) {
			regGroups = append(regGroups, "hovedstyre")
		} else {
			regGroups = append(regGroups, g)
		}
	}

	var registrationGroups *json.RawMessage
	if len(regGroups) > 0 {
		raw, _ := json.Marshal(regGroups)
		rawMsg := json.RawMessage(raw)
		registrationGroups = &rawMsg
	}

	happening := model.Happening{
		ID:                 data.ID,
		Slug:               data.Slug,
		Title:              data.Title,
		Type:               model.HappeningType(data.HappeningType),
		Date:               &date,
		RegistrationGroups: registrationGroups,
	}

	if data.RegistrationStartGroups != nil {
		t, err := time.Parse(time.RFC3339, *data.RegistrationStartGroups)
		if err == nil {
			t = t.In(loc)
			happening.RegistrationStartGroups = &t
		}
	}

	if data.RegistrationStart != nil {
		t, err := time.Parse(time.RFC3339, *data.RegistrationStart)
		if err == nil {
			t = t.In(loc)
			happening.RegistrationStart = &t
		}
	}

	if data.RegistrationEnd != nil {
		t, err := time.Parse(time.RFC3339, *data.RegistrationEnd)
		if err == nil {
			t = t.In(loc)
			happening.RegistrationEnd = &t
		}
	}

	return happening, nil
}

// mapValidGroups takes a list of group IDs and returns a filtered list containing
// only valid group IDs that exist in the system.
func (hs *HappeningService) mapValidGroups(ctx context.Context, groups []string) ([]string, error) {
	validGroups, err := hs.groupRepo.GetAllGroups(ctx)
	if err != nil {
		return nil, err
	}

	validGroupIDs := make(map[string]bool)
	for _, g := range validGroups {
		validGroupIDs[g.ID] = true
	}

	seen := make(map[string]bool)
	var result []string
	for _, g := range groups {
		mapped := g
		if model.IsBoardID(g) {
			mapped = "hovedstyret"
		}

		if validGroupIDs[mapped] && !seen[mapped] {
			result = append(result, mapped)
			seen[mapped] = true
		}
	}

	return result, nil
}
