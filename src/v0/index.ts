import { createGraphqlFetch, GraphqlFetch } from './graphqlFetch';
import { createGateway, Gateway } from './gateway';

// TODO add real tracking
const track = data => {
  // eslint-disable-next-line no-console
  console.log(data);
};

export interface Connection {
  graphqlFetch: GraphqlFetch;
  gateway: Gateway;
  track: (event: string) => void;
}

const connection = (options: {
  env: 'stage' | 'prod';
  element: HTMLElement;
  componentVersion: string;
  clientId?: string;
}): Connection => {
  const { componentVersion, element, env, clientId } = options;

  return {
    gateway: createGateway({
      retries: 3,
      gatewayUrl: () =>
        env === 'stage' ? 'https://api.stage.manifold.co/v1' : 'https://api.manifold.co/v1',
    }),
    graphqlFetch: createGraphqlFetch({
      element,
      version: componentVersion,
      clientId,
      endpoint: () =>
        env === 'stage'
          ? 'https://api.stage.manifold.co/graphql'
          : 'https://api.manifold.co/graphql',
    }),
    track,
  };
};

export default connection;
