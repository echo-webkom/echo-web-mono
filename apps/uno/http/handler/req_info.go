package handler

import "uno/domain/model"

// RequestInfo contains context specific information about the current request.
type RequestInfo struct {
	IsAdmin bool

	session *model.Session
}

func (r *RequestInfo) SetSession(session model.Session) {
	r.session = &session
}

func (r *RequestInfo) Session() (session model.Session, ok bool) {
	if r.session == nil {
		return model.Session{}, false
	}
	return *r.session, true
}
