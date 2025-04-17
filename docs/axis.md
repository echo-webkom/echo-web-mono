# Axis server documentation

## Project layout

- `/api` - Server APIs
- `/apiutil` - API handler and other utils
- `/cmd` - Axis entrypoint
- `/config` - Axis and API configuration
- `/server` - Server router and mounting of apps
- `/service` - Internal data and API services
- `/storage`
  - `/database` - Database repo and models

## Creating an api

Create new file in `/axis/api` with the name of the api. For this example we create a new Hello api.

Only a `xxxRouter` function should be exported with the following signature:

```go
func HelloRouter(h *apputil.Handler) chi.Router {
    r := apituil.NewRouter()

    // Create single endpoint for GET request that responds with hello
    r.Get("/", helloWorldHandler(h))

    return r
}

func helloWorldHandler(h *apputil.Handler) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        h.JSON(w, http.StatusOK, "{'message': 'Hello world!'}")
    }
}
```

### Mounting

Mount the api router in `/server/mount.go`.

```go
func mount(rf *apiutil.RouterFactory) {
    ...

	rf.Mount("/hello", api.HelloRouter)
}
```

