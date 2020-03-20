import { ManifoldError, ErrorType } from './ManifoldError';
import { Analytics } from './analytics';
import { waitForAuthToken } from '../utils/auth';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Transforms an HTTP error to fit the GraphQL error format.
const transformError = (response: Response) => {
  const errors = [
    {
      message: response.statusText,
      extensions: { type: response.status.toString() },
    },
  ] as GraphqlError[];

  return {
    data: null,
    errors,
  };
};

const findAuthError = (errors: GraphqlError[] = []) =>
  errors.find(e => e.extensions && e.extensions.type === 'AuthFailed');

interface CreateGraphqlFetch {
  endpoint?: () => string;
  getAuthToken: () => string | undefined;
  clientId?: string;
  element: HTMLElement;
  version: string;
  retries?: number;
  analytics: Analytics;
}

type GraphqlRequest =
  | {
      mutation: string;
      variables?: { [key: string]: unknown };
    }
  | {
      query: string;
      variables?: { [key: string]: unknown };
    }; // require query or mutation, but not both

export interface GraphqlError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string;
  extensions?: {
    type?: string;
  };
}

export interface GraphqlResponseBody<GraphqlData> {
  data: GraphqlData | null;
  errors?: GraphqlError[];
}

export type GraphqlFetch = <T>(args: GraphqlRequest) => Promise<GraphqlResponseBody<T>>;

export function createGraphqlFetch({
  element,
  endpoint = () => 'https://api.manifold.co/graphql',
  getAuthToken,
  version,
  retries = 3,
  clientId,
  analytics,
}: CreateGraphqlFetch): GraphqlFetch {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Connection: 'keep-alive',
      'Content-type': 'application/json',
      'x-mui-component': `${element.tagName}@${version}`,
      'x-manifold-manifold-init-version': '<@NPM_PACKAGE_VERSION@>',
    },
  };

  const token = getAuthToken();

  if (clientId) {
    options.headers['Manifold-Client-ID'] = clientId;
  }

  if (token) {
    /* eslint-disable-next-line dot-notation */
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  async function graphqlFetch<T>(
    args: GraphqlRequest,
    attempts: number
  ): Promise<GraphqlResponseBody<T>> {
    const canRetry = attempts < retries;

    // Send Request
    let response: Response;
    try {
      options.body = JSON.stringify(args);
      response = await fetch(endpoint(), options);
    } catch (e) {
      // Retry
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return graphqlFetch(args, attempts + 1);
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
        return graphqlFetch(args, attempts + 1);
      }
      return Promise.reject(
        new ManifoldError({ type: ErrorType.ServerError, message: response.statusText })
      );
    }

    const body: GraphqlResponseBody<T> = await response.json();

    // Normalize HTTP errors to GraphQL errors.
    const unexpectedResponseBody = !body.data && !Array.isArray(body.errors);
    if (unexpectedResponseBody) {
      return transformError(response);
    }

    // Reauthenticate and retry on auth errors.
    const authError = findAuthError(body.errors);
    if (authError && canRetry) {
      try {
        await waitForAuthToken(getAuthToken, 15000, () => graphqlFetch(args, attempts + 1));
      } catch (e) {
        analytics.report({
          message: e.message,
          name: 'manifold-init-error',
        });
      }

      return Promise.reject(
        new ManifoldError({ type: ErrorType.AuthorizationError, message: authError.message })
      );
    }

    return body;
  }

  return function(args: GraphqlRequest) {
    return graphqlFetch(args, 0);
  };
}
