'use strict';

let util = require('../util');

module.exports = {
  id: 'pageSize',
  title: "Keep total page size within reasonable limits",
  description:
    `<p>Large total page sizes increase load times, consume more bandwidth, and can negatively affect users - especially on mobile devices or limited data plans. As a general guideline, total transfer size should remain below 2 MB for desktop and below 1 MB for mobile.</p>
    <p>Reducing page weight improves performance and user experience. Optimize images, scripts, fonts, and other assets to eliminate unnecessary data transfer.</p>`,
  weight: 3,
  tags: ['performance', 'mobile'],
  processPage: function (page, domAdvice, options) {
    let sizeLimit = options.mobile ? 1000000 : 2000000;
    if (page.transferSize > sizeLimit) {
      const offending = [];
      page.assets.forEach(function (asset) {
        offending.push({
          url: asset.url,
          transferSize: asset.transferSize,
          contentSize: asset.contentSize
        });
      });
      return {
        score: 0,
        offending,
        advice:
          `The total transfer size of the page is ${util.formatBytes(page.transferSize)}, which exceeds the recommended limit of ${util.formatBytes(sizeLimit)}. ${
          page.transferSize > 5000000
            ? 'This is significantly larger than acceptable and requires immediate optimization.'
            : 'The page size is quite large and should be reduced to improve performance.'
}`

      };
    }
    return {
      score: 100,
      offending: [],
      advice: ''
    };
  }
};
