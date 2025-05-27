(function () {
  'use strict';

  const url = document.URL;
  let score = 100;
  let message = '';

  if (url.indexOf('https://') === -1) {
    score = 0;
    message =
      `The page is not served over HTTPS. Unencrypted requests expose user activity and compromise security. Migrate to HTTPS to ensure data privacy, integrity, and compatibility with modern web standards.`;
  }

  return {
    id: 'https',
    title: 'Serve your content over HTTPS',
    description:
      `<p>All web pages should be delivered securely using HTTPS. Serving content over encrypted connections protects users from data interception, preserves privacy, and ensures content integrity. HTTPS is also a requirement for modern web features, including HTTP/2 and service workers.</p>
      <p>If your site still uses HTTP, consider migrating to HTTPS as soon as possible. Certificates can be obtained at no cost through widely trusted certificate authorities.</p>`,
    advice: message,
    score: score,
    weight: 10,
    offending: [],
    tags: ['privacy']
  };
})();
