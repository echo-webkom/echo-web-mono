package external

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"uno/domain/port"
)

type EmailClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewEmailClient(baseURL string) port.EmailClient {
	return &EmailClient{
		baseURL:    baseURL,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

func (c *EmailClient) post(ctx context.Context, path string, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("email client marshal: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/send/"+path, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("email client request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("email client send: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("email service returned %d", resp.StatusCode)
	}

	return nil
}

func (c *EmailClient) SendRegistrationConfirmation(ctx context.Context, to []string, subject, title string, isBedpres bool) error {
	return c.post(ctx, "registration-confirmation", map[string]any{
		"to":        to,
		"subject":   subject,
		"title":     title,
		"isBedpres": isBedpres,
	})
}

func (c *EmailClient) SendDeregistrationNotification(ctx context.Context, to []string, subject, name, reason, happeningTitle string) error {
	return c.post(ctx, "deregistration-notification", map[string]any{
		"to":             to,
		"subject":        subject,
		"name":           name,
		"reason":         reason,
		"happeningTitle": happeningTitle,
	})
}

func (c *EmailClient) SendGotSpotNotification(ctx context.Context, to []string, subject, name, happeningTitle string) error {
	return c.post(ctx, "got-spot-notification", map[string]any{
		"to":             to,
		"subject":        subject,
		"name":           name,
		"happeningTitle": happeningTitle,
	})
}

func (c *EmailClient) SendStrikeNotification(ctx context.Context, to []string, subject, name, reason string, amount int, isBanned bool) error {
	return c.post(ctx, "strike-notification", map[string]any{
		"to":       to,
		"subject":  subject,
		"name":     name,
		"reason":   reason,
		"amount":   amount,
		"isBanned": isBanned,
	})
}

func (c *EmailClient) SendAccessGranted(ctx context.Context, to []string, subject string) error {
	return c.post(ctx, "access-granted", map[string]any{
		"to":      to,
		"subject": subject,
	})
}

func (c *EmailClient) SendAccessDenied(ctx context.Context, to []string, subject, reason string) error {
	return c.post(ctx, "access-denied", map[string]any{
		"to":      to,
		"subject": subject,
		"reason":  reason,
	})
}

func (c *EmailClient) SendAccessRequestNotification(ctx context.Context, to []string, subject, email, reason string) error {
	return c.post(ctx, "access-request-notification", map[string]any{
		"to":      to,
		"subject": subject,
		"email":   email,
		"reason":  reason,
	})
}

func (c *EmailClient) SendEmailVerification(ctx context.Context, to []string, subject, verificationURL, firstName string) error {
	return c.post(ctx, "email-verification", map[string]any{
		"to":              to,
		"subject":         subject,
		"verificationUrl": verificationURL,
		"firstName":       firstName,
	})
}

func (c *EmailClient) SendMagicLink(ctx context.Context, to []string, subject, magicLinkURL, code, firstName string) error {
	return c.post(ctx, "magic-link", map[string]any{
		"to":           to,
		"subject":      subject,
		"magicLinkUrl": magicLinkURL,
		"code":         code,
		"firstName":    firstName,
	})
}
