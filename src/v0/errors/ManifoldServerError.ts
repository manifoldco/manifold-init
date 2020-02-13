export class ManifoldServerError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ManifoldServerError.prototype);
  }
}
