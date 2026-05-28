# Shared API types (OpenAPI → TypeScript)

Backend **class-validator DTOs** are the source of truth. Swagger documents them; the frontend generates types from `backend/openapi.json`.

## Workflow

1. Change DTOs in `backend/src/modules/auth/dto/` (keep `@ApiProperty` in sync).
2. Start the backend (from `backend/`): `pnpm start:dev`
3. Refresh the OpenAPI spec (from `backend/`):
   ```bash
   pnpm openapi:generate
   ```
4. Regenerate frontend types (from `frontend/`):
   ```bash
   pnpm api:generate
   ```

5. Import types in the frontend:
   ```ts
   import type { LoginDto, AuthUserDto } from '../api';
   ```

## Files

| File | Role |
|------|------|
| `backend/src/modules/auth/dto/*.ts` | Source of truth (validation + Swagger) |
| `backend/openapi.json` | Committed OpenAPI snapshot |
| `frontend/src/api/schema.d.ts` | Generated — do not edit by hand |
| `frontend/src/api/index.ts` | Friendly type aliases |

## Swagger UI

With the backend running: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

OpenAPI JSON: [http://localhost:3000/api/docs-json](http://localhost:3000/api/docs-json)
