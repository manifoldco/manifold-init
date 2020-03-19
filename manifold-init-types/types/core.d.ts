import { Connection as Connection_v0 } from './v0';
interface InitOptions {
    authType?: 'manual' | 'oauth';
    env?: 'stage' | 'prod';
    authToken?: string;
    clientId?: string;
    componentVersion: string;
    version: number;
    element: HTMLElement;
}
export declare type Connection = Connection_v0;
export declare function initialize(options: InitOptions): Connection;
export {};
