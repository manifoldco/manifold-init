import { ManifoldError, ErrorType } from './ManifoldError';
import { RestError } from './RestError';

import { Analytics } from './analytics';
import { waitForAuthToken } from '../utils/auth';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Gateway {
  post: <Resp, Req extends {}>(path: string, body: Req, init?: RequestInit) => Promise<Resp>;
}

interface CreateGateway {
  baseUrl?: () => string;
  getAuthToken: () => string | undefined;
  clearAuthToken: () => void;
  retries?: number;
  waitTime?: number;
  analytics: Analytics;
}

export function createGateway({
  baseUrl = () => 'http://api.gateway.arigato.tools/v1',
  clearAuthToken,
  getAuthToken,
  analytics,
  waitTime = 15000,
  retries = 3,
}: CreateGateway): Gateway {
  async function post<Req extends {}, Resp>(
    path: string,
    body: Req,
    attempts: number,
    init?: RequestInit
  ) {
    const opts = init || {};
    const headers = opts.headers || {};
    const options: RequestInit = {
      ...opts,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...headers,
        Connection: 'keep-alive',
        'Content-type': 'application/json',
      },
    };

    const canRetry = attempts < retries;
    let resp: Response;

    try {
      resp = await fetch(`${baseUrl()}${path}`, options);
    } catch (e) {
      // TODO: Let's figure out if we can safely swallow this.
      if (e.name === 'AbortError') {
        throw e;
      }

      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return post(path, body, attempts + 1, init);
      }

      throw new ManifoldError({ type: ErrorType.NetworkError });
    }

    if (resp.status === 401) {
      if (!canRetry) {
        throw new ManifoldError({
          type: ErrorType.AuthorizationError,
          message: resp.statusText,
        });
      }

      try {
        clearAuthToken();
        return waitForAuthToken(getAuthToken, waitTime, () => post(path, body, attempts + 1, init));
      } catch (e) {
        analytics.report({
          message: e.message,
          name: 'manifold-init-error',
        });

        throw new ManifoldError({ type: ErrorType.AuthorizationError, message: resp.statusText });
      }
    }

    const internalServerError = resp.status === 500;
    if (internalServerError) {
      throw new ManifoldError({ type: ErrorType.ServerError, message: resp.statusText });
    }

    // Retry on other server errors.
    const serverError = resp.status > 500;
    if (serverError) {
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return post(path, body, attempts + 1, init);
      }

      throw new ManifoldError({ type: ErrorType.ServerError, message: resp.statusText });
    }

    if (resp.status < 200 || resp.status > 299) {
      throw new RestError(resp.status, resp.statusText);
    }

    return (await resp.json()) as Resp;
  }

  return { post: <Req>(path: string, body: Req, init?: RequestInit) => post(path, body, 0, init) };
}
