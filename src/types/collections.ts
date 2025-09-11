// src/types/collections.ts
export interface ApiPageMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }
  
  export interface CollectionDto {
    id: string; // uuid
    name: string;
    schema: Record<string, unknown>;
    auth_rules: Record<string, unknown> | null;
    is_active: boolean;
    record_count: number;
    created_at: string; // ISO
    updated_at: string; // ISO
    metadata: Record<string, unknown> | null;
  }
  
  export interface PagedResponse<T> {
    data: T[];
    meta: ApiPageMeta;
  }
  