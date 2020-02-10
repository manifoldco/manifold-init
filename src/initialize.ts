import connection_0, { InitDetail as InitDetail_0 } from './v0';

type InitDetail = InitDetail_0;

const getConnection = (e: CustomEvent<InitDetail>) => {
  const { version } = e.detail;

  const connections = {
    0: connection_0(e),
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
