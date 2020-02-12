import { Component, Element, State, h } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { Connection } from '../../v0';
import { GraphqlError } from '../../v0/graphqlFetch';

function initialize(el: HTMLStencilElement): Promise<Connection> {
  return new Promise((resolve, reject) => {
    el.dispatchEvent(
      new CustomEvent('mui-initialize', {
        bubbles: true,
        detail: {
          resolve,
          reject,
          version: 0,
          componentVersion: '<@NPM_PACKAGE_VERSION@>',
        },
      })
    );
  });
}

@Component({
  tag: 'connected-button',
})
export class ConnectedButton {
  @Element() el: HTMLConnectedButtonElement;
  @State() success?: string;
  @State() badRequest?: string;
  @State() unauthenticated?: string;
  connection: Connection;
  async componentWillLoad() {
    this.connection = await initialize(this.el);
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
      </div>
    );
  }
}
