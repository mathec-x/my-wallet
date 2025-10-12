import { ApplicationError } from '@/shared/ApplicationError/ApplicationError';

export type ResponseStatus = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 412 | 500;

export interface ServiceResponse<T = unknown> {
  status: ResponseStatus;
  message?: string;
  data?: T;
}

export class ResponseService {
  static Ok<T>(data: T, message = 'Success'): ServiceResponse<T> {
    return { status: 200, message, data };
  }

  static Created<T>(data: T, message = 'Created'): ServiceResponse<T> {
    return { status: 201, message, data };
  }

  static BadRequest(message = 'Bad Request', error?: Error) {
    throw new ApplicationError(message, 400, error);
  }

  static Unauthorized(message = 'Unauthorized') {
    throw new ApplicationError(message, 401);
  }

  static Forbidden(message = 'Forbidden') {
    throw new ApplicationError(message, 403);
  }

  static NotFound(message = 'Not Found') {
    throw new ApplicationError(message, 404);
  }

  static Conflict(message = 'Conflict') {
    throw new ApplicationError(message, 409);
  }

  static PreconditionFailed(message = 'Precondition Failed') {
    throw new ApplicationError(message, 412);
  }

  static InternalError(message = 'Internal Server Error', error?: Error) {
    throw new ApplicationError(message, 500, error);
  }
}
