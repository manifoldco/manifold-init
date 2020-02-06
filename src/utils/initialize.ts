import { createGraphqlFetch, GraphqlFetch } from "./graphqlFetch";

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
}

const onInitialize = (e: CustomEvent<InitDetail>) => {
  const value = e.detail;
  try {
    value.resolve({
      graphqlFetch: createGraphqlFetch({}),
      track
    });
  } catch (e) {
    value.reject(e);
  }
};

document.addEventListener("mui-initialize", onInitialize);
