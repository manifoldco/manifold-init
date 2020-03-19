import fetchMock from 'fetch-mock';
import createAnalytics, { AnalyticsEvent, ErrorEvent } from '../analytics';

const local = 'begin:http://analytics.arigato.tools';
const stage = 'begin:https://analytics.stage.manifold.co';
const prod = 'begin:https://analytics.manifold.co';

const metric: AnalyticsEvent = {
  type: 'metric',
  name: 'rtt_graphql',
  properties: {
    duration: 123,
  },
};
const error: ErrorEvent = {
  type: 'error',
  name: 'mui-pricing-matrix_error',
  properties: {
    code: 'code',
    version: '1.2.3',
    message: 'message',
    clientId: '123',
  },
};
const track: AnalyticsEvent = {
  type: 'component-analytics',
  name: 'click',
  properties: {
    planId: '1234',
  },
};

describe('analytics', () => {
  describe('env', () => {
    afterEach(fetchMock.restore);

    it('local', async () => {
      const analytics = createAnalytics({
        env: 'local',
        element: document.createElement('manifold-product'),
        componentVersion: '1.2.3',
      });
      fetchMock.mock(local, {});
      await analytics.track(error);
      expect(fetchMock.called(local)).toBe(true);
    });

    it('stage', async () => {
      const analytics = createAnalytics({
        env: 'stage',
        element: document.createElement('manifold-product'),
        componentVersion: '1.2.3',
      });
      fetchMock.mock(stage, {});
      await analytics.track(error);
      expect(fetchMock.called(stage)).toBe(true);
    });

    it('prod', async () => {
      const analytics = createAnalytics({
        env: 'prod',
        element: document.createElement('manifold-product'),
        componentVersion: '1.2.3',
      });
      fetchMock.mock(prod, {});
      await analytics.track(error);
      expect(fetchMock.called(prod)).toBe(true);
    });
  });

  describe('type', () => {
    beforeEach(() => fetchMock.mock(prod, {}));
    afterEach(fetchMock.restore);

    it('error', async () => {
      const analytics = createAnalytics({
        env: 'prod',
        element: document.createElement('manifold-product'),
        componentVersion: '1.2.3',
      });
      await analytics.track(error);
      const res = fetchMock.calls()[0][1];
      expect(res && res.body && JSON.parse(res.body.toString())).toEqual({
        ...error,
        source: 'MANIFOLD-PRODUCT',
        properties: {
          ...error.properties,
          componentName: 'MANIFOLD-PRODUCT',
        },
      });
    });

    it('metric', async () => {
      const analytics = createAnalytics({
        env: 'prod',
        element: document.createElement('manifold-product'),
        componentVersion: '1.2.3',
      });
      await analytics.track(metric);
      const res = fetchMock.calls()[0][1];
      expect(res && res.body && JSON.parse(res.body.toString())).toEqual({
        ...metric,
        source: 'MANIFOLD-PRODUCT',
        properties: {
          ...metric.properties,
          componentName: 'MANIFOLD-PRODUCT',
          duration: '123', // numbers should submit as strings
        },
      });
    });

    it('track', async () => {
      const analytics = createAnalytics({
        env: 'prod',
        element: document.createElement('manifold-product'),
        componentVersion: '1.2.3',
      });
      await analytics.track(track);
      const res = fetchMock.calls()[0][1];
      expect(res && res.body && JSON.parse(res.body.toString())).toEqual({
        ...track,
        source: 'MANIFOLD-PRODUCT',
        properties: {
          ...track.properties,
          componentName: 'MANIFOLD-PRODUCT',
          planId: '1234', // numbers should submit as strings
        },
      });
    });
  });
});
