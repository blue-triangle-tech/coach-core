'use strict';

let util = require('../util');

module.exports = {
  id: 'headerSize',
  title: "Keep response headers small on HTTP/1",
  description:
  `<p>With HTTP/1, response headers are not compressed. Large headers - often caused by excessive cookies or unnecessary metadata - can increase data transfer size and slow down requests. To improve efficiency, minimize the number and size of cookies and avoid sending redundant or unused header fields.</p>
  <p>For HTTP/2 and HTTP/3, header compression is built in. However, performance may still be affected by header bloat, so it’s still worth reviewing and optimizing header content where possible.</p>`,
  weight: 4,
  tags: ['performance', 'mobile'],
  processPage: function (page) {
    // H2 sends headers compressed and we don't get the right size now
    // so it's better just to skip those
    if (util.isHTTP2(page)) {
      return {
        score: 100,
        offending: [],
        advice:
          `The page uses an HTTP/2 connection, and headers are sent compressed. This helps reduce overhead. Header size analysis is not currently supported.`
      };
    } else if (util.isHTTP3(page)) {
      return {
        score: 100,
        offending: [],
        advice:
          `The page uses an HTTP/3 connection, and headers are sent compressed. This helps reduce overhead. Header size analysis is not currently supported.`
      };
    } else {
      let limit = 20000;
      let score = 100;
      let offending = [];
      page.assets.forEach(function (asset) {
        if (asset.headerSize > limit) {
          offending.push(asset.url);
          score -= 10;
        }
      });
      return {
        score: Math.max(0, score),
        offending: offending,
        advice:
          score < 100
            ? `The page has ${util.plural(offending.length, 'response')} with headers larger than ${util.formatBytes(limit)}. Review and minimize cookies or other unnecessary header data to reduce transfer size on HTTP/1.`
            : ''
      };
    }
  }
};
