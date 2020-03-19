interface CreateGraphqlFetch {
    endpoint?: () => string;
    clientId?: string;
    element: HTMLElement;
    version: string;
    retries?: number;
}
declare type GraphqlRequest = {
    mutation: string;
    variables?: {
        [key: string]: unknown;
    };
} | {
    query: string;
    variables?: {
        [key: string]: unknown;
    };
};
export interface GraphqlError {
    message: string;
    locations?: {
        line: number;
        column: number;
    }[];
    path?: string;
    extensions?: {
        type?: string;
    };
}
export interface GraphqlResponseBody<GraphqlData> {
    data: GraphqlData | null;
    errors?: GraphqlError[];
}
export declare type GraphqlFetch = <T>(args: GraphqlRequest) => Promise<GraphqlResponseBody<T>>;
export declare function createGraphqlFetch({ element, endpoint, version, retries, clientId, }: CreateGraphqlFetch): GraphqlFetch;
export {};
