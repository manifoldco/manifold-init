import fetchMock from 'fetch-mock';
import { newSpecPage } from '@stencil/core/testing';
import { ManifoldInit } from './manifold-init';
import { endpoint } from '../../v0/analytics';

const ANALYTICS_ENDPOINT = endpoint.prod;

interface Props {
  clientId?: string;
}

async function setup(props: Props) {
  const page = await newSpecPage({
    components: [ManifoldInit],
    html: `<div></div>`,
  });

  const component = page.doc.createElement('manifold-init');
  component.clientId = props.clientId;

  const root = page.root as HTMLDivElement;
  root.appendChild(component);
  await page.waitForChanges();

  return { page, component };
}

describe(ManifoldInit.name, () => {
  afterEach(() => {
    fetchMock.reset();
  });

  describe('component load', () => {
    it('should send an analytics load event when it loads', async () => {
      fetchMock.mock(ANALYTICS_ENDPOINT, {});
      await setup({ clientId: '123' });
      expect(fetchMock.called()).toBe(true);
      const res = fetchMock.calls()[0][1];
      expect(res && res.body && JSON.parse(res.body.toString())).toEqual({
        source: 'MANIFOLD-INIT',
        name: 'component-load',
        description: 'Track component load event',
        type: 'component-analytics',
        properties: {
          componentName: 'MANIFOLD-INIT',
          clientId: '123',
          version: '<@NPM_PACKAGE_VERSION@>',
          ownerId: '',
        },
      });
    });
  });
});
