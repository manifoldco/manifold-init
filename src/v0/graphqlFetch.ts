interface CreateGraphqlFetch {
  endpoint?: () => string;
  element: HTMLElement;
  version: string;
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
}: CreateGraphqlFetch): GraphqlFetch {
  const options = {
    method: 'POST',
    headers: {
      Connection: 'keep-alive',
      'Content-type': 'application/json',
      ...(element ? { 'x-mui-component': `${element.tagName}@${version}` } : {}),
      'x-manifold-mui-core-version': '<@NPM_PACKAGE_VERSION@>',
    },
  };

  async function graphqlFetch<T>(args: GraphqlRequest): Promise<GraphqlResponseBody<T>> {
    const response = await fetch(endpoint(), {
      ...options,
      body: JSON.stringify(args),
    }).catch((e: Response) => {
      return Promise.reject(e);
    });
    const body: GraphqlResponseBody<T> = await response.json();

    // handle non-GQL responses from errors
    if (!body.data && !Array.isArray(body.errors)) {
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
    }

    // return everything to the user
    return body;
  }

  return function(args: GraphqlRequest) {
    return graphqlFetch(args);
  };
}
