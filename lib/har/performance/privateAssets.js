'use strict';
const util = require('../util');
const types = ['json', 'javascript', 'css', 'image', 'svg', 'font', 'html'];

function processAsset(asset) {
  if (types.indexOf(asset.type) > -1 && asset.method === 'GET') {
    const headers = asset.headers.response;
    const cacheControl = headers['cache-control']
      ? headers['cache-control'][0]
      : '';
    if (cacheControl.indexOf('private') > -1) {
      return 10;
    }
  }
  return 0;
}

module.exports = {
  id: 'privateAssets',
  title: "Avoid private cache headers on static content",
  description:
    `<p>Using Cache-Control: private indicates that a resource is intended for a single user and should not be cached by shared caches. While this may be appropriate for personalized or user-specific content, it is not suitable for static assets such as scripts, stylesheets, fonts, or images.</p>
    <p>Static resources should be cacheable by all users to reduce redundant downloads and improve performance across repeated visits. Always review cache headers to ensure they align with the intended use of the asset.</p>`, 
  weight: 5,
  tags: ['performance', 'server'],
  processPage: function (page) {
    let advice = '';
    let score = 100;
    let offending = [];
    page.assets.forEach(function (asset) {
      let myScore = processAsset(asset);
      if (myScore > 0 && page.url !== asset.url) {
        score -= myScore;
        offending.push(asset.url);
      } else if (myScore > 0 && page.url === asset.url) {
        offending.push(asset.url);
        advice =
          `The main page is served with a private cache header. While this may be valid for personalized content, it is not appropriate for static pages or assets. Review whether private caching is necessary.`;
      }
    });

    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page includes ${util.plural(offending.length, 'request')} with private cache headers. ${advice} Ensure that these assets are truly user-specific. If not, update the caching policy to allow public caching for better performance.`
          : advice
    };
  }
};
