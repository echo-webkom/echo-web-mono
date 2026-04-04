// Package rule defines domain rules that are reusable across services.
//   - rule should hold pure domain rules (decision logic) that can be reusable across services.
//   - Services then orchestrate I/O and workflows and call rule for decisions.
//   - Good rule traits: deterministic, no DB/network calls, small API, easy to unit test.
package rule
