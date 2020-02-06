import { Component, Element, State, h } from "@stencil/core";
import { HTMLStencilElement } from "@stencil/core/internal";
import { Connection } from "../../utils/initialize";

function initialize(el: HTMLStencilElement): Promise<Connection> {
  return new Promise((resolve, reject) => {
    el.dispatchEvent(
      new CustomEvent("mui-initialize", {
        bubbles: true,
        detail: {
          resolve,
          reject,
          version: "<@NPM_PACKAGE_VERSION@>"
        }
      })
    );
  });
}

@Component({
  tag: "connected-button"
})
export class ConnectedButton {
  @Element() el: HTMLConnectedButtonElement;
  @State() message: string;
  connection: Connection;
  async componentWillLoad() {
    this.connection = await initialize(this.el);
  }
  getData = async () => {
    const { data } = await this.connection.graphqlFetch({
      query: `{ product(label: "jawsdb-mysql") { displayName } }`,
      element: this.el
    });
    this.message = data.product.displayName;
  };
  render() {
    return (
      <div>
        <button type="button" onClick={this.getData}>
          Click me to get the message!
        </button>
        {this.message && <p>The message was received: {this.message}</p>}
      </div>
    );
  }
}
