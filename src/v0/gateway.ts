import { ManifoldError, ErrorType } from './ManifoldError';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface CreateGatewayFetch {
  gatewayUrl?: () => string;
  retries?: number;
}

export interface Gateway {
  post: <Body extends {}, Return>(path: string, body: Body) => Promise<Return>;
}

export function createGateway({
  retries = 3,
  gatewayUrl = () => 'https://api.manifold.co/v1',
}: CreateGatewayFetch): Gateway {
  async function post<Body extends {}, Return>(
    path: string,
    body: Body,
    attempts: number
  ): Promise<Return> {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Connection: 'keep-alive',
        'Content-type': 'application/json',
      },
    };
    const canRetry = attempts < retries;

    // Send Request
    let response: Response;
    try {
      response = await fetch(`${gatewayUrl()}${path}`, options);
    } catch (e) {
      // Retry
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return post(path, body, attempts + 1);
      }
      return Promise.reject(new ManifoldError({ type: ErrorType.NetworkError }));
    }

    // Immediately reject on internal server error.
    const internalServerError = response.status === 500;
    if (internalServerError) {
      return Promise.reject(
        new ManifoldError({ type: ErrorType.ServerError, message: response.statusText })
      );
    }

    // Retry on other server errors.
    const serverError = response.status > 500;
    if (serverError) {
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return post(path, body, attempts + 1);
      }
      return Promise.reject(
        new ManifoldError({ type: ErrorType.ServerError, message: response.statusText })
      );
    }

    // Reauthenticate and retry on auth errors.
    const authError = response.status === 401;
    if (authError && canRetry) {
      // TODO retry auth
      return Promise.reject(
        new ManifoldError({ type: ErrorType.AuthorizationError, message: response.statusText })
      );
    }

    const responseBody: Return = await response.json();
    return responseBody;
  }

  return {
    post<Body extends {}, Return>(path: string, body: Body) {
      return post<Body, Return>(path, body, 0);
    },
  };
}
