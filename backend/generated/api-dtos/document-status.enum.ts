// AUTO-GENERATED from prisma/schema.prisma — do not edit by hand.
// Regenerate: pnpm prisma:generate

export const DocumentStatus = {
  PROCESSING: 'PROCESSING',
  INDEXED: 'INDEXED',
  ERROR: 'ERROR',
} as const;

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];
