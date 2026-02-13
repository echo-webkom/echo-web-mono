package decorator

import (
	"context"
	"errors"
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
	repo   port.RegistrationRepo
	mu     *sync.Mutex
	queues map[string]*eventQueue
}

type eventQueue struct {
	windowClose time.Time
	queue       chan registration
}

type registration struct {
	ctx              context.Context
	userID           string
	happening        model.Happening
	spotRanges       []model.SpotRange
	hostGroups       []string
	canSkipSpotRange bool
}

func newRegistration(
	ctx context.Context,
	userID string,
	happening model.Happening,
	spotRanges []model.SpotRange,
	hostGroups []string,
	canSkipSpotRange bool,
) registration {
	return registration{ctx, userID, happening, spotRanges, hostGroups, canSkipSpotRange}
}

func NewRaffleDecorator(repo port.RegistrationRepo, notif *notifier.Notifier) port.RegistrationRepo {
	return &RaffleDecorator{
		repo:   repo,
		queues: map[string]*eventQueue{},
		mu:     &sync.Mutex{},
	}
}

// CreateRegistration implements port.RegistrationRepo.
func (r *RaffleDecorator) CreateRegistration(
	ctx context.Context,
	userID string,
	happening model.Happening,
	spotRanges []model.SpotRange,
	hostGroups []string,
	canSkipSpotRange bool,
) (*model.Registration, bool, error) {
	shouldEnqueue := happening.IsBedpres() && happening.RegistrationStart != nil

	if !shouldEnqueue {
		return r.repo.CreateRegistration(ctx, userID, happening, spotRanges, hostGroups, canSkipSpotRange)
	}

	// This lock is also held by r.flushQueue, ensuring that the queue
	// is flushed before any new registrations have the chance to go through.
	r.mu.Lock()

	// SAFETY: asserted not nil
	windowClose := (*happening.RegistrationStart).Add(RAFFLE_DURATION)

	// If raffle window is still open, get or create event queue and append the registrations
	if time.Now().Before(windowClose) {
		eq, ok := r.queues[happening.ID]
		if !ok {
			eq = &eventQueue{
				windowClose: windowClose,
				queue:       make(chan registration, MAX_QUEUE),
			}
			r.queues[happening.ID] = eq
		}
		r.mu.Unlock()

		eq.queue <- newRegistration(ctx, userID, happening, spotRanges, hostGroups, canSkipSpotRange)
		return &model.Registration{
			UserID:           userID,
			HappeningID:      happening.ID,
			Status:           model.RegistrationStatusPending,
			UnregisterReason: nil,
			CreatedAt:        time.Now(),
			PrevStatus:       nil,
			ChangedAt:        nil,
			ChangedBy:        nil,
		}, false, nil
	}

	// Otherwise the window has closed and we need to empty the queue before registering
	r.mu.Unlock()
	err1 := r.flushQueue(happening.ID)
	reg, waitlisted, err2 := r.repo.CreateRegistration(ctx, userID, happening, spotRanges, hostGroups, canSkipSpotRange)

	return reg, waitlisted, errors.Join(err1, err2)
}

func (r *RaffleDecorator) flushQueue(happeningId string) error {
	// Lock any new incomming registrations for this
	// happening from trying to enqueue or register.
	r.mu.Lock()
	defer r.mu.Unlock()

	eq, ok := r.queues[happeningId]

	// No queue to flush
	if !ok {
		return nil
	}

	var errs error
	for {
		select {
		case reg := <-eq.queue:
			_, _, err := r.repo.CreateRegistration(reg.ctx, reg.userID, reg.happening, reg.spotRanges, reg.hostGroups, reg.canSkipSpotRange)
			errs = errors.Join(errs, err)
		default:
			delete(r.queues, happeningId) // SAFETY: locked
			return errs
		}
	}
}

// GetByUserAndHappening implements port.RegistrationRepo.
func (r *RaffleDecorator) GetByUserAndHappening(ctx context.Context, userID string, happeningID string) (*model.Registration, error) {
	return r.repo.GetByUserAndHappening(ctx, userID, happeningID)
}

// InsertAnswers implements port.RegistrationRepo.
func (r *RaffleDecorator) InsertAnswers(ctx context.Context, userID string, happeningID string, questions []model.QuestionAnswer) error {
	return r.repo.InsertAnswers(ctx, userID, happeningID, questions)
}
