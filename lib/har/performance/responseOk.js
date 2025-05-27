'use strict';
const util = require('../util');
module.exports = {
  id: 'responseOk',
  title: 'Avoid missing or error responses',
  description:
    `<p>Requests that return HTTP 4xx or 5xx status codes indicate broken links, missing resources, or server errors. These responses cannot be cached and often lead to visible issues on the page, degraded performance, or incomplete functionality.</p>
    <p>Every request made by the page should return a valid, successful response. Regularly audit your site to detect and fix broken references or backend issues.</p>`,
  weight: 7,
  tags: ['performance', 'server'],

  processPage: function (page) {
    let score = 100;
    let offending = [];
    let offendingCodes = {};
    let advice = '';
    page.assets.forEach(function (asset) {
      if (asset.status >= 400) {
        offending.push(asset.url);
        score -= 10;
        if (offendingCodes[asset.status]) {
          offendingCodes[asset.status] += 1;
        } else {
          offendingCodes[asset.status] = 1;
        }
      }
    });

    if (score < 100) {
      advice =
        `The page has ${util.plural(offending.length, 'error response')}. These indicate failed resource requests that should be investigated and corrected.`;
      Object.keys(offendingCodes).forEach(function (errorCode) {
        advice +=
          ` The page has ${util.plural(offendingCodes[errorCode], 'response')} with status code ${errorCode}. Review the source of these requests to identify and resolve the issue.`;
      });
    }

    return {
      score: Math.max(0, score),
      offending: offending,
      advice: advice
    };
  }
};
