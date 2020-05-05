# mui-core



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                           | Default     |
| ----------- | ------------ | ----------- | ------------------------------ | ----------- |
| `authToken` | `auth-token` |             | `string`                       | `undefined` |
| `authType`  | `auth-type`  |             | `"manual" \| "oauth"`          | `'oauth'`   |
| `clientId`  | `client-id`  |             | `string`                       | `undefined` |
| `env`       | `env`        |             | `"local" \| "prod" \| "stage"` | `'prod'`    |
| `ownerId`   | `owner-id`   |             | `string`                       | `undefined` |


## Events

| Event                         | Description | Type                  |
| ----------------------------- | ----------- | --------------------- |
| `manifold-auth-token-clear`   |             | `CustomEvent<any>`    |
| `manifold-auth-token-receive` |             | `CustomEvent<string>` |


## Methods

### `initialize(options: { element: HTMLElement; componentVersion: string; version: number; }) => Promise<Connection>`



#### Returns

Type: `Promise<Connection>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
