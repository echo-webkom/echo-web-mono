package feedback

import (
	"regexp"
)

var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`)

func isEmail(email string) bool {
	return emailRegex.MatchString(email)
}
