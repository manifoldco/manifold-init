import { Connection } from '../../v0';
export declare class ConnectedButton {
    el: HTMLElement;
    success?: string;
    badRequest?: string;
    unauthenticated?: string;
    planCost?: string;
    connection: Connection;
    componentWillLoad(): Promise<void>;
    getDataSuccess: () => Promise<void>;
    getDataBadRequest: () => Promise<void>;
    getDataUnauthenticated: () => Promise<void>;
    getPlanCost: () => Promise<void>;
    render(): any;
}
