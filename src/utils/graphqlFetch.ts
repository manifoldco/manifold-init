interface CreateGraphqlFetch {
  endpoint?: () => string;
  element?: HTMLElement;
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

type GraphqlArgs = GraphqlRequest & { element: HTMLElement };

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

export type GraphqlFetch = <T>(args: GraphqlArgs) => Promise<GraphqlResponseBody<T>>;

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
      ...(element ? { 'x-manifold-component': `${element.tagName}@${version}` } : {}),
      'x-manifold-ui-core-version': '<@NPM_PACKAGE_VERSION@>',
    },
  };

  async function graphqlFetch<T>(args: GraphqlArgs): Promise<GraphqlResponseBody<T>> {
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

  return function(args: GraphqlArgs) {
    return graphqlFetch(args);
  };
}
