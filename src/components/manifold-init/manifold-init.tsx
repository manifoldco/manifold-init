import { Component, Prop, Method, Element, Event, EventEmitter, Watch } from '@stencil/core';
import * as core from '../../core';
import createAnalytics from '../../v0/analytics';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Connection extends core.Connection {}

@Component({
  tag: 'manifold-init',
})
export class ManifoldInit {
  @Element() el: HTMLElement;
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

  async componentWillLoad() {
    const analytics = createAnalytics({
      env: this.env || 'prod',
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      clientId: this.clientId,
    });
    analytics.track({
      description: 'Track component load event',
      name: 'component-load',
      type: 'component-analytics',
      properties: {
        ownerId: this.ownerId || '',
      },
    });
  }

  render() {
    return null;
  }
}
