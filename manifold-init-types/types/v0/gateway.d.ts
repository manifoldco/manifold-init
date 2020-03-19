export interface Gateway {
    post: <Resp, Req extends {}>(path: string, body: Req) => Promise<Resp>;
}
export declare function createGateway({ baseUrl, retries, }: {
    baseUrl?: () => string;
    retries?: number;
}): Gateway;
