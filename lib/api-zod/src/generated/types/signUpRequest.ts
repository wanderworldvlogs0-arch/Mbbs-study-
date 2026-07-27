/**
 * Provisional — regenerate with `pnpm --filter @workspace/api-spec run codegen`
 * once dependencies are installed. Matches openapi.yaml `SignUpRequest`.
 */

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  academicYear?: string;
}
