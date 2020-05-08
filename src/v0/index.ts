import createAnalytics, { AnalyticsEvent, ErrorDetail } from './analytics';
import { createGraphqlFetch, GraphqlFetch } from './graphqlFetch';
import { createGateway, Gateway } from './gateway';

export interface Connection {
  graphqlFetch: GraphqlFetch;
  gateway: Gateway;
  getOwnerId: () => string | undefined;
  analytics: {
    track: (e: AnalyticsEvent) => Promise<Response>;
    report: (detail: ErrorDetail) => void;
  };
}

const connection = (options: {
  env: 'stage' | 'prod' | 'local';
  element: HTMLElement;
  componentVersion: string;
  clientId?: string;
  preview?: boolean;
  getAuthToken: () => string | undefined;
  clearAuthToken: () => void;
  getOwnerId: () => string | undefined;
}): Connection => {
  const {
    componentVersion,
    element,
    env,
    clientId,
    getAuthToken,
    clearAuthToken,
    preview,
    getOwnerId,
  } = options;

  const analytics = createAnalytics({ env, element, componentVersion, clientId });

  analytics.track({
    description: 'Track component load event',
    name: 'component-load',
    type: 'component-analytics',
    properties: {},
  });

  return {
    getOwnerId,
    gateway: createGateway({
      getAuthToken,
      clearAuthToken,
      analytics,
      baseUrl: () => {
        switch (env) {
          case 'stage':
            return 'https://api.stage.manifold.co/v1';
          case 'local':
            return 'http://api.gateway.arigato.tools/v1';
          default:
            return 'https://api.manifold.co/v1';
        }
      },
    }),
    graphqlFetch: createGraphqlFetch({
      element,
      version: componentVersion,
      getAuthToken,
      clearAuthToken,
      clientId,
      analytics,
      preview,
      endpoint: () => {
        switch (env) {
          case 'stage':
            return 'https://api.stage.manifold.co/graphql';
          case 'local':
            return 'http://graphql.arigato.tools/graphql';
          default:
            return 'https://api.manifold.co/graphql';
        }
      },
    }),
    analytics,
  };
};

export default connection;
