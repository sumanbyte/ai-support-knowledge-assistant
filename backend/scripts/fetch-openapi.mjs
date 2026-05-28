import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const url =
  process.env.OPENAPI_URL ?? 'http://localhost:3000/api/docs-json';

const res = await fetch(url);
if (!res.ok) {
  console.error(
    `Failed to fetch OpenAPI from ${url} (${res.status}). Start the backend first: pnpm start:dev`,
  );
  process.exit(1);
}

const document = await res.json();
const outPath = join(__dirname, '..', 'openapi.json');
writeFileSync(outPath, JSON.stringify(document, null, 2));
console.log(`OpenAPI spec written to ${outPath}`);
