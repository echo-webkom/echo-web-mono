package model

type CMSStaticInfo struct {
	Title    string  `json:"title"`
	Slug     string  `json:"slug"`
	PageType *string `json:"pageType"`
	Body     *string `json:"body"`
}
