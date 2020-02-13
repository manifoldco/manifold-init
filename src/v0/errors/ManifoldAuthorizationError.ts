import { ManifoldError, ErrorType } from './ManifoldError';

export class ManifoldAuthorizationError extends ManifoldError {
  constructor(message?: string) {
    super({ type: ErrorType.AuthorizationError, message });
    Object.setPrototypeOf(this, ManifoldAuthorizationError.prototype);
  }
}
