# Shared API types (OpenAPI → TypeScript)

## Two layers

| Layer | Source | Used for |
|-------|--------|----------|
| **Database** | `prisma/schema.prisma` | Prisma Client, migrations |
| **HTTP API** | Generated DTOs in `generated/api-dtos/` | Swagger + frontend types |

Prisma models are **not** imported into Swagger DTOs by hand. They flow through:

```
schema.prisma
  → prisma generate (client + JSON Schema)
  → scripts/generate-api-dtos.mjs (Nest classes + @ApiProperty)
  → Swagger /api/docs-json
  → frontend pnpm api:generate
```

Auth DTOs (`LoginDto`, `AuthUserDto`, …) remain hand-written in `src/modules/auth/dto/` because they are not 1:1 with Prisma models.

## Workflow after changing `schema.prisma`

1. Edit `prisma/schema.prisma` (and `prisma/api-expose.json` if you add models or exclude fields).
2. From `backend/`:
   ```bash
   pnpm prisma:generate
   ```
3. Start the backend: `pnpm start:dev`
4. Refresh OpenAPI:
   ```bash
   pnpm openapi:generate
   ```
5. From `frontend/`:
   ```bash
   pnpm api:generate
   ```

## Config: which models become API DTOs

`backend/prisma/api-expose.json`:

```json
{
  "models": {
    "Document": {
      "excludeFields": ["user"],
      "responses": {
        "DocumentResponseDto": {
          "properties": {
            "documents": { "type": "array", "items": "Document" }
          }
        }
      }
    }
  }
}
```

- **excludeFields** — relation objects not exposed on the API (e.g. `user`).
- **responses** — wrapper DTOs like `{ documents: DocumentDto[] }`.

## Files

| File | Role |
|------|------|
| `prisma/schema.prisma` | DB source of truth |
| `prisma/api-expose.json` | Which models/fields appear in the API |
| `generated/json-schema/json-schema.json` | Intermediate (gitignored) |
| `generated/api-dtos/*.ts` | Generated Nest Swagger DTOs (commit these) |
| `backend/openapi.json` | Committed OpenAPI snapshot |
| `frontend/src/api/schema.d.ts` | Generated frontend types |

## Swagger UI

[http://localhost:3000/api/docs](http://localhost:3000/api/docs) — OpenAPI JSON: [http://localhost:3000/api/docs-json](http://localhost:3000/api/docs-json)
