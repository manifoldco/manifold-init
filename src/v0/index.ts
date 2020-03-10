import { createGraphqlFetch, GraphqlFetch } from './graphqlFetch';

// TODO add real tracking
const track = data => {
  // eslint-disable-next-line no-console
  console.log(data);
};

export interface Connection {
  graphqlFetch: GraphqlFetch;
  track: (event: string) => void;
}

const connection = (options: {
  env: 'stage' | 'prod';
  element: HTMLElement;
  componentVersion: string;
}) => {
  const { componentVersion, element, env } = options;

  return {
    graphqlFetch: createGraphqlFetch({
      element,
      version: componentVersion,
      endpoint: () =>
        env === 'stage'
          ? 'https://api.stage.manifold.co/graphql'
          : 'https://api.manifold.co/graphql',
    }),
    track,
  };
};

export default connection;
