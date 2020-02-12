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

const authFailed = errors =>
  errors.some(e => {
    return e.extensions && e.extensions.type === 'AuthFailed';
  });

interface CreateGraphqlFetch {
  endpoint?: () => string;
  element: HTMLElement;
  version: string;
  retries?: number;
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
  version,
  retries = 3,
}: CreateGraphqlFetch): GraphqlFetch {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Connection: 'keep-alive',
      'Content-type': 'application/json',
      ...(element ? { 'x-mui-component': `${element.tagName}@${version}` } : {}),
      'x-manifold-mui-core-version': '<@NPM_PACKAGE_VERSION@>',
    },
  };

  async function graphqlFetch<T>(
    args: GraphqlRequest,
    attempts: number
  ): Promise<GraphqlResponseBody<T>> {
    const canRetry = attempts < retries;

    // Send Request
    let response;
    try {
      options.body = JSON.stringify(args);
      response = await fetch(endpoint(), options);
    } catch (e) {
      // Retry
      if (canRetry) {
        await wait(attempts ** 2 * 1000);
        return graphqlFetch(args, attempts + 1);
      }
      return Promise.reject(e);
    }

    // Retry on server errors other unless internal.
    const internalServerError = response.status > 500;
    if (internalServerError && canRetry) {
      await wait(attempts ** 2 * 1000);
      return graphqlFetch(args, attempts + 1);
    }

    const body: GraphqlResponseBody<T> = await response.json();

    // Normalize HTTP errors to GraphQL errors.
    const unexpectedResponseBody = !body.data && !Array.isArray(body.errors);
    if (unexpectedResponseBody) {
      return transformError(response);
    }

    // Reauthenticate and retry on auth errors.
    if (body.errors && authFailed(body.errors) && canRetry) {
      // TODO retry auth
    }

    return body;
  }

  return function(args: GraphqlRequest) {
    return graphqlFetch(args, 0);
  };
}
