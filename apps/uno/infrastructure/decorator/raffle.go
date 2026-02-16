package decorator

import (
	"context"
	"sync"
	"time"
	"uno/domain/model"
	"uno/domain/port"

	"github.com/jesperkha/notifier"
)

// TODO: raffle test: create a registration and poll its state for 15 seconds for a 10 second window
// TODO: add ID field to all Registration models (dto, model)
// TODO: make regRepo.BatchUpdateStatus() and insert the pending regs immediately as pending and batch update later
// TODO: make /happenings/{id}/registrations/{id}/status endpoint

const (
	// Maximum length of registration queue before blocking
	MAX_QUEUE = 200

	// How long the raffle period lasts at the start of a bedpres registration period
	RAFFLE_DURATION = 10 * time.Second
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
	queue chan registration
}

type registration struct {
	regId int
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

	// This lock is also held by r.flushAndDeleteQueue, ensuring that the queue
	// is flushed before any new registrations have the chance to go through.
	r.mu.Lock()
	defer r.mu.Unlock()

	// SAFETY: asserted not nil
	windowClose := (*happening.RegistrationStart).Add(RAFFLE_DURATION)

	// If raffle window is closed, register normally without enqueuing.
	if time.Now().After(windowClose) {
		return r.repo.CreateRegistration(ctx, userID, happening, spotRanges, hostGroups, canSkipSpotRange)
	}

	eq, ok := r.queues[happening.ID]
	if !ok {
		eq = &eventQueue{
			queue: make(chan registration, MAX_QUEUE),
		}

		go func() {
			<-time.After(time.Until(windowClose))
			_ = r.flushAndDeleteQueue(happening.ID)
		}()

		r.queues[happening.ID] = eq
	}

	eq.queue <- registration{
		regId: 0, // TODO: add regid
	}

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

func (r *RaffleDecorator) flushAndDeleteQueue(happeningId string) error {
	// Lock any new incomming registrations for this
	// happening from trying to enqueue or register.
	r.mu.Lock()
	defer r.mu.Unlock()

	_, ok := r.queues[happeningId]

	// No queue to flush
	if !ok {
		return nil
	}

	// TODO: randomize and flush queue.

	delete(r.queues, happeningId) // SAFETY: locked
	return nil
}

// GetByUserAndHappening implements port.RegistrationRepo.
func (r *RaffleDecorator) GetByUserAndHappening(ctx context.Context, userID string, happeningID string) (*model.Registration, error) {
	return r.repo.GetByUserAndHappening(ctx, userID, happeningID)
}

// InsertAnswers implements port.RegistrationRepo.
func (r *RaffleDecorator) InsertAnswers(ctx context.Context, userID string, happeningID string, questions []model.QuestionAnswer) error {
	return r.repo.InsertAnswers(ctx, userID, happeningID, questions)
}
