import connection, { InitDetail } from './v0';

const getConnection = (e: CustomEvent<InitDetail>) => {
  const { version } = e.detail;

  switch (version) {
    case undefined: // latest
    case 0:
      return connection(e);
    default:
      throw new Error(
        `Version ${version} doesn't exist. Ensure you have the latest release of mui-core.`
      );
  }
};

const onInitialize = (e: CustomEvent<InitDetail>) => {
  try {
    e.detail.resolve(getConnection(e));
  } catch (error) {
    e.detail.reject(error);
  }
};

document.addEventListener('mui-initialize', onInitialize);
