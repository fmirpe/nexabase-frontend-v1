export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at?: Date;
  metadata?: {
    avatar_url?: string;
    timezone?: string;
    language?: string;
    last_login_ip?: string;
    last_login_at?: Date;
    login_count?: number;
  };
  created_at: Date | string;
  updated_at: Date | string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  DEVELOPER = "developer",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  schema: CollectionSchema;
  metadata?: {
    description?: string;
    tags?: string[];
  };
  record_count?: number;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CollectionSchema {
  fields: Record<string, FieldSchema>;
  timestamps?: boolean;
}

export interface FieldSchema {
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  default?: any;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
  };
}

export enum FieldType {
  STRING = "string",
  TEXT = "text",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATE = "date",
  JSON = "json",
  EMAIL = "email",
  URL = "url",
  UUID = "uuid",
  ARRAY = "array",
  OBJECT = "object",
}

export interface DashboardStats {
  total_collections: number;
  total_users: number;
  total_api_requests: number;
  avg_response_time: number;
  active_connections?: number;
  storage_used?: number;
  api_calls_today?: number;
  errors_today?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  status?: string;
  role?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user_id?: string;
  user_name?: string;
  metadata?: Record<string, any>;
  created_at: Date | string;
}

export enum ActivityType {
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_REGISTERED = "user_registered",
  COLLECTION_CREATED = "collection_created",
  COLLECTION_UPDATED = "collection_updated",
  COLLECTION_DELETED = "collection_deleted",
  RECORD_CREATED = "record_created",
  RECORD_UPDATED = "record_updated",
  RECORD_DELETED = "record_deleted",
  API_KEY_GENERATED = "api_key_generated",
  API_KEY_REVOKED = "api_key_revoked",
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: ApiKeyPermission[];
  last_used_at?: Date | string;
  expires_at?: Date | string;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ApiKeyPermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface SystemSettings {
  id: string;
  app_name: string;
  app_url: string;
  default_user_role: UserRole;
  registration_enabled: boolean;
  email_verification_required: boolean;
  password_requirements: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
  };
  rate_limiting: {
    enabled: boolean;
    requests_per_minute: number;
    burst_limit: number;
  };
  backup: {
    enabled: boolean;
    frequency: string;
    retention_days: number;
  };
  updated_at: Date | string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: NotificationType[];
}

export enum NotificationType {
  USER_ACTIVITY = "user_activity",
  SYSTEM_ALERTS = "system_alerts",
  API_USAGE = "api_usage",
  SECURITY_EVENTS = "security_events",
  MAINTENANCE = "maintenance",
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  size: number;
  type: BackupType;
  status: BackupStatus;
  created_at: Date | string;
  completed_at?: Date | string;
  download_url?: string;
}

export enum BackupType {
  MANUAL = "manual",
  SCHEDULED = "scheduled",
  AUTOMATED = "automated",
}

export enum BackupStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  is_active: boolean;
  secret?: string;
  last_triggered_at?: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

export enum WebhookEvent {
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  COLLECTION_CREATED = "collection.created",
  COLLECTION_UPDATED = "collection.updated",
  COLLECTION_DELETED = "collection.deleted",
  RECORD_CREATED = "record.created",
  RECORD_UPDATED = "record.updated",
  RECORD_DELETED = "record.deleted",
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface MetricData {
  name: string;
  value: number | string;
  change?: number;
  changeType?: "increase" | "decrease";
  format?: "number" | "percentage" | "currency" | "duration";
}

// Vue Router types
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    title?: string;
    description?: string;
  }
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
