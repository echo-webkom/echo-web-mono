package api

import (
	"log"
	"net/http"

	_ "uno/docs"

	httpSwagger "github.com/swaggo/http-swagger"
)

func SwaggerRouter(port string) http.Handler {
	log.Printf("swagger ui running at http://localhost%s/swagger/index.html\n", port)
	return httpSwagger.WrapHandler
}
