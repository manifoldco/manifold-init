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
          reject
        }
      })
    );
  });
}
interface Message {
  text: string;
}
@Component({
  tag: "mui-plan-pricing"
})
export class MuiPlanPricing {
  @Element() el: HTMLMuiPlanPricingElement;
  @State() message: string;
  connection: Connection;
  async componentWillLoad() {
    this.connection = await initialize(this.el);
  }
  getData = async () => {
    const responseMessage = await this.connection.request<Message, Message>({
      text: "hello"
    });
    this.message = responseMessage.text;
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
