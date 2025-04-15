package happening

import (
	"net/http"

	"github.com/echo-webkom/axis/apputil"
)

func Home(h *apputil.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from Happening! 🚀"))
	}
}
