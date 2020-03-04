import connection, { InitDetail } from './v0';

interface InitOptions {
  authType?: 'manual' | 'oauth';
  env?: 'stage' | 'prod';
  authToken?: string;
}

const getConnection = (e: CustomEvent<InitDetail>, options: InitOptions) => {
  const { version } = e.detail;

  switch (version) {
    case undefined: // latest
    case 0:
      return connection(e, {
        env: options.env,
      });
    default:
      throw new Error(
        `Version ${version} doesn't exist. Ensure you have the latest release of mui-core.`
      );
  }
};

const onInitialize = (options: InitOptions) => (e: CustomEvent<InitDetail>) => {
  try {
    e.detail.resolve(getConnection(e, options));
  } catch (error) {
    e.detail.reject(error);
  }
};

export function initialize(options: InitOptions) {
  document.addEventListener('mui-initialize', onInitialize(options));
}
