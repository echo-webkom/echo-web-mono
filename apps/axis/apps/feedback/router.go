package feedback

import (
	"github.com/echo-webkom/axis/apputil"
)

func Router(h *apputil.Handler) *apputil.Router {
	r := apputil.NewRouter()

	r.Post("/", createFeedback(h))

	return r
}
