# manifold-init

This web component is a hub for our other web components to use for things like managing authentication, making network calls, and reporting errors and analytics.

## Why does this exist?

This exists for the benefit of our other web components, so that they don't each have to do the work of implementing more complex concerns that are shared by all components.

## Usage

If you are using one of our web component libraries, you need `manifold-init`. This component needs to be on the page for other components to use our GraphQL API. It accepts a `client-id` attribute which tells us which provider or platform you are within our system.

### Basic

At minimum, the component must be on the page with your `client-id`. Using [manifold-plan-table][manifold-plan-table] as an example:

```html
  <head>
    <script
      nomodule
      src="https://js.cdn.manifold.co/@manifoldco/manifold-init/dist/manifold-init/manifold-init.js"
    ></script>
    <script 
      nomodule 
      src="https://js.cdn.manifold.co/@manifoldco/manifold-plan-table/dist/manifold-plan-table/manifold-plan-table.js"
    ></script>
    
    <script
      async
      type="module"
      src="https://js.cdn.manifold.co/@manifoldco/manifold-init/dist/manifold-init/manifold-init.esm.js"
    ></script>
    <script
      async
      type="module"
      src="https://js.cdn.manifold.co/@manifoldco/manifold-plan-table/dist/manifold-plan-table/manifold-plan-table.esm.js"
    ></script>
    <script async type="module" src="/build/manifold-plan-table.esm.js"></script>
  </head>
  <body>
    <manifold-init client-id="your-client-id"></manifold-init>
    <manifold-plan-table product-id="your-product-id"></manifold-plan-table>
  </body>
```

### Authentication

Some of our components require your users to be authenticated in order to access their private data from our GraphQL API. You can retrieve a user authentication token using the [createProfileAuthToken][createProfileAuthToken] mutation. Once you have the auth token, you can pass it into the `manifold-init` component as the `auth-token` attribute. This token will then be included in all GraphQL requests to identify the user to our API. 

```html
    <manifold-init client-id="your-client-id" auth-token="user-auth-token"></manifold-init>
```

## Development

The `manifold-init` component exposes a connection object that web components can use to perform GraphQL requests and analytics tracking. You access this object by querying for the node as soon as `manifold-init` is defined in the custom elements registry:

```ts
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });
```

### TypeScript

If you're using TypeScript in your component library, you'll need access to some type definitions. 


#### The connection object

The definition for the `Connection` object is found in its own library, [@manifoldco/manifold-init-types][init-types].

```ts
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
```

This library supports multiple versions of the `Connection` object in order to avoid breaking changes for web components. The above example shows v0 being used.

#### HTMLManifoldInitElement

This is the type definition for the `manifold-init` element itself, and it also lives in [@manifoldco/manifold-init-types][init-types]. This can be exposed globally in your project in a type declaration file:

```ts
// global.d.ts
export * from '@manifoldco/manifold-init-types/types/components';
```

[manifold-plan-table]: https://github.com/manifoldco/manifold-plan-table
[createProfileAuthToken]: https://api.manifold.co/
[init-types]:
