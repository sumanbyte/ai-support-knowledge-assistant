// AUTO-GENERATED from prisma/schema.prisma — do not edit by hand.
// Regenerate: pnpm prisma:generate

export const DocumentIcon = {
  PICTURE_AS_PDF: 'PICTURE_AS_PDF',
  DESCRIPTION: 'DESCRIPTION',
  MARKDOWN: 'MARKDOWN',
  CODE: 'CODE',
  SLIDESHOW: 'SLIDESHOW',
  YAML: 'YAML',
} as const;

export type DocumentIcon = (typeof DocumentIcon)[keyof typeof DocumentIcon];
