import { Component, Element, State, h } from '@stencil/core';
import { Connection } from '../../v0';

@Component({
  tag: 'connected-button',
})
export class ConnectedButton {
  @Element() el: HTMLElement;
  @State() success?: string;
  @State() badRequest?: string;
  @State() unauthenticated?: string;
  @State() planCost?: string;

  connection: Connection;

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector<HTMLManifoldInitElement>('manifold-init');
    if (!core) {
      throw new Error('<manifold-init> not found in document');
    }
    this.connection = await core.initialize({
      element: this.el,
      version: 0,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
    });
  }
  getDataSuccess = async () => {
    const response = await this.connection.graphqlFetch({
      query: `{ product(label: "jawsdb-mysql") { displayName } }`,
    });
    this.success = JSON.stringify(response, null, 2);
  };

  getDataBadRequest = async () => {
    const response = await this.connection.graphqlFetch({
      query: `{ product(label: "jawsdb-mysql") { notAField } }`,
    });
    this.badRequest = JSON.stringify(response, null, 2);
  };

  getDataUnauthenticated = async () => {
    const response = await this.connection.graphqlFetch({
      query: `{ resource(label: "jawsdb-mysql") { label } }`,
    });
    this.unauthenticated = JSON.stringify(response, null, 2);
  };

  getPlanCost = async () => {
    const selection = {
      features: { backups: 1, instance_class: 'db.t2.micro', redundancy: false, storage: 5 },
    };

    const response = await this.connection.gateway.post<{ cost: number }, typeof selection>(
      '/id/plan/235exy25wvzpxj52p87bh87gbnj4y/cost',
      selection
    );

    this.planCost = JSON.stringify(response, null, 2);
  };

  render() {
    return (
      <div>
        <button type="button" onClick={this.getDataSuccess}>
          Send (success)
        </button>
        {this.success && (
          <p>
            Response: <pre>{this.success}</pre>
          </p>
        )}
        <hr />
        <button type="button" onClick={this.getDataBadRequest}>
          Send (bad request)
        </button>
        {this.badRequest && (
          <p>
            Response: <pre>{this.badRequest}</pre>
          </p>
        )}
        <hr />
        <button type="button" onClick={this.getDataUnauthenticated}>
          Send (unauthenticated)
        </button>
        {this.unauthenticated && (
          <p>
            Response: <pre>{this.unauthenticated}</pre>
          </p>
        )}
        <hr />
        <button type="button" onClick={this.getPlanCost}>
          Send (plan cost)
        </button>
        {this.planCost && (
          <p>
            Response: <pre>{this.planCost}</pre>
          </p>
        )}
      </div>
    );
  }
}
