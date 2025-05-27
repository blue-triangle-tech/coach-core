'use strict';

const util = require('../util');

module.exports = {
  id: 'favicon',
  title: 'The favicon should be small and cacheable',
  description:
  `Favicons are requested automatically by browsers and should be optimized for performance. A large favicon increases unnecessary data transfer, especially on repeat visits. To improve efficiency, keep the favicon file size small and ensure it is served with long-term cache headers.`,
  weight: 1,
  tags: ['performance', 'favicon'],

  processPage: function (page) {
    let total = 0;
    const offending = [];
    let advice = '';
    page.assets.forEach(function (asset) {
      if (asset.type === 'favicon') {
        if (asset.status >= 299) {
          total += 100;
          advice += `The favicon returned status code ${asset.status}. Verify that it is correctly served.`;
        }
        if (asset.transferSize > 10000) {
          total += 50;
          advice +=
            ` The favicon size is ${util.formatBytes(asset.transferSize)}. Consider reducing its size to improve load efficiency.`;
        }
        if (asset.expires <= 0) {
          total += 50;
          advice += ` The favicon is missing cache headers. Set an appropriate cache duration to avoid repeated downloads.`;
        }
        if (total > 0) {
          offending.push(asset.url);
        }
      }
    });

    // If we miss out of the favicon ... well do not report it for now
    // it seems to be a bug in how we create the HAR in Chrome (or in PageXray)

    return {
      score: Math.max(0, 100 - total),
      offending: offending,
      advice: advice
    };
  }
};
