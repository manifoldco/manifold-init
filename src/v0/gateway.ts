import { ManifoldError, ErrorType } from './ManifoldError';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface Gateway {
  post: <Resp, Req extends {}>(path: string, body: Req, init?: RequestInit) => Promise<Resp>;
}

export function createGateway({
  baseUrl = () => 'https://api.manifold.co/graphql',
  retries = 3,
}): Gateway {
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
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return post(path, body, attempts + 1, init);
      }
    }

    if (resp.status === 401) {
      // TODO retry auth
      return Promise.reject(
        new ManifoldError({ type: ErrorType.AuthorizationError, message: resp.statusText })
      );
    }

    const internalServerError = resp.status === 500;
    if (internalServerError) {
      return Promise.reject(
        new ManifoldError({ type: ErrorType.ServerError, message: resp.statusText })
      );
    }

    // Retry on other server errors.
    const serverError = resp.status > 500;
    if (serverError) {
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return post(path, body, attempts + 1, init);
      }
      return Promise.reject(
        new ManifoldError({ type: ErrorType.ServerError, message: resp.statusText })
      );
    }

    return (await resp.json()) as Resp;
  }

  return { post: <Req>(path: string, body: Req, init?: RequestInit) => post(path, body, 0, init) };
}
