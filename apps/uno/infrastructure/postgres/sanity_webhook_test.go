package postgres

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/routes/api"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type webhookRequest struct {
	Operation  string  `json:"operation"`
	DocumentID string  `json:"documentId"`
	PastSlug   *string `json:"pastSlug"`
	Data       any     `json:"data"`
}

type webhookData struct {
	ID                      string             `json:"_id"`
	Title                   string             `json:"title"`
	Slug                    string             `json:"slug"`
	Date                    string             `json:"date"`
	HappeningType           string             `json:"happeningType"`
	RegistrationStartGroups *string            `json:"registrationStartGroups,omitempty"`
	RegistrationGroups      []string           `json:"registrationGroups,omitempty"`
	RegistrationStart       *string            `json:"registrationStart,omitempty"`
	RegistrationEnd         *string            `json:"registrationEnd,omitempty"`
	Groups                  []string           `json:"groups,omitempty"`
	SpotRanges              []webhookSpotRange `json:"spotRanges,omitempty"`
	Questions               []webhookQuestion  `json:"questions,omitempty"`
}

type webhookSpotRange struct {
	Spots   int `json:"spots"`
	MinYear int `json:"minYear"`
	MaxYear int `json:"maxYear"`
}

type webhookQuestion struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Required    bool     `json:"required"`
	Type        string   `json:"type"`
	IsSensitive bool     `json:"isSensitive"`
	Options     []string `json:"options,omitempty"`
}

func setupWebhookTest(t *testing.T) (*Database, http.Handler) {
	db := SetupTestDB(t)
	t.Cleanup(func() { _ = db.Close() })

	logger := testutil.NewTestLogger()
	happeningRepo := NewHappeningRepo(db, logger)
	groupRepo := NewGroupRepo(db, logger)
	happeningService := service.NewHappeningService(happeningRepo, nil, nil, nil, groupRepo)

	mux := api.NewSanityMux(logger, happeningService, handler.NoMiddleware, nil)
	return db, mux
}

func doWebhookRequest(t *testing.T, h http.Handler, body any) *httptest.ResponseRecorder {
	t.Helper()
	jsonBody, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest("POST", "/webhook", bytes.NewReader(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	ctx := handler.NewContext(rr, req)
	h.ServeHTTP(ctx, req)
	return rr
}

func seedGroups(t *testing.T, db *Database, groupIDs ...string) {
	t.Helper()
	ctx := context.Background()
	for _, id := range groupIDs {
		_, err := db.ExecContext(ctx, `INSERT INTO "group" (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING`, id, id)
		require.NoError(t, err)
	}
}

func TestSanityWebhook_CreateHappening(t *testing.T) {
	db, mux := setupWebhookTest(t)
	ctx := context.Background()

	seedGroups(t, db, "webkom", "tilde")

	regStart := time.Now().Add(24 * time.Hour).Format(time.RFC3339)
	regEnd := time.Now().Add(48 * time.Hour).Format(time.RFC3339)

	data := webhookData{
		ID:                "test-happening-1",
		Title:             "Test Event",
		Slug:              "test-event",
		Date:              "2025-06-15T18:00:00Z",
		HappeningType:     "event",
		RegistrationStart: &regStart,
		RegistrationEnd:   &regEnd,
		Groups:            []string{"webkom", "tilde"},
		SpotRanges: []webhookSpotRange{
			{Spots: 30, MinYear: 1, MaxYear: 3},
			{Spots: 20, MinYear: 4, MaxYear: 5},
		},
		Questions: []webhookQuestion{
			{ID: "q1", Title: "Allergies?", Required: false, Type: "text", IsSensitive: true},
			{ID: "q2", Title: "Attending?", Required: true, Type: "checkbox", IsSensitive: false},
		},
	}

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "create",
		DocumentID: "test-happening-1",
		Data:       data,
	})

	assert.Equal(t, http.StatusOK, rr.Code)

	// Verify happening row
	var count int
	err := db.GetContext(ctx, &count, `SELECT COUNT(*) FROM happening WHERE id = $1`, "test-happening-1")
	require.NoError(t, err)
	assert.Equal(t, 1, count)

	// Verify title
	var title string
	err = db.GetContext(ctx, &title, `SELECT title FROM happening WHERE id = $1`, "test-happening-1")
	require.NoError(t, err)
	assert.Equal(t, "Test Event", title)

	// Verify groups
	var groupCount int
	err = db.GetContext(ctx, &groupCount, `SELECT COUNT(*) FROM happenings_to_groups WHERE happening_id = $1`, "test-happening-1")
	require.NoError(t, err)
	assert.Equal(t, 2, groupCount)

	// Verify spot ranges
	var srCount int
	err = db.GetContext(ctx, &srCount, `SELECT COUNT(*) FROM spot_range WHERE happening_id = $1`, "test-happening-1")
	require.NoError(t, err)
	assert.Equal(t, 2, srCount)

	// Verify questions
	var qCount int
	err = db.GetContext(ctx, &qCount, `SELECT COUNT(*) FROM question WHERE happening_id = $1`, "test-happening-1")
	require.NoError(t, err)
	assert.Equal(t, 2, qCount)
}

func TestSanityWebhook_UpdateHappening(t *testing.T) {
	db, mux := setupWebhookTest(t)
	ctx := context.Background()

	seedGroups(t, db, "webkom", "tilde", "bedkom")

	// Create first
	createData := webhookData{
		ID:            "test-happening-2",
		Title:         "Original Title",
		Slug:          "original-slug",
		Date:          "2025-06-15T18:00:00Z",
		HappeningType: "event",
		Groups:        []string{"webkom"},
		SpotRanges:    []webhookSpotRange{{Spots: 10, MinYear: 1, MaxYear: 5}},
		Questions: []webhookQuestion{
			{ID: "q1", Title: "Question 1", Required: true, Type: "text"},
			{ID: "q2", Title: "Question 2", Required: false, Type: "textarea"},
		},
	}

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "create",
		DocumentID: "test-happening-2",
		Data:       createData,
	})
	require.Equal(t, http.StatusOK, rr.Code)

	// Update
	updateData := webhookData{
		ID:            "test-happening-2",
		Title:         "Updated Title",
		Slug:          "updated-slug",
		Date:          "2025-07-01T18:00:00Z",
		HappeningType: "event",
		Groups:        []string{"bedkom", "tilde"},
		SpotRanges: []webhookSpotRange{
			{Spots: 50, MinYear: 1, MaxYear: 3},
		},
		Questions: []webhookQuestion{
			{ID: "q1", Title: "Updated Question 1", Required: false, Type: "text"},
			// q2 removed
			{ID: "q3", Title: "New Question", Required: true, Type: "radio", Options: []string{"A", "B"}},
		},
	}

	rr = doWebhookRequest(t, mux, webhookRequest{
		Operation:  "update",
		DocumentID: "test-happening-2",
		Data:       updateData,
	})
	assert.Equal(t, http.StatusOK, rr.Code)

	// Verify title updated
	var title string
	err := db.GetContext(ctx, &title, `SELECT title FROM happening WHERE id = $1`, "test-happening-2")
	require.NoError(t, err)
	assert.Equal(t, "Updated Title", title)

	// Verify groups replaced
	var groupIDs []string
	err = db.SelectContext(ctx, &groupIDs, `SELECT group_id FROM happenings_to_groups WHERE happening_id = $1 ORDER BY group_id`, "test-happening-2")
	require.NoError(t, err)
	assert.Equal(t, []string{"bedkom", "tilde"}, groupIDs)

	// Verify spot ranges replaced
	var srCount int
	err = db.GetContext(ctx, &srCount, `SELECT COUNT(*) FROM spot_range WHERE happening_id = $1`, "test-happening-2")
	require.NoError(t, err)
	assert.Equal(t, 1, srCount)

	var spots int
	err = db.GetContext(ctx, &spots, `SELECT spots FROM spot_range WHERE happening_id = $1`, "test-happening-2")
	require.NoError(t, err)
	assert.Equal(t, 50, spots)

	// Verify questions diffed correctly
	var qIDs []string
	err = db.SelectContext(ctx, &qIDs, `SELECT id FROM question WHERE happening_id = $1 ORDER BY id`, "test-happening-2")
	require.NoError(t, err)
	assert.Equal(t, []string{"q1", "q3"}, qIDs)

	// Verify q1 was updated
	var qTitle string
	err = db.GetContext(ctx, &qTitle, `SELECT title FROM question WHERE id = 'q1' AND happening_id = $1`, "test-happening-2")
	require.NoError(t, err)
	assert.Equal(t, "Updated Question 1", qTitle)
}

func TestSanityWebhook_DeleteHappening(t *testing.T) {
	db, mux := setupWebhookTest(t)
	ctx := context.Background()

	seedGroups(t, db, "webkom")

	// Create first
	createData := webhookData{
		ID:            "test-happening-3",
		Title:         "To Be Deleted",
		Slug:          "to-delete",
		Date:          "2025-06-15T18:00:00Z",
		HappeningType: "event",
		Groups:        []string{"webkom"},
		SpotRanges:    []webhookSpotRange{{Spots: 10, MinYear: 1, MaxYear: 5}},
		Questions:     []webhookQuestion{{ID: "q1", Title: "Q", Required: false, Type: "text"}},
	}

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "create",
		DocumentID: "test-happening-3",
		Data:       createData,
	})
	require.Equal(t, http.StatusOK, rr.Code)

	// Delete
	rr = doWebhookRequest(t, mux, webhookRequest{
		Operation:  "delete",
		DocumentID: "test-happening-3",
		Data:       nil,
	})
	assert.Equal(t, http.StatusOK, rr.Code)

	// Verify happening deleted
	var count int
	err := db.GetContext(ctx, &count, `SELECT COUNT(*) FROM happening WHERE id = $1`, "test-happening-3")
	require.NoError(t, err)
	assert.Equal(t, 0, count)

	// Verify cascade deletions
	err = db.GetContext(ctx, &count, `SELECT COUNT(*) FROM happenings_to_groups WHERE happening_id = $1`, "test-happening-3")
	require.NoError(t, err)
	assert.Equal(t, 0, count)

	err = db.GetContext(ctx, &count, `SELECT COUNT(*) FROM spot_range WHERE happening_id = $1`, "test-happening-3")
	require.NoError(t, err)
	assert.Equal(t, 0, count)

	err = db.GetContext(ctx, &count, `SELECT COUNT(*) FROM question WHERE happening_id = $1`, "test-happening-3")
	require.NoError(t, err)
	assert.Equal(t, 0, count)
}

func TestSanityWebhook_ExternalHappeningSkipped(t *testing.T) {
	db, mux := setupWebhookTest(t)
	ctx := context.Background()

	data := webhookData{
		ID:            "test-external",
		Title:         "External Event",
		Slug:          "external-event",
		Date:          "2025-06-15T18:00:00Z",
		HappeningType: "external",
	}

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "create",
		DocumentID: "test-external",
		Data:       data,
	})
	assert.Equal(t, http.StatusOK, rr.Code)

	// Verify no happening inserted
	var count int
	err := db.GetContext(ctx, &count, `SELECT COUNT(*) FROM happening WHERE id = $1`, "test-external")
	require.NoError(t, err)
	assert.Equal(t, 0, count)
}

func TestSanityWebhook_BoardGroupMapping(t *testing.T) {
	db, mux := setupWebhookTest(t)
	ctx := context.Background()

	seedGroups(t, db, "hovedstyret", "webkom")

	data := webhookData{
		ID:            "test-board",
		Title:         "Board Event",
		Slug:          "board-event",
		Date:          "2025-06-15T18:00:00Z",
		HappeningType: "event",
		Groups:        []string{"2023/2024", "webkom"},
	}

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "create",
		DocumentID: "test-board",
		Data:       data,
	})
	assert.Equal(t, http.StatusOK, rr.Code)

	// Verify board slug mapped to hovedstyret
	var groupIDs []string
	err := db.SelectContext(ctx, &groupIDs, `SELECT group_id FROM happenings_to_groups WHERE happening_id = $1 ORDER BY group_id`, "test-board")
	require.NoError(t, err)
	assert.Equal(t, []string{"hovedstyret", "webkom"}, groupIDs)
}

func TestSanityWebhook_InvalidOperation(t *testing.T) {
	_, mux := setupWebhookTest(t)

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "invalid",
		DocumentID: "test",
		Data:       nil,
	})
	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestSanityWebhook_NoDataOnUpdate(t *testing.T) {
	_, mux := setupWebhookTest(t)

	rr := doWebhookRequest(t, mux, webhookRequest{
		Operation:  "update",
		DocumentID: "test",
		Data:       nil,
	})
	assert.Equal(t, http.StatusBadRequest, rr.Code)
}
