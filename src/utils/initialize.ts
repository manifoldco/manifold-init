import { createGraphqlFetch, GraphqlFetch } from './graphqlFetch';

// TODO add real tracking
const track = data => {
  // eslint-disable-next-line no-console
  console.log(data);
};

const VERSIONS = ['0.0.1'];

const validateVersion = (version: string, element: HTMLElement) => {
  const isValid = VERSIONS.includes(version);
  if (!isValid) {
    throw new Error(`Version ${version} of ${element.tagName} is not recognized by mui-core.`);
  }
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

const onInitialize = (e: CustomEvent<InitDetail>) => {
  const { resolve, reject, version } = e.detail;
  const element = e.target as HTMLElement;

  try {
    validateVersion(version, element);
    resolve({
      graphqlFetch: createGraphqlFetch({
        element,
        version,
      }),
      track,
    });
  } catch (error) {
    reject(error);
  }
};

document.addEventListener('mui-initialize', onInitialize);
