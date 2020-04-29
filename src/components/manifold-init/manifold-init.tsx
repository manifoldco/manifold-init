import { Component, Prop, Method, Event, EventEmitter, Watch } from '@stencil/core';
import * as core from '../../core';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Connection extends core.Connection {}

@Component({
  tag: 'manifold-init',
})
export class ManifoldInit {
  @Prop() env?: 'local' | 'stage' | 'prod' = 'prod';
  @Prop({ mutable: true }) authToken?: string;
  @Prop() authType?: 'manual' | 'oauth' = 'oauth';
  @Prop() clientId?: string;
  @Prop() ownerId?: string;
  @Event({ eventName: 'manifold-auth-token-clear', bubbles: true }) clear: EventEmitter;
  @Event({ eventName: 'manifold-auth-token-receive', bubbles: true }) receive: EventEmitter<string>;

  @Watch('authToken')
  tokenChanged(newValue?: string, oldValue?: string) {
    if (oldValue && !newValue) {
      this.clear.emit();
    } else if (newValue && oldValue !== newValue) {
      this.receive.emit(newValue);
    }
  }

  clearAuthToken = () => {
    this.authToken = undefined;
  };

  @Method()
  async initialize(options: {
    element: HTMLElement;
    componentVersion: string;
    version: number;
  }): Promise<Connection> {
    const { version, componentVersion, element } = options;
    return core.initialize({
      env: this.env,
      getAuthToken: () => this.authToken,
      getOwnerId: () => this.ownerId,
      authType: this.authType,
      version,
      componentVersion,
      element,
      clientId: this.clientId,
      clearAuthToken: this.clearAuthToken,
    });
  }

  render() {
    return null;
  }
}
