export class ManifoldNetworkError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ManifoldNetworkError.prototype);
  }
}
