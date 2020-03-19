/**
 *  Properties that should be found in every analytics event
 */
interface SharedProperties {
    description?: string;
    properties: {
        version: string;
        clientId: string;
    };
}
/**
 *  Based on `name`, what data should be sent?
 */
export declare type EventTypes = {
    name: 'load';
    properties: {
        duration: number;
    };
} | {
    name: 'first_render';
    properties: {
        duration: number;
    };
} | {
    name: 'rtt_graphql';
    properties: {
        duration: number;
    };
} | {
    name: 'token_received';
    properties: {
        duration: number;
    };
} | {
    name: 'first_render_with_data';
    properties: {
        duration: number;
        rttGraphql: number;
        load: number;
    };
} | {
    name: 'click';
    properties: {
        planId: string;
    };
};
export declare type EventEvent = {
    type: 'metric' | 'component-analytics';
} & SharedProperties & EventTypes;
/**
 *  Error analytics event
 */
export interface ErrorEvent extends SharedProperties {
    type: 'error';
    name: string;
    properties: {
        code: string;
        message: string;
        version: string;
        clientId: string;
    };
}
export interface ErrorDetail {
    name: string;
    code?: string;
    message?: string;
}
export declare type AnalyticsEvent = ErrorEvent | EventEvent;
export declare const endpoint: {
    local: string;
    stage: string;
    prod: string;
};
export interface CreateAnalytics {
    env: 'prod' | 'stage' | 'local';
    element: HTMLElement;
    clientId?: string;
}
export default function createAnalytics(args: CreateAnalytics): {
    track: (evt: AnalyticsEvent) => Promise<Response>;
    report: (detail: ErrorDetail) => void;
    mark: (name: string) => void;
    measure: (name: string) => {
        duration: number;
        firstReport: boolean;
    };
};
export {};
