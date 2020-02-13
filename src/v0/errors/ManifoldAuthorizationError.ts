export class ManifoldAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ManifoldAuthorizationError.prototype);
  }
}
