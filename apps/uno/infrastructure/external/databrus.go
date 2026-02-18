package external

import (
	"context"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
	"uno/domain/model"
	"uno/domain/port"

	"github.com/PuerkitoBio/goquery"
	"github.com/gocolly/colly/v2"
)

var (
	timestampRe = regexp.MustCompile(`timestamp:\s*(\d+)`)
	homeGoalsRe = regexp.MustCompile(`homegoals:\s*'(\d+)'`)
	awayGoalsRe = regexp.MustCompile(`awaygoals:\s*'(\d+)'`)
)

type DatabrusRepo struct {
	logger port.Logger
}

func NewDatabrusRepo(logger port.Logger) port.DatabrusRepo {
	return &DatabrusRepo{
		logger: logger,
	}
}

func (dr *DatabrusRepo) GetDatabrusMatches(ctx context.Context, url string, matchType model.MatchType) ([]model.Match, error) {
	var matches []model.Match
	var scrapeErr error

	c := colly.NewCollector()

	c.OnHTML("li[wire\\:key^='listkamp_']", func(e *colly.HTMLElement) {
		wireKey := e.Attr("wire:key")
		matchID := strings.TrimPrefix(wireKey, "listkamp_")
		if matchID == "" {
			return
		}

		xData := e.DOM.Find("[x-data]").First().AttrOr("x-data", "")

		// Extract teams from .truncate divs, filtering out location info
		var teams []string
		e.DOM.Find(".truncate").Each(func(_ int, s *goquery.Selection) {
			text := strings.TrimSpace(s.Text())
			if text != "" && !strings.Contains(text, "sportsenter") && !strings.Contains(text, "–") {
				teams = append(teams, text)
			}
		})

		if len(teams) < 2 {
			return
		}

		homeTeam := teams[0]
		awayTeam := teams[1]

		// Extract timestamp from x-data
		tsMatch := timestampRe.FindStringSubmatch(xData)
		if len(tsMatch) < 2 {
			return
		}

		timestamp, err := strconv.ParseInt(tsMatch[1], 10, 64)
		if err != nil {
			return
		}

		datetime := time.Unix(timestamp, 0).UTC().Format(time.RFC3339)

		match := model.Match{
			Type:     matchType,
			ID:       matchID,
			HomeTeam: homeTeam,
			AwayTeam: awayTeam,
			DateTime: datetime,
		}

		if matchType == model.Previous {
			homeScore := "0"
			if m := homeGoalsRe.FindStringSubmatch(xData); len(m) >= 2 {
				homeScore = m[1]
			}
			awayScore := "0"
			if m := awayGoalsRe.FindStringSubmatch(xData); len(m) >= 2 {
				awayScore = m[1]
			}
			match.HomeScore = &homeScore
			match.AwayScore = &awayScore
		}

		matches = append(matches, match)
	})

	c.OnError(func(r *colly.Response, err error) {
		scrapeErr = fmt.Errorf("failed to scrape matches: %w", err)
	})

	if err := c.Visit(url); err != nil {
		dr.logger.Error(ctx, "error visiting databrus matches page", "url", url, "error", err)
		return nil, fmt.Errorf("failed to visit %s: %w", url, err)
	}

	if scrapeErr != nil {
		dr.logger.Error(ctx, "error scraping databrus matches", "url", url, "error", scrapeErr)
		return nil, scrapeErr
	}

	return matches, nil
}

func (dr *DatabrusRepo) GetDatabrusTable(ctx context.Context, url string) (model.Table, error) {
	var table model.Table
	var scrapeErr error

	c := colly.NewCollector()

	c.OnHTML("table.text-sm tbody tr", func(e *colly.HTMLElement) {
		cells := e.DOM.Find("td")
		if cells.Length() < 9 {
			return
		}

		position, err := strconv.Atoi(strings.TrimSpace(cells.Eq(0).Text()))
		if err != nil {
			return
		}

		team := strings.TrimSpace(cells.Eq(1).Text())
		if team == "" {
			return
		}

		matchesPlayed, _ := strconv.Atoi(strings.TrimSpace(cells.Eq(2).Text()))
		wins, _ := strconv.Atoi(strings.TrimSpace(cells.Eq(3).Text()))
		draws, _ := strconv.Atoi(strings.TrimSpace(cells.Eq(4).Text()))
		losses, _ := strconv.Atoi(strings.TrimSpace(cells.Eq(5).Text()))

		goalsText := strings.TrimSpace(cells.Eq(6).Text())
		goalsParts := strings.Split(goalsText, "-")
		var goalsFor, goalsAgainst int
		if len(goalsParts) >= 2 {
			goalsFor, _ = strconv.Atoi(strings.TrimSpace(goalsParts[0]))
			goalsAgainst, _ = strconv.Atoi(strings.TrimSpace(goalsParts[1]))
		}

		goalDifference, _ := strconv.Atoi(strings.TrimSpace(cells.Eq(7).Text()))
		points, _ := strconv.Atoi(strings.TrimSpace(cells.Eq(8).Text()))

		table = append(table, model.TableRow{
			Position:       position,
			Team:           team,
			MatchesPlayed:  matchesPlayed,
			Wins:           wins,
			Draws:          draws,
			Losses:         losses,
			GoalsFor:       goalsFor,
			GoalsAgainst:   goalsAgainst,
			GoalDifference: goalDifference,
			Points:         points,
		})
	})

	c.OnError(func(r *colly.Response, err error) {
		scrapeErr = fmt.Errorf("failed to scrape table: %w", err)
	})

	if err := c.Visit(url); err != nil {
		dr.logger.Error(ctx, "error visiting databrus table page", "url", url, "error", err)
		return nil, fmt.Errorf("failed to visit %s: %w", url, err)
	}

	if scrapeErr != nil {
		dr.logger.Error(ctx, "error scraping databrus table", "url", url, "error", scrapeErr)
		return nil, scrapeErr
	}

	return table, nil
}
