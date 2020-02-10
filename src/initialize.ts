import connection, { InitDetail as InitDetail_0 } from './v0';

type InitDetail = InitDetail_0;

const LATEST = 0;

const getConnection = async (e: CustomEvent<InitDetail>) => {
  const { version } = e.detail;
  // Pre-load latest version
  if (version === LATEST) {
    return connection(e);
  }

  // Lazy-import older versions
  try {
    return (await import(`./v${version}`)).default(e);
  } catch {
    throw new Error(
      `Version ${version} doesn't exist. Ensure you have the latest release of mui-core.`
    );
  }
};

const onInitialize = async (e: CustomEvent<InitDetail>) => {
  try {
    e.detail.resolve(await getConnection(e));
  } catch (error) {
    e.detail.reject(error);
  }
};

document.addEventListener('mui-initialize', onInitialize);
