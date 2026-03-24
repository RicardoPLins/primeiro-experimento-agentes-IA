import { AppError } from '@gerenciador-provas/shared';

/**
 * Classe base para erros da aplicação
 * INV-BKD-10: Erros tipados com code e status HTTP
 */
export class ApplicationError extends Error implements AppError {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

/**
 * Erro para recurso não encontrado
 */
export class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string, details?: Record<string, unknown>) {
    super(
      'NOT_FOUND',
      `${resource} com ID ${id} não encontrado`,
      404,
      details
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Erro de integridade referencial
 */
export class ReferentialIntegrityError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('REFERENTIAL_INTEGRITY_ERROR', message, 409, details);
    this.name = 'ReferentialIntegrityError';
  }
}

/**
 * Erro de duplicate key (índice único violado)
 */
export class DuplicateKeyError extends ApplicationError {
  constructor(field: string, value: string) {
    super(
      'DUPLICATE_KEY',
      `${field} '${value}' já existe`,
      409,
      { field, value }
    );
    this.name = 'DuplicateKeyError';
  }
}

/**
 * Erro interno do servidor
 */
export class InternalServerError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('INTERNAL_SERVER_ERROR', message, 500, details);
    this.name = 'InternalServerError';
  }
}
