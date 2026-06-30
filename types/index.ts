// ─────────────────────────────────────────────
// Shared API response shapes
// ─────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ─────────────────────────────────────────────
// Query filters
// ─────────────────────────────────────────────

export interface BlogQueryFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  /** If true, admin can see unpublished blogs */
  all?: boolean;
}

// ─────────────────────────────────────────────
// JWT
// ─────────────────────────────────────────────

export interface JWTAdminPayload {
  adminId: string;
  email: string;
}
