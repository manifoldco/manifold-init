import { Component, Prop } from '@stencil/core';
import { initialize } from '../../core';

@Component({
  tag: 'mui-core',
})
export class ConnectedButton {
  @Prop() env?: 'stage' | 'prod' = 'prod';
  @Prop() authToken?: string;
  @Prop() authType?: 'manual' | 'oauth' = 'oauth';

  componentWillLoad() {
    initialize({ env: this.env, authToken: this.authToken, authType: this.authType });
  }

  render() {
    return null;
  }
}
