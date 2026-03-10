---
name: uno-repo-pattern
description: Use when adding a new repository, port interface, service, or data access layer to apps/uno. Trigger phrases include "add repo", "new repository", "add service", "new port", "add infrastructure", or when implementing a new domain concept in uno.
---

# uno Repository Pattern

`apps/uno` follows Domain Driven Design with a hexagonal architecture: **port -> record -> postgres -> service -> handler -> DTO**.

## Layer overview

```
domain/port/          Interface definition (what the repo can do)
domain/model/         Pure domain types (no DB tags, no JSON tags)
domain/service/       Business logic, uses port interfaces
infrastructure/postgres/record/   DB row structs with `db:""` tags + ToDomain/FromDomain
infrastructure/postgres/          Concrete repo implementation using sqlx
http/dto/             Request/response structs with `json:""` tags
http/routes/api/      HTTP handlers, thin — delegate to services
```

## Step-by-step: adding a new repo

### 1. Define the port (`domain/port/<name>.go`)

```go
package port

import (
    "context"
    "uno/domain/model"
)

type ThingRepo interface {
    GetByID(ctx context.Context, id string) (*model.Thing, error)
    Create(ctx context.Context, thing model.Thing) error
}
```

### 2. Add the domain model (`domain/model/<name>.go`)

```go
package model

type Thing struct {
    ID   string
    Name string
}
```

No DB tags, no JSON tags — pure Go.

### 3. Add the DB record (`infrastructure/postgres/record/<name>.go`)

```go
package record

import "uno/domain/model"

type ThingDB struct {
    ID   string `db:"id"`
    Name string `db:"name"`
}

func (db *ThingDB) ToDomain() *model.Thing {
    return &model.Thing{ID: db.ID, Name: db.Name}
}

func ThingToDomainList(dbThings []ThingDB) []model.Thing {
    things := make([]model.Thing, len(dbThings))
    for i, t := range dbThings {
        things[i] = *t.ToDomain()
    }
    return things
}
```

### 4. Implement the postgres repo (`infrastructure/postgres/<name>.go`)

Repos should have minimal logic — just SQL queries and mapping to/from records. Any complex logic should go in the service layer.

They should also start with a logger and log any errors with context for easier debugging.

```go
package postgres

import (
    "context"
    "database/sql"
    "uno/domain/model"
    "uno/domain/port"
    "uno/infrastructure/postgres/record"
)

type ThingRepo struct {
    db     *Database
    logger port.Logger
}

func NewThingRepo(db *Database, logger port.Logger) port.ThingRepo {
    return &ThingRepo{db: db, logger: logger}
}

func (r *ThingRepo) GetByID(ctx context.Context, id string) (*model.Thing, error) {
		r.logger.Info(ctx, "getting thing by ID", "id", id)
    var t record.ThingDB
    err := r.db.GetContext(ctx, &t, `SELECT id, name FROM thing WHERE id = $1`, id)
    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        r.logger.Error(ctx, "failed to get thing", "error", err, "id", id)
        return nil, err
    }
    return t.ToDomain(), nil
}
```

### 5. Regenerate mocks

After defining the port interface, run:

```bash
cd apps/uno && pnpm mocks:generate
```

### 6. Wire up in bootstrap (`bootstrap/api.go`)

```go
thingRepo := postgres.NewThingRepo(db, logger)
// pass to service or RunServer as needed
```

### 7. Add the DTO (`http/dto/<name>.go`)

```go
package dto

type ThingResponse struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}
```

### 8. Add the handler (`http/routes/api/<name>.go`)

Keep handlers thin — no business logic, just HTTP concerns:

```go
func (h *things) getByID(ctx *handler.Context) error {
    id := ctx.PathValue("id")
    thing, err := h.thingRepo.GetByID(ctx.Context(), id)
    if err != nil {
        return ctx.InternalServerError()
    }
    if thing == nil {
        return ctx.NotFound(errors.New("not found"))
    }
    return ctx.JSON(dto.ThingResponse{ID: thing.ID, Name: thing.Name})
}
```

Then run `pnpm swag:init` to regenerate Swagger docs.
