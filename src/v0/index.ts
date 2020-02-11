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

const connection = (e: CustomEvent<InitDetail>) => {
  const { componentVersion } = e.detail;
  const element = e.target as HTMLElement;

  return {
    graphqlFetch: createGraphqlFetch({
      element,
      version: componentVersion,
    }),
    track,
  };
};

export default connection;
