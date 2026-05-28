/**
 * API types generated from backend OpenAPI (class-validator DTOs).
 * Regenerate after DTO changes (from each package directory):
 *   backend:  pnpm openapi:generate   (backend must be running)
 *   frontend: pnpm api:generate
 */
export type { components, paths, operations } from './schema';

import type { components } from './schema';

export type LoginDto = components['schemas']['LoginDto'];
export type SignupDto = components['schemas']['SignupDto'];
export type AuthUserDto = components['schemas']['AuthUserDto'];
export type LoginResponseDto = components['schemas']['LoginResponseDto'];
export type RefreshResponseDto = components['schemas']['RefreshResponseDto'];
export type DocumentResponseDto = components['schemas']['DocumentResponseDto'];
export type DocumentDto = components['schemas']['DocumentDto'];
export type DocumentStatus = components['schemas']['DocumentStatus'];
export type DocumentIcon = components['schemas']['DocumentIcon'];
