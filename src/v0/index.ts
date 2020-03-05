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

export interface InitDetail {
  resolve: (connection: Connection) => void;
  reject: (error: Error) => void;
  version: 0;
  componentVersion: string;
}

const connection = (e: CustomEvent<InitDetail>, options: { env: 'stage' | 'prod' }) => {
  const { componentVersion } = e.detail;
  const element = e.target as HTMLElement;

  return {
    graphqlFetch: createGraphqlFetch({
      element,
      version: componentVersion,
      endpoint: () =>
        options.env === 'stage'
          ? 'https://api.stage.manifold.co/graphql'
          : 'https://api.manifold.co/graphql',
    }),
    track,
  };
};

export default connection;
