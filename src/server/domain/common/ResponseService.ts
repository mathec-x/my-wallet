// src/server/domain/common/ResponseService.ts
export type ResponseStatus = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 412 | 500;

export interface ServiceResponse<T = unknown> {
  ok: boolean;
  status: ResponseStatus;
  message?: string;
  data?: T;
  error?: Error;
}

export class ResponseService {
  static Ok<T>(data: T, message = 'Success'): ServiceResponse<T> {
    return { ok: true, status: 200, message, data };
  }

  static Created<T>(data: T, message = 'Created'): ServiceResponse<T> {
    return { ok: true, status: 201, message, data };
  }

  static BadRequest(message = 'Bad Request', error?: Error): ServiceResponse {
    return { ok: false, status: 400, message, error };
  }

  static Unauthorized(message = 'Unauthorized'): ServiceResponse {
    return { ok: false, status: 401, message };
  }

  static Forbidden(message = 'Forbidden'): ServiceResponse {
    return { ok: false, status: 403, message };
  }

  static NotFound(message = 'Not Found'): ServiceResponse {
    return { ok: false, status: 404, message };
  }

  static Conflict(message = 'Conflict'): ServiceResponse {
    return { ok: false, status: 409, message };
  }

  static PreconditionFailed(message = 'Precondition Failed'): ServiceResponse {
    return { ok: false, status: 412, message };
  }

  static InternalError(message = 'Internal Server Error', error?: Error): ServiceResponse {
    return { ok: false, status: 500, message, error };
  }
}
