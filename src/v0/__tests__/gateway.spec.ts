import fetchMock from 'fetch-mock';
import { createGateway } from '../gateway';
import { ErrorType, ManifoldError } from '../ManifoldError';
import { RestError } from '../RestError';

describe('gateway', () => {
  describe('post', () => {
    const baseUrl = 'http://test.test/v1';
    const path = '/plan-cost';
    const endpoint = `${baseUrl}${path}`;

    afterEach(() => {
      fetchMock.restore();
    });

    it('throws if the fetch errored', () => {
      const err = new ManifoldError({ type: ErrorType.NetworkError });
      const gateway = createGateway({
        baseUrl: () => baseUrl,
        getAuthToken: () => undefined,
        clearAuthToken: () => {},
        analytics: { track: jest.fn(), report: jest.fn() },
      });

      fetchMock.mock(endpoint, { throws: err });

      expect.assertions(2);
      return gateway.post(path, {}).catch((result: ManifoldError) => {
        expect(fetchMock.called(endpoint)).toBe(true);
        expect(result.type).toBe(ErrorType.NetworkError);
      });
    });

    describe('Client errors', () => {
      it('throws an error with the status code', () => {
        const gateway = createGateway({
          baseUrl: () => baseUrl,
          getAuthToken: () => undefined,
          clearAuthToken: () => {},
          analytics: { track: jest.fn(), report: jest.fn() },
        });

        fetchMock.mock(endpoint, 422);

        expect.assertions(3);
        return gateway.post(path, {}).catch((result: RestError) => {
          expect(fetchMock.called(endpoint)).toBe(true);
          expect(result.type).toBe(ErrorType.ClientError);
          expect(result.code).toBe(422);
        });
      });
    });

    describe('Expired auth tokens', () => {
      describe('with no retries', () => {
        it('throws when expired', async () => {
          const gateway = createGateway({
            baseUrl: () => baseUrl,
            getAuthToken: () => undefined,
            clearAuthToken: () => {},
            analytics: { track: jest.fn(), report: jest.fn() },
            retries: 0,
            waitTime: 0,
          });

          fetchMock.mock(endpoint, 401);

          expect.assertions(2);
          return gateway.post(path, {}).catch((result: ManifoldError) => {
            expect(fetchMock.called(endpoint)).toBe(true);
            expect(result.type).toEqual(ErrorType.AuthorizationError);
          });
        });
      });

      describe('with retries', () => {
        it('will retry if the token is refreshed', async () => {
          const clearAuthToken = jest.fn();
          const gateway = createGateway({
            baseUrl: () => baseUrl,
            getAuthToken: () => undefined,
            clearAuthToken,
            analytics: { track: jest.fn(), report: jest.fn() },
            retries: 1,
            waitTime: 0,
          });

          const body = { data: { title: 'test' } };

          fetchMock
            .once(endpoint, {
              status: 401,
            })
            .mock(endpoint, { status: 200, body }, { overwriteRoutes: false });

          const fetch = gateway.post(path, {});

          /* Queue the dispatch back a tick to allow listeners to be set up */
          await new Promise((resolve) => {
            setTimeout(() => {
              document.dispatchEvent(
                new CustomEvent('manifold-auth-token-receive', { detail: { token: '12344' } })
              );

              resolve();
            });
          });

          const result = await fetch;

          expect(clearAuthToken).toHaveBeenCalled();
          expect(fetchMock.calls()).toHaveLength(2);
          expect(result).toEqual(body);
        });
      });
    });
  });
});
