import { ManifoldError, ErrorType } from './ManifoldError';

export class RestError extends ManifoldError {
  code: number;

  constructor(code: number, message: string) {
    super({ message, type: ErrorType.ClientError });
    this.code = code;
    Object.setPrototypeOf(this, ManifoldError.prototype);
  }
}
