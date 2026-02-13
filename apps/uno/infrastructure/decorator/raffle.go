package decorator

import (
	"context"
	"sync"
	"time"
	"uno/domain/model"
	"uno/domain/port"

	"github.com/jesperkha/notifier"
)

const (
	// How long the raffle period lasts at the start of a bedpres registration period
	RAFFLE_DURATION = time.Minute * 1
	// Maximum length of registration queue before blocking
	MAX_QUEUE = 200
)

// RaffleDecorator wraps port.RegistrationRepo and adds raffle
// registration for bedpres happenings in a given time window.
// Implements port.RegistrationRepo
type RaffleDecorator struct {
	repo  port.RegistrationRepo
	queue chan registration
	mu    *sync.Mutex
}

type registration struct {
	ctx              context.Context
	userID           string
	happeningID      string
	spotRanges       []model.SpotRange
	hostGroups       []string
	canSkipSpotRange bool
}

func NewRaffleDecorator(repo port.RegistrationRepo, notif *notifier.Notifier) port.RegistrationRepo {
	raffle := &RaffleDecorator{
		repo:  repo,
		queue: make(chan registration, MAX_QUEUE),
		mu:    &sync.Mutex{},
	}

	go raffle.start(notif)
	return raffle
}

// start the raffle backround job handling de-queueing registrations.
func (r *RaffleDecorator) start(notif *notifier.Notifier) {
	done, finish := notif.Register()

	<-done
	finish()
}

// CreateRegistration implements port.RegistrationRepo.
func (r *RaffleDecorator) CreateRegistration(
	ctx context.Context,
	userID string,
	happeningID string,
	spotRanges []model.SpotRange,
	hostGroups []string,
	canSkipSpotRange bool,
) (*model.Registration, bool, error) {
	return r.repo.CreateRegistration(ctx, userID, happeningID, spotRanges, hostGroups, canSkipSpotRange)
}

// GetByUserAndHappening implements port.RegistrationRepo.
func (r *RaffleDecorator) GetByUserAndHappening(ctx context.Context, userID string, happeningID string) (*model.Registration, error) {
	return r.repo.GetByUserAndHappening(ctx, userID, happeningID)
}

// InsertAnswers implements port.RegistrationRepo.
func (r *RaffleDecorator) InsertAnswers(ctx context.Context, userID string, happeningID string, questions []model.QuestionAnswer) error {
	return r.repo.InsertAnswers(ctx, userID, happeningID, questions)
}
