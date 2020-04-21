export enum ErrorType {
  AuthorizationError = 'MANIFOLD::AUTHORIZATION_ERROR',
  NetworkError = 'MANIFOLD::NETWORK_ERROR',
  ClientError = 'MANIFOLD::CLIENT_ERROR',
  ServerError = 'MANIFOLD::SERVER_ERROR',
  UnknownError = 'MANIFOLD::UNKNOWN_ERROR',
}

interface ErrorOptions {
  message?: string;
  type?: ErrorType;
}
export class ManifoldError extends Error {
  type: ErrorType;

  get name() {
    switch (this.type) {
      case ErrorType.AuthorizationError:
        return 'Manifold Error: Authorization Failed';
      case ErrorType.NetworkError:
        return 'Manifold Error: Network Call Failed';
      case ErrorType.ServerError:
        return 'Manifold Error: Server Failed';
      case ErrorType.ClientError:
        return this.message;
      default:
        return 'Manifold Error: Unknown';
    }
  }

  constructor({ message, type = ErrorType.UnknownError }: ErrorOptions) {
    super(message);
    this.type = type;
    Object.setPrototypeOf(this, ManifoldError.prototype);
  }
}
