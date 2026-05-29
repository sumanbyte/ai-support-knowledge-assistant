#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "→ Fetch OpenAPI from running backend (restart backend after new controllers/modules)"
(cd "$ROOT/backend" && pnpm openapi:generate)

echo "→ Generate frontend schema.d.ts"
(cd "$ROOT/frontend" && pnpm api:generate)

echo "→ Regenerate Prisma + API DTOs"
(cd "$ROOT/backend" && pnpm prisma:generate)

echo "Done. If analytics types are missing, ensure AnalyticsModule is in AppModule and backend was restarted."
