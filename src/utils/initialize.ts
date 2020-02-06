import { createGraphqlFetch, GraphqlFetch } from "./graphqlFetch";

// TODO add real tracking
const track = data => {
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

const onInitialize = (e: CustomEvent<InitDetail>) => {
  const { resolve, reject, version } = e.detail;
  try {
    resolve({
      graphqlFetch: createGraphqlFetch({
        element: e.target as HTMLElement,
        version
      }),
      track
    });
  } catch (e) {
    reject(e);
  }
};

document.addEventListener("mui-initialize", onInitialize);
