package happening

import (
	"github.com/echo-webkom/axis/apputil"
)

func Router(h *apputil.Handler) *apputil.Router {
	r := apputil.NewRouter()

	r.Get("/", listHappenings(h))

	return r
}
