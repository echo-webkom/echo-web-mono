package model

import (
	"errors"
	"strings"
)

type Email struct {
	value string
}

var ErrInvalidEmail = errors.New("invalid email format")

func NewEmail(value string) (Email, error) {
	if value == "" || !containsAtSymbol(value) {
		return Email{}, ErrInvalidEmail
	}
	return Email{value: value}, nil
}

func (e *Email) String() string {
	return e.value
}

func (e *Email) StringPtr() *string {
	if e == nil {
		return nil
	}
	return &e.value
}

func containsAtSymbol(s string) bool {
	if len(s) < 3 {
		return false
	}
	return strings.Contains(s, "@")
}
