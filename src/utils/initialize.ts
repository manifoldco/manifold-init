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

interface InitDetail {
  resolve: (connection: Connection) => void;
  reject: (error: Error) => void;
  version: string;
}

const getConnection = (e: CustomEvent<InitDetail>) => {
  const { version } = e.detail;
  const element = e.target as HTMLElement;

  const connections = {
    '0.0.1': {
      graphqlFetch: createGraphqlFetch({
        element,
        version,
      }),
      track,
    },
  };

  const currentVersion = connections[version];

  if (!currentVersion) {
    throw new Error(
      `Version ${version} doesn't exist. Ensure you have the latest release of mui-core.`
    );
  }
  return currentVersion;
};

const onInitialize = (e: CustomEvent<InitDetail>) => {
  try {
    e.detail.resolve(getConnection(e));
  } catch (error) {
    e.detail.reject(error);
  }
};

document.addEventListener('mui-initialize', onInitialize);
