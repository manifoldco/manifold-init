import { ManifoldError, ErrorType } from './ManifoldError';

export class ManifoldServerError extends ManifoldError {
  constructor(message?: string) {
    super({ type: ErrorType.ServerError, message });
    Object.setPrototypeOf(this, ManifoldServerError.prototype);
  }
}
