/**
 * Provisional — regenerate with `pnpm --filter @workspace/api-spec run codegen`
 * once dependencies are installed. Matches openapi.yaml `AuthUser`.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  academicYear?: string | null;
}
