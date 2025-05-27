'use strict';
const util = require('../util');
module.exports = {
  id: 'mixedContent',
  title: 'Serve all responses over HTTPS when the page is secured',
  description:
    `<p>When a page is served over HTTPS, all embedded resources - including scripts, images, styles, and other requests - must also be delivered securely. Serving content over HTTP on an HTTPS page creates a mixed content scenario, which compromises the confidentiality and integrity of the page.</p>
    <p>To ensure full security and avoid browser warnings or blocked content, verify that all resources are loaded via HTTPS.</p>`,
  weight: 7,
  tags: ['privacy'],
  processPage: function (page) {
    const offending = [];
    let score = 100;
    let advice = '';
    const finalUrl = page.finalUrl;
    if (finalUrl.indexOf('https://') > -1) {
      page.assets.forEach(function (asset) {
        // Avoid catching redirects from http to https
        if (asset.url.indexOf('http://') > -1 && asset.url !== page.url) {
          score = 0;
          offending.push(asset.url);
        }
      });
    }
    if (score === 0) {
      advice =
        `All resources must be served over HTTPS when the main page is secure. The page includes ${util.plural(offending.length, 'response')} served over HTTP, which poses a security and privacy risk.`;
    }
    return {
      score: score,
      offending: offending,
      advice: advice
    };
  }
};
