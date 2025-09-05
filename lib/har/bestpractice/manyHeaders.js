'use strict';

const util = require('../util');

module.exports = {
  id: 'manyHeaders',
  title: 'Avoid sending an excessive number of response headers',
  description: `<p>Sending too many response headers can increase the size of HTTP responses and introduce unnecessary complexity. This may impact performance, especially on constrained networks or older clients. Ensure that only essential headers are included in the response to keep payloads lean and manageable.</p>`,
  weight: 1,
  tags: ['bestpractice', 'headers'],
  processPage: function (page) {
    const offending = [];
    let score = 100;
    let advice = '';
    page.assets.forEach(function (asset) {
      const maxHeaders = 30;
      // Report responses with more than 30 headers
      if (Object.keys(asset.headers.response).length > maxHeaders) {
        offending.push(asset.url);
        score -= 1;
        advice +=
         `${util.shortURL(asset.url)} includes ${util.plural(Object.keys(asset.headers.response).length, 'response header')}. Review the response and remove any headers that are not required.`;
      }
    });
    return {
      score: Math.max(0, score),
      offending: offending,
      advice: advice
    };
  }
};
