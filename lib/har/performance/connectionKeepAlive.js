'use strict';

const util = require('../util');

module.exports = {
  id: 'connectionKeepAlive',
  title: "Reuse connections with keep-alive",
  description:
  `<p>When multiple requests are made to the same domain, reusing the existing connection can improve performance and reduce latency. Ensure your server uses "Connection: keep-alive" headers to avoid unnecessarily closing connections.</p>
  <p>Previously, some configurations attempted to close connections early to force new ones, but this is no longer considered effective or necessary with modern networking protocols.</p>`,
  weight: 5,
  tags: ['performance', 'server'],
  processPage: function (page) {
    let score = 100;
    let offending = [];
    let avoid = 'doc';

    let closedPerDomain = {};
    page.assets.forEach(function (asset) {
      const headers = asset.headers.response;
      const connectionHeader = headers.connection ? headers.connection[0] : '';
      if (asset.type !== avoid && connectionHeader.indexOf('close') > -1) {
        const hostname = util.getHostname(asset.url);
        if (!closedPerDomain[hostname]) {
          closedPerDomain[hostname] = 1;
          // TODO these assets should be reported too
        } else {
          closedPerDomain[hostname] += 1;
          offending.push(asset.url);
          score -= 10;
        }
      }
    });
    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page includes ${util.plural(offending.length, 'request')} to a domain where the connection was prematurely closed. Use persistent connections with keep-alive headers to allow reuse and reduce overhead.`
          : ''
    };
  }
};
