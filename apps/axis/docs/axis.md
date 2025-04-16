# Axis server documentation

## Project layout

- `/apps` - Service APIs
- `/apputil` - Service handler and other utils
- `/cmd` - Axis entrypoint
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

### Mounting

Mount the app handler in `/server/mount.go`.

