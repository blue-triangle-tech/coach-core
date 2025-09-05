'use strict';

const util = require('../util');
const types = ['html', 'plain', 'json', 'javascript', 'css', 'svg'];

function processAsset(asset) {
  if (types.indexOf(asset.type) > -1) {
    const headers = asset.headers.response;
    const encoding = headers['content-encoding']
      ? headers['content-encoding'][0]
      : '';
    if (
      encoding !== 'gzip' &&
      encoding !== 'br' &&
      encoding !== 'deflate' &&
      encoding !== 'zstd' &&
      asset.contentSize > 2000
    ) {
      return 10;
    }
  }
  return 0;
}

module.exports = {
  id: 'compressAssets',
  title: 'Consider compressing text-based resources',
  description:
  `<p>Modern browsers support compression algorithms such as Gzip and Brotli, which significantly reduce the size of text-based resources. Compressing content like HTML, CSS, JavaScript, JSON, and SVG improves load times and reduces bandwidth usage.</p>
  <p>Ensure your server is configured to compress these resource types to deliver a faster and more efficient experience to users.</p>`,
  weight: 8,
  tags: ['performance', 'server'],

  processPage: function (page) {
    let score = 100;
    let offending = [];
    page.assets.forEach(function (asset) {
      let myScore = processAsset(asset);
      if (myScore > 0) {
        score -= myScore;
        offending.push({
          url: asset.url,
          transferSize: asset.transferSize,
          contentSize: asset.contentSize
        });
      }
    });

    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page has ${util.plural(offending.length, 'request')} served without compression. Enabling compression for text-based resources can reduce transfer size and improve load performance.`
          : ''
    };
  }
};
