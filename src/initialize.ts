import { Connection } from './v0';

interface Initialize {
  element: HTMLElement;
  connectionVersion?: number;
  componentVersion: string;
}

export default function initialize({
  element,
  connectionVersion,
  componentVersion,
}: Initialize): Promise<Connection> {
  return new Promise((resolve, reject) => {
    element.dispatchEvent(
      new CustomEvent('mui-initialize', {
        bubbles: true,
        detail: {
          resolve,
          reject,
          connectionVersion,
          componentVersion,
        },
      })
    );
  });
}
