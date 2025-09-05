'use strict';

const util = require('../util');

module.exports = {
  id: 'longHeaders',
  title: 'Avoid sending excessively long response headers',
  description: `<p>Response headers that are unusually long can increase payload size, reduce efficiency, and may cause issues with some proxies or intermediaries. Keep header values concise and relevant, particularly for commonly repeated headers such as cookies, custom metadata, or caching directives.</p>
    <p>Review header content to ensure it contains only necessary information and is optimized for performance.</p>`,
  weight: 1,
  tags: ['bestpractice', 'header'],
  processPage: function (page) {
    const offending = [];
    let score = 100;
    let advice = '';
    page.assets.forEach(function (asset) {
      const maxHeaderLength = 600;
      for (let headerName of Object.keys(asset.headers.response)) {
        for (let headerValue of asset.headers.response[headerName]) {
          if (headerValue.length > maxHeaderLength) {
            offending.push(asset.url);
            score -= 1;
            advice +=
              `${util.shortURL(asset.url)} includes a response header "${headerName}" that is ${headerValue.length} characters long. Consider shortening the value to reduce unnecessary overhead. `;
          }
        }
      }
    });

    return {
      score: Math.max(0, score),
      offending: offending,
      advice: advice
    };
  }
};
