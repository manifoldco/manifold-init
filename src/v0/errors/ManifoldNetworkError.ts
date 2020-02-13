import { ManifoldError, ErrorType } from './ManifoldError';

export class ManifoldNetworkError extends ManifoldError {
  constructor(message?: string) {
    super({ type: ErrorType.NetworkError, message });
    Object.setPrototypeOf(this, ManifoldNetworkError.prototype);
  }
}
