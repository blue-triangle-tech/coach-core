(function () {
  'use strict';

  const connectionType = util.getConnectionType();
  let score = 100;
  let message = '';

  if (connectionType.indexOf('spdy') !== -1) {
    score = 0;
    message =
      `The page is using SPDY, which is deprecated and no longer supported in most modern browsers. Migrate to HTTP/2 to ensure compatibility and maintain performance.`;
  }

  return {
    id: 'spdy',
    title: 'SPDY is deprecated, migrate to HTTP/2',
    description:
      `<p>The SPDY protocol is no longer supported in modern browsers. For example, support was removed in Chrome 51. HTTP/2 is the recommended replacement and is now widely supported across all major browsers.</p>
      <p>If your server is still using SPDY, you should migrate to HTTP/2 to ensure compatibility, maintain performance benefits, and avoid fallback to less efficient protocols.</p>`,
    advice: message,
    score: score,
    weight: 1,
    offending: [],
    tags: ['bestpractice']
  };
})();
