import connection, { Connection as Connection_v0 } from './v0';

interface InitOptions {
  authType?: 'manual' | 'oauth';
  env?: 'stage' | 'prod';
  authToken?: string;
  componentVersion: string;
  version: number;
  element: HTMLElement;
}

const getConnection = (options: InitOptions) => {
  const { version, element, env, componentVersion } = options;

  switch (version) {
    case undefined: // latest
    case 0:
      return connection({
        env,
        element,
        componentVersion,
      });
    default:
      throw new Error(
        `Version ${version} doesn't exist. Ensure you have the latest release of mui-core.`
      );
  }
};

export type Connection = Connection_v0;

export function initialize(options: InitOptions): Connection {
  return getConnection(options);
}
