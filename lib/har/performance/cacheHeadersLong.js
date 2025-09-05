'use strict';

let util = require('../util');

const SKIPPABLE_DOMAINS = [
  'www.google-analytics.com',
  'ssl.google-analytics.com',
  'analytics.twitter.com'
];

function processAsset(asset) {
  if (SKIPPABLE_DOMAINS.indexOf(util.getHostname(asset.url)) > -1) {
    return 0;
  } else if (asset.expires >= 2592000) {
    return 0;
  } else if (asset.expires <= 0) {
    // this is caught in cacheHeaders so let's skip giving advice
    // about them
    return 0;
  } else {
    return 1;
  }
}

module.exports = {
  id: 'cacheHeadersLong',
  title: 'Use long cache durations for static assets',
  description:
  `<p>Setting cache headers allows the browser to reuse previously downloaded resources, improving performance and reducing server load. A longer cache duration - typically 30 days or more - is recommended for static assets that rarely change.</p>
  <p>If an asset needs to be updated, use a cache-busting strategy such as appending a version or hash to the filename. This ensures that browsers can safely cache content long-term while still detecting updates when needed.</p>`,
  weight: 3,
  tags: ['performance', 'server'],

  processPage: function (page) {
    let score = 100;
    let offending = [];
    page.assets.forEach(function (asset) {
      // Don't check the main page/document since it is common to not
      // cache that
      if (asset.url === page.finalUrl) {
        return;
      }
      let myScore = processAsset(asset);
      if (myScore > 0) {
        score -= myScore;
        offending.push(asset.url);
      }
    });

    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page has ${util.plural(offending.length, 'request')} with cache durations shorter than 30 days. Consider extending the cache time for static assets that do not change frequently.`
          : ''
    };
  }
};
