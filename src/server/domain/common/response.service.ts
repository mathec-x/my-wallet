import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError
} from '@/server/infra/prisma/generated/runtime/library';

export type ResponseStatus = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 412 | 500;

export type ServiceResponse<T = unknown> = {
  success: true;
  status: ResponseStatus;
  message: string;
  data: T;
} | {
  success: false;
  status: ResponseStatus;
  message: string;
  error?: Error | unknown;
};

export class ResponseService {
  static Ok<T>(data: T, message = 'Success'): ServiceResponse<T> {
    return { success: true, message, status: 200, data };
  }

  static Created<T>(data: T, message = 'Created'): ServiceResponse<T> {
    return { success: true, message, status: 201, data };
  }

  static BadRequest<T = never>(message = 'Bad Request', error?: Error | unknown): ServiceResponse<T> {
    return { success: false, message, status: 400, error };
  }

  static Unauthorized<T = never>(message = 'Unauthorized'): ServiceResponse<T> {
    return { success: false, message, status: 401 };
  }

  static Forbidden<T = never>(message = 'Forbidden'): ServiceResponse<T> {
    return { success: false, message, status: 403 };
  }

  static NotFound<T = never>(message = 'Not Found'): ServiceResponse<T> {
    return { success: false, message, status: 404 };
  }

  static Conflict<T = never>(message = 'Conflict'): ServiceResponse<T> {
    return { success: false, message, status: 409 };
  }

  static PreconditionFailed<T = never>(message = 'Precondition Failed'): ServiceResponse<T> {
    return { success: false, message, status: 412 };
  }

  static InternalError<T = never>(message = 'Internal Server Error', error?: Error | unknown): ServiceResponse<T> {
    return { success: false, message, status: 500, error };
  }

  static unknow<T = never>(error?: unknown): ServiceResponse<T> {
    console.log('unknow error', (error as Error)?.name, (error as Error)?.message);

    if (error instanceof Error) {
      // console.error('Error', error);
      return { success: false, message: error.message, status: 400, error };
    }

    if (error instanceof PrismaClientUnknownRequestError) {
      // console.log(`PrismaClientUnknownRequestError ${error.message}`, error.name);
      return { success: false, message: 'PrismaClientUnknownRequestError', status: 400, error };
    }

    if (error instanceof PrismaClientKnownRequestError) {
      // console.log(`PrismaClientKnownRequestError ${error.message}`, error.code, error.meta);
      return { success: false, message: 'PrismaClientKnownRequestError', status: 400, error };
    }

    if (error instanceof PrismaClientValidationError) {
      // console.log(`PrismaClientValidationError ${error.message}`, error.name);
      return { success: false, message: 'PrismaClientValidationError', status: 400, error };
    }

    return { success: false, message: 'unknown', status: 400, error };
  }
}