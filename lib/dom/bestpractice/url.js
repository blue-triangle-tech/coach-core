(function () {
  'use strict';

  const url = document.URL;
  let score = 100;
  let message = '';

  // ok all Java lovers, please do not use the sessionid in your URLs
  if (url.indexOf('?') > -1 && url.indexOf('jsessionid') > url.indexOf('?')) {
    score = 0;
    message =
      `The page includes a session ID as a URL parameter. Session management should be handled through cookies to keep URLs clean and cacheable.`;
  }

  var parameters = (url.match(/&/g) || []).length;
  if (parameters > 1) {
    score -= 50;
    message +=
      ` The URL contains more than two query parameters. Consider simplifying the structure to improve readability and maintainability.`;
  }

  if (url.length > 100) {
    score -= 10;
    message +=
      ` The URL is ${url.length} characters long. It's recommended to keep URLs under 100 characters for better readability and compatibility.`;
  }

  if (url.indexOf(' ') > -1 || url.indexOf('%20') > -1) {
    score -= 10;
    message +=
      ` The URL contains spaces. Use hyphens or underscores instead to ensure proper encoding and compatibility across platforms.`;
  }

  return {
    id: 'url',
    title: 'Use a clean and readable URL format',
    description:
      `<p>Well-structured URLs are easier for users to understand and share, and they support better indexing by search engines. Avoid overly long URLs, excessive query parameters, spaces, or session identifiers in the URL string. Clean URLs improve usability, maintainability, and overall performance.</p>
      <p>Session handling should be managed via cookies, and URLs should use standard delimiters such as hyphens or underscores instead of spaces.</p>`,
    advice: message,
    score: score < 0 ? 0 : score,
    weight: 2,
    offending: [],
    tags: ['bestpractice']
  };
})();
