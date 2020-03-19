import * as core from '../../core';
export interface Connection extends core.Connection {
}
export declare class ManifoldInit {
    env?: 'stage' | 'prod';
    authToken?: string;
    authType?: 'manual' | 'oauth';
    clientId?: string;
    initialize(options: {
        element: HTMLElement;
        componentVersion: string;
        version: number;
    }): Promise<Connection>;
    render(): any;
}
