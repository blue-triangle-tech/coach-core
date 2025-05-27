'use strict';

const util = require('../util');

module.exports = {
  id: 'unnecessaryHeaders',
  title: 'Avoid unnecessary response headers',
  description:
  `<p>Reducing unnecessary response headers helps streamline HTTP responses, improve performance, and reduce potential information leakage. Some headers are outdated, redundant, or better handled in other ways.</p>
    <p>Common headers to review include:</p>
    <ul>
    <li>P3P: Deprecated and no longer supported by modern browsers.</li>
    <li>Pragma: no-cache: Intended for requests, not responses.</li>
    <li>Cache-Control with both max-age and Expires: Redundant in most cases.</li>
    <li>Server: Reveals server software and version details unnecessarily.</li>
    <li>X-Frame-Options: SAMEORIGIN: May conflict with modern Content-Security-Policy headers.</li>
    </ul>
    <p>Only include headers that serve a specific, well-defined purpose.</p>`,
  weight: 1,
  tags: ['bestpractice', 'header'],
  processPage: function (page) {
    const offending = [];
    const p3pHeaders = [];
    const cacheHeaders = [];
    const pragmaHeaders = [];
    const xframeHeaders = [];
    const serverHeaders = [];
    let score = 100;
    let advice = '';
    page.assets.forEach(function (asset) {
      const headers = asset.headers.response;
      if (headers.p3p) {
        offending.push(asset.url);
        p3pHeaders.push(asset.url);
        score -= 1;
      }

      if (
        headers.expires &&
        headers['cache-control'] &&
        headers['cache-control'][0].indexOf('max-age' > -1)
      ) {
        // You don't need to set both expires and cache-control: max-age. Use just one!
        offending.push(asset.url);
        cacheHeaders.push(asset.url);
        score -= 1;
      }

      if (headers.pragma && headers.pragma[0].indexOf('no-cache') > -1) {
        offending.push(asset.url);
        pragmaHeaders.push(asset.url);
        score -= 1;
      }

      if (headers.server) {
        offending.push(asset.url);
        serverHeaders.push(asset.url);
        score -= 1;
      }

      if (
        headers['x-frame-options'] &&
        headers['x-frame-options'][0] === 'sameorigin'
      ) {
        offending.push(asset.url);
        xframeHeaders.push(asset.url);
        score -= 1;
      }
    });

    if (p3pHeaders.length > 0) {
      advice +=
        ` There are ${util.plural(p3pHeaders.length, 'response')} that include a P3P header. This header is deprecated and should be removed.`;
    }
    if (cacheHeaders.length > 0) {
      advice +=
        ` There are ${util.plural(cacheHeaders.length, 'response')} that set both "max-age" and "Expires" headers. This is typically redundant; use one consistent caching directive.`;
    }
    if (pragmaHeaders.length > 0) {
      advice +=
        ` There are ${util.plural(pragmaHeaders.length, 'response')} that set a "Pragma: no-cache" response header, which is intended for requests and should be avoided in responses.`;
    }
    if (xframeHeaders.length > 0) {
      advice +=
        ` There are ${util.plural(xframeHeaders.length, 'response')} that use the "X-Frame-Options: SAMEORIGIN" header. Consider managing frame policies through Content-Security-Policy instead.`;
    }
    if (serverHeaders.length > 0) {
      advice +=
        ` There are ${util.plural(serverHeaders.length, 'response')} that disclose server information via the "Server" header. Remove or obfuscate this to reduce exposure of implementation details.`;
    }

    return {
      score: Math.max(0, score),
      offending: offending,
      advice: advice
    };
  }
};
