import { AnalyticsEvent, ErrorDetail } from './analytics';
import { GraphqlFetch } from './graphqlFetch';
import { Gateway } from './gateway';
export interface Connection {
    graphqlFetch: GraphqlFetch;
    gateway: Gateway;
    analytics: {
        track: (e: AnalyticsEvent) => Promise<Response>;
        report: (detail: ErrorDetail) => void;
        mark: (name: AnalyticsEvent['name']) => void;
        measure: (name: AnalyticsEvent['name']) => void;
    };
}
declare const connection: (options: {
    env: "local" | "prod" | "stage";
    element: HTMLElement;
    componentVersion: string;
    clientId?: string;
}) => Connection;
export default connection;
