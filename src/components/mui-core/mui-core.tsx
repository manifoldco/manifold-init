import { Component, Prop, Method } from '@stencil/core';
import { initialize } from '../../core';

@Component({
  tag: 'mui-core',
})
export class ConnectedButton {
  @Prop() env?: 'stage' | 'prod' = 'prod';
  @Prop() authToken?: string;
  @Prop() authType?: 'manual' | 'oauth' = 'oauth';

  @Method()
  async initialize(options: { element: HTMLElement; componentVersion: string; version: number }) {
    const { version, componentVersion, element } = options;
    return initialize({
      env: this.env,
      authToken: this.authToken,
      authType: this.authType,
      version,
      componentVersion,
      element,
    });
  }

  render() {
    return null;
  }
}
