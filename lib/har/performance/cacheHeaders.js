'use strict';

let util = require('../util');

const SKIPPABLE_DOMAINS = [
  'www.google-analytics.com',
  'ssl.google-analytics.com',
  'analytics.twitter.com'
];

module.exports = {
  id: 'cacheHeaders',
  title: 'Avoid extra requests by setting cache headers',
  description:
  `<p>One of the simplest ways to improve page speed is to reduce unnecessary network requests. By setting appropriate cache headers on static assets, the browser can reuse previously downloaded content instead of fetching it again.</p>
  <p>If the content does not change between visits, configure a suitable cache duration to avoid redundant downloads. This not only reduces server load but also improves the user experience, especially on repeated visits.</p>`,
  weight: 30,
  tags: ['performance', 'server'],

  processPage: function (page) {
    let score = 100;
    let offending = [];
    let saveSize = 0;
    page.assets.forEach(function (asset) {
      // Don't check the main page/document since it is common to not
      // cache that
      if (asset.url === page.finalUrl) {
        return;
      }

      if (
        SKIPPABLE_DOMAINS.indexOf(util.getHostname(asset.url)) === -1 &&
        asset.expires <= 0 &&
        asset.method === 'GET'
      ) {
        // TODO we should check if the asset is set private, think the most logical would be to exclude them
        score -= 10;
        saveSize += asset.transferSize;
        offending.push(asset.url);
      }
    });

    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page has ${util.plural(offending.length, 'request')} that are missing cache directives. Configure appropriate caching headers to prevent repeated downloads. This could save ${util.formatBytes(saveSize)} on subsequent page loads.`
          : ''
    };
  }
};
