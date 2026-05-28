/**
 * Generates NestJS Swagger DTO classes from Prisma JSON Schema.
 * Run after: pnpm exec prisma generate
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const schemaPath = join(root, 'generated/json-schema/json-schema.json');
const exposePath = join(root, 'prisma/api-expose.json');
const outDir = join(root, 'generated/api-dtos');

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const expose = JSON.parse(readFileSync(exposePath, 'utf8'));
const { definitions } = schema;

const GENERATED_HEADER = `// AUTO-GENERATED from prisma/schema.prisma — do not edit by hand.
// Regenerate: pnpm prisma:generate
`;

function toEnumName(modelName, fieldName) {
  return `${modelName}${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
}

function resolveTsType(prop, enums) {
  if (prop.enum) {
    return { ts: 'string', enumValues: prop.enum, isEnum: true };
  }
  const types = Array.isArray(prop.type) ? prop.type.filter((t) => t !== 'null') : [prop.type];
  const primary = types[0];
  if (primary === 'integer') return { ts: 'number' };
  if (primary === 'boolean') return { ts: 'boolean' };
  if (prop.format === 'date-time') return { ts: 'string', format: 'date-time' };
  return { ts: 'string' };
}

function isNullable(prop) {
  if (Array.isArray(prop.type) && prop.type.includes('null')) return true;
  return false;
}

function collectEnums(modelName, modelSchema) {
  const enums = [];
  for (const [fieldName, prop] of Object.entries(modelSchema.properties ?? {})) {
    if (prop.enum) {
      enums.push({
        name: toEnumName(modelName, fieldName),
        fieldName,
        values: prop.enum,
      });
    }
  }
  return enums;
}

function writeEnumFile(enumDef) {
  const constEntries = enumDef.values
    .map((v) => `  ${v}: '${v}',`)
    .join('\n');
  const content = `${GENERATED_HEADER}
export const ${enumDef.name} = {
${constEntries}
} as const;

export type ${enumDef.name} = (typeof ${enumDef.name})[keyof typeof ${enumDef.name}];
`;
  writeFileSync(join(outDir, `${kebab(enumDef.name)}.enum.ts`), content);
}

function kebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function writeModelDto(modelName, modelSchema, excludeFields) {
  const enums = collectEnums(modelName, modelSchema);
  for (const e of enums) writeEnumFile(e);

  const enumByField = Object.fromEntries(enums.map((e) => [e.fieldName, e.name]));
  const enumImports = enums.map(
    (e) => `import { ${e.name} } from './${kebab(e.name)}.enum';`,
  );

  const lines = [];
  for (const [fieldName, prop] of Object.entries(modelSchema.properties ?? {})) {
    if (excludeFields.includes(fieldName)) continue;

    const { ts, format, enumValues, isEnum } = resolveTsType(prop, enums);
    const nullable = isNullable(prop);
    const optional = nullable || !modelSchema.required?.includes(fieldName);
    const tsType = isEnum ? enumByField[fieldName] : ts;
    const propType = optional && nullable ? `${tsType} | null` : tsType;

    const apiParts = [];
    if (isEnum) apiParts.push(`enum: Object.values(${enumByField[fieldName]})`);
    else if (enumValues) apiParts.push(`enum: ${JSON.stringify(enumValues)}`);
    if (format) apiParts.push(`format: '${format}'`);
    if (prop.default !== undefined) apiParts.push(`default: ${JSON.stringify(prop.default)}`);
    if (optional && !nullable) apiParts.push(`required: false`);

    const apiOpts = apiParts.length ? `{ ${apiParts.join(', ')} }` : '';
    lines.push(`  @ApiProperty(${apiOpts})`);
    lines.push(`  ${fieldName}${optional ? '?' : ''}: ${propType};`);
    lines.push('');
  }

  const content = `${GENERATED_HEADER}
import { ApiProperty } from '@nestjs/swagger';
${enumImports.join('\n')}

export class ${modelName}Dto {
${lines.join('\n')}
}
`;
  writeFileSync(join(outDir, `${kebab(modelName)}.dto.ts`), content);
  return `${modelName}Dto`;
}

function writeResponseDto(responseName, config, modelDtoName) {
  const content = `${GENERATED_HEADER}
import { ApiProperty } from '@nestjs/swagger';
import { ${modelDtoName} } from './${kebab(modelDtoName.replace('Dto', ''))}.dto';

export class ${responseName} {
  @ApiProperty({ type: [${modelDtoName}] })
  documents: ${modelDtoName}[];
}
`;
  const fileBase = kebab(responseName.replace(/Dto$/i, ''));
  writeFileSync(join(outDir, `${fileBase}.dto.ts`), content);
  return fileBase + '.dto';
}

function writeIndex(exports) {
  const content = `${GENERATED_HEADER}
${exports.map((e) => `export * from './${e}';`).join('\n')}
`;
  writeFileSync(join(outDir, 'index.ts'), content);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const indexExports = [];

for (const [modelName, modelConfig] of Object.entries(expose.models ?? {})) {
  const def = definitions[modelName];
  if (!def) {
    console.warn(`No JSON schema definition for model: ${modelName}`);
    continue;
  }

  const excludeFields = modelConfig.excludeFields ?? [];
  const dtoName = writeModelDto(modelName, def, excludeFields);
  indexExports.push(kebab(modelName) + '.dto');
  for (const e of collectEnums(modelName, def)) {
    indexExports.push(kebab(e.name) + '.enum');
  }

  for (const [responseName, _responseConfig] of Object.entries(
    modelConfig.responses ?? {},
  )) {
    const exportFile = writeResponseDto(responseName, _responseConfig, dtoName);
    indexExports.push(exportFile);
  }
}

writeIndex([...new Set(indexExports)]);
console.log(`API DTOs written to ${outDir}`);
