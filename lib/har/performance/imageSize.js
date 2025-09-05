'use strict';

let util = require('../util');

module.exports = {
  id: 'imageSize',
  title: "Keep total image size manageable",
  description:
    `<p>Large image payloads can significantly increase page weight and bandwidth consumption, particularly on slower connections or mobile devices. Although images may not block the first paint, they still affect overall load time and user experience.</p>
    <p>To optimize performance, ensure images are properly compressed, served in efficient formats (such as WebP or AVIF where supported), and lazy-loaded when not immediately visible. Only include images that are necessary for the page’s content and purpose.</p>`,
  weight: 5,
  tags: ['performance', 'image'],

  processPage: function (page) {
    let images = page.assets.filter(
      (asset) => asset.type === 'image' || asset.type === 'svg'
    );
    let contentSize = 0;
    let contentLimit = 700000;
    let score = 100;

    images.forEach(function (image) {
      contentSize += image.contentSize;
    });

    if (contentSize > contentLimit) {
      // TODO reduce the score per 100 kB.
      score -= 50;
    }

    return {
      score: score,
      offending: [],
      advice:
        score < 100
          ? `The total image size on the page is ${util.formatBytes(contentSize)}. Review whether the images are using appropriate formats, are fully optimized, and can be lazy loaded to reduce impact on load performance.`
          : ''
    };
  }
};
