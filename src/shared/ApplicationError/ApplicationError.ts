export class ApplicationError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = 400,
    public readonly cause?: unknown
  ) {
    super(message);
    this.stack = undefined;
  }

  static handleError(error: unknown): string {
    if (error instanceof ApplicationError) {
      return error.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'um erro inesperado ocorreu. Tente novamente mais tarde.';
    }
  }
}
