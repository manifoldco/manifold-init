import connection, { Connection as Connection_v0 } from './v0';

interface InitOptions {
  authType?: 'manual' | 'oauth';
  env?: 'local' | 'stage' | 'prod';
  getAuthToken: () => string | undefined;
  clearAuthToken: () => void;
  clientId?: string;
  componentVersion: string;
  version: number;
  element: HTMLElement;
}

export type Connection = Connection_v0;

export function initialize(options: InitOptions): Connection {
  const {
    version,
    element,
    env,
    componentVersion,
    clientId,
    getAuthToken,
    clearAuthToken,
  } = options;

  switch (version) {
    case undefined: // latest
    case 0:
      return connection({
        env,
        element,
        componentVersion,
        clientId,
        getAuthToken,
        clearAuthToken,
      });
    default:
      throw new Error(
        `Version ${version} doesn't exist. Ensure you have the latest release of manifold-init.`
      );
  }
}
