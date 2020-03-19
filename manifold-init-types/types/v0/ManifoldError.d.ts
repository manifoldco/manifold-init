export declare enum ErrorType {
    AuthorizationError = "MANIFOLD::AUTHORIZATION_ERROR",
    NetworkError = "MANIFOLD::NETWORK_ERROR",
    ServerError = "MANIFOLD::SERVER_ERROR",
    UnknownError = "MANIFOLD::UNKNOWN_ERROR"
}
interface ErrorOptions {
    message?: string;
    type?: ErrorType;
}
export declare class ManifoldError extends Error {
    type: ErrorType;
    get name(): "Manifold Error: Authorization Failed" | "Manifold Error: Network Call Failed" | "Manifold Error: Server Failed" | "Manifold Error: Unknown";
    constructor({ message, type }: ErrorOptions);
}
export {};
