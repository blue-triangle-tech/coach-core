'use strict';

let util = require('../util');

module.exports = {
  id: 'optimalCssSize',
  title: 'Keep individual CSS responses small',
  description:
    `<p>Smaller CSS files improve rendering speed by allowing the browser to download and process styles more quickly. When a CSS file fits within a single initial TCP packet - typically around 14.5 KB - it can be delivered with minimal delay, allowing the browser to begin rendering earlier.</p>
    <p>Consider splitting non-critical CSS, inlining above-the-fold styles, and reducing unused rules to help keep individual responses within this size target.</p>`,
  weight: 3,
  tags: ['performance', 'css'],

  processPage: function (page) {
    let cssAssets = page.assets.filter((asset) => asset.type === 'css');
    let transferLimit = 14500;
    let score = 100;
    let advice = '';
    let offending = [];

    cssAssets.forEach(function (asset) {
      if (asset.transferSize > transferLimit) {
        score -= 10;
        offending.push({
          url: asset.url,
          transferSize: asset.transferSize,
          contentSize: asset.contentSize
        });
        advice +=
          `${asset.url} has a transfer size of ${util.formatBytes(asset.transferSize)} (${asset.transferSize} bytes), which exceeds the recommended limit of ${util.formatBytes(transferLimit)}.`
      }
    });

    if (score < 100) {
      advice += ` Try to keep individual CSS files under 14.5 KB to allow faster delivery and earlier rendering.`;
    }

    if (score < 0) {
      score = 0;
    }

    return {
      score,
      offending,
      advice
    };
  }
};
