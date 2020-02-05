// TODO replace with real functions
const graphqlFetch = (req: unknown): Promise<any> => {
  return new Promise(resolve => {
    resolve(req);
  });
};

const track = data => {
  console.log(data);
};

export interface Connection {
  request: <Req, Res>(req: Req) => Promise<Res>;
  track: (event: string) => void;
}

interface InitDetail {
  resolve: (connection: Connection) => void;
  reject: (error: Error) => void;
}

const onInitialize = async (e: CustomEvent<InitDetail>) => {
  const value = await e.detail;
  try {
    value.resolve({
      request: graphqlFetch,
      track
    });
  } catch (e) {
    value.reject(e);
  }
};

document.addEventListener("mui-initialize", onInitialize);
