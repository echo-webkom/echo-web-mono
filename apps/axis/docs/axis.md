# Axis server documentation

## Project layout

- `/apps` - Service APIs
- `/apputil` - Service handler and other utils
- `/cmd` - Axis entrypoint
- `/config` - Axis and API configuration
- `/server` - Server router and mounting of apps
- `/service` - Internal data and API services
- `/storage`
  - `/database` - Database repo and models

## Creating an app

### Structure

Apps consist of two main files:

- `router.go` - App router (chi) which mounts the handlers
- `handler.go` - App endpoint handlers

Only the Router function should be exported:

```go
func Router(h *apputil.Handler) chi.Router {
    r := chi.NewRouter()

    // Mount handlers

    return r
}
```

Handlers have the following signature:

```go
func helloWorldHandler(h *apputil.Handler) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {

        h.JSON(w, http.StatusOK, "{'message': 'Hello world!'}")
    }
}
```

### Mounting

Mount the app handler in `/server/mount.go`.

