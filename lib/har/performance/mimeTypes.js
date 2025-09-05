'use strict';
const util = require('../util');

module.exports = {
  id: 'mimeTypes',
  title: 'Avoid incorrect MIME types',
  description:
    `<p>Serving resources with incorrect or missing MIME types can lead to unpredictable behavior. When the browser is forced to guess the content type, it may incorrectly interpret the resource, which can lead to rendering issues or even introduce security vulnerabilities.</p>
    <p>Always ensure that the Content-Type header accurately reflects the file format being served.</p>`,
  weight: 0,
  tags: ['performance', 'bestpractice'],
  processPage: function (page) {
    let score = 100;
    let offending = [];
    page.assets.forEach(function (asset) {
      if (asset.type == 'other' && asset.status > 199 && asset.status < 300) {
        score--;
        offending.push(asset.url);
      }
    });
    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page has ${util.plural(offending.length, 'misconfigured MIME type')}. Ensure that all resources are served with correct and consistent content-type headers to prevent misinterpretation by the browser.`
          : ''
    };
  }
};
