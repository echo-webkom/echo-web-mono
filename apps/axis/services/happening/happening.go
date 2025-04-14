package happening

import "net/http"

func Controlller() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from Happening! 🚀"))
	}
}
