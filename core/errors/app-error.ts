export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function normalizeError(error: unknown, fallbackCode = 'unexpected_error'): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(fallbackCode, error.message, error);
  return new AppError(fallbackCode, 'An unexpected error occurred', error);
}
