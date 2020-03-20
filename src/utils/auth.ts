export function waitForAuthToken<T>(
  getAuthToken: () => string | undefined,
  wait: number,
  resume: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const success = () => {
      resolve(resume());
    };

    document.addEventListener('manifold-auth-token-receive', success, { once: true });

    setTimeout(() => {
      document.removeEventListener('manifold-auth-token-receive', success);

      if (!getAuthToken()) {
        const detail = { message: 'No auth token given' };
        reject(detail);
      }
    }, wait);
  });
}
