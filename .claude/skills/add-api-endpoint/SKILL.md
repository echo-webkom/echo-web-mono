---
name: add-api-endpoint
description: Use when the user asks to add, create, or implement a new API endpoint in apps/uno. Trigger phrases include "add endpoint", "new route", "add route", "create handler", "add API".
---

# Add API Endpoint

When adding a new endpoint to `apps/uno`, follow the patterns below and regenerate the Swagger docs at the end.

## Steps

1. **Add the handler** in the appropriate `apps/uno/http/routes/api/*.go` file (or create a new one following the existing pattern).

2. **Register the route** in the `New*Mux` constructor for that resource.

3. **Add swag annotations** above the handler function. Some fields can be omitted if not used. Example:

```go
// handlerName does something
// @Summary      Short description
// @Tags         resource-name
// @Param        id   path      string  true  "Resource ID"
// @Success      200  {object}  dto.MyResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce      json
// @Security     BearerAuth
// @Router       /resource/{id} [get]
func (r *resource) handlerName(ctx *handler.Context) error {
```

4. **Regenerate Swagger docs** after adding the annotations:

```bash
pnpm --filter=uno swag:init
```

or if you are inside the `uno` package:

```bash
swag:init
```

This runs:
```
swag init --dir ./ --generalInfo http/server.go --output ./docs --parseDependency --parseInternal
```

**IMPORTANT**: Always run `swag:init` after adding or modifying any endpoint. The generated `docs/docs.go` and `docs/swagger.yaml` must be committed alongside the handler changes.

## Middleware options

- `admin` — requires `X-Admin-Key` header
- `session` — requires a valid session token (Bearer auth)
- No middleware — public endpoint

Make sure to not leak any sensitive information in the endpoints. Ask the user if you are unsure about what security level to use.

## Design

This repository follows Domain Driven Design (DDD) principles. Each resource has its own package under `apps/uno/http/routes/api/`, and handlers are organized by resource. The handlers should be thin and delegate business logic to the corresponding service layer. Use DTOs to define request and response structures, and keep the handler focused on HTTP concerns.
