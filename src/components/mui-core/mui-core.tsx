import { Component, Prop, Method } from '@stencil/core';
import * as core from '../../core';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Connection extends core.Connection {}

@Component({
  tag: 'mui-core',
})
export class MuiCore {
  @Prop() env?: 'stage' | 'prod' = 'prod';
  @Prop() authToken?: string;
  @Prop() authType?: 'manual' | 'oauth' = 'oauth';

  @Method()
  async initialize(options: {
    element: HTMLElement;
    componentVersion: string;
    version: number;
  }): Promise<Connection> {
    const { version, componentVersion, element } = options;
    return core.initialize({
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
