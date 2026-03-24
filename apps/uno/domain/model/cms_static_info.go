package model

import "encoding/json"

type CMSStaticInfo struct {
	Title    string          `json:"title"`
	Slug     string          `json:"slug"`
	PageType *string         `json:"pageType"`
	Body     json.RawMessage `json:"body"`
}
