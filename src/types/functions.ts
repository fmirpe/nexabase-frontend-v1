export enum FunctionRuntime {
  NODEJS_20 = 'nodejs20',
  TYPESCRIPT = 'typescript',
}

export enum FunctionTrigger {
  HTTP = 'http',
  SCHEDULE = 'schedule',
  DATABASE = 'database',
  WEBHOOK = 'webhook',
  MANUAL = 'manual',
}

export enum FunctionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPLOYING = 'deploying',
  ERROR = 'error',
}

export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  TIMEOUT = 'timeout',
  MEMORY_LIMIT = 'memory_limit',
}

export interface EdgeFunction {
  id: string;
  name: string;
  description?: string;
  code: string;
  runtime: FunctionRuntime;
  trigger: FunctionTrigger;
  status: FunctionStatus;
  environment?: Record<string, string>;
  config?: {
    memoryLimit?: number;
    timeout?: number;
    schedule?: string;
    httpMethod?: string[];
    path?: string;
  };
  invocations: number;
  errors: number;
  avgExecutionTime?: number;
  lastExecutedAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FunctionExecution {
  id: string;
  functionId: string;
  status: ExecutionStatus;
  input?: any;
  output?: any;
  error?: string;
  logs: string;
  executionTime: number;
  memoryUsed?: number;
  createdAt: string;
}

export interface CreateFunctionDto {
  name: string;
  description?: string;
  code: string;
  runtime?: FunctionRuntime;
  trigger?: FunctionTrigger;
  environment?: Record<string, string>;
  config?: {
    memoryLimit?: number;
    timeout?: number;
    schedule?: string;
    httpMethod?: string[];
    path?: string;
  };
}
