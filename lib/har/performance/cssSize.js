'use strict';

let util = require('../util');

module.exports = {
  id: 'cssSize',
  title: "Consider keeping the total CSS size manageable",
  description:
  `<p>Large CSS files can increase the time required for the browser to parse and apply styles, which slows down page rendering. Aim to deliver only the CSS needed for the current page and remove unused rules during development and build processes.</p>
  <p>Keeping CSS lean improves both initial load performance and runtime efficiency, particularly on mobile devices and slower hardware.</p>`,
  weight: 5,
  tags: ['performance', 'css'],

  processPage: function (page, domAdvice, options) {
    let cssAssets = page.assets.filter((asset) => asset.type === 'css');
    let transferSize = 0;
    let contentSize = 0;
    let transferLimit = 120000;
    let contentLimit = 400000;
    let score = 100;
    let advice = '';
    const offending = [];

    cssAssets.forEach(function (asset) {
      transferSize += asset.transferSize;
      contentSize += asset.contentSize;
      offending.push({
        url: asset.url,
        transferSize: asset.transferSize,
        contentSize: asset.contentSize
      });
    });

    if (transferSize > transferLimit) {
      score -= 50;
    }

    if (contentSize > contentLimit) {
      score -= 50;
    }

    if (score < 100) {
      advice =
        `The total CSS transfer size is ${util.formatBytes(transferSize)}${
          (contentSize > transferSize ? 
            ', with an uncompressed size of ' + util.formatBytes(contentSize)
            : '')}.`;

      if (contentSize > 1000000 && options.mobile) {
        advice += `The CSS size is unusually large (greater than 1 MB) for a mobile context and may negatively impact load and render performance. Consider reducing or optimizing it.`;
      } else if (contentSize > 2000000) {
        advice +=
          `The CSS size exceeds 2 MB, which is excessive for most use cases. Review and remove unused styles to improve performance.`;
      } else {
        advice += `The CSS payload is large and could likely be reduced. Removing unused rules may help streamline the stylesheet.`;
      }
    }

    return {
      score,
      offending: offending,
      advice
    };
  }
};
