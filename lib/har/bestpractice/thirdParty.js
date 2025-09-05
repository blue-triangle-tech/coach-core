'use strict';

const util = require('../util');

module.exports = {
  id: 'thirdParty',
  title: 'Avoid excessive third-party requests',
  description: `<p>Relying heavily on third-party resources can lead to slower load times, reduced control over performance, and increased security or privacy risks. Where possible, serve key assets such as scripts, styles, and fonts from your own domain.</p>
  <p>Minimizing third-party dependencies helps improve load consistency, reduces network latency, and gives you better control over caching and reliability.</p>`,
  weight: 7,
  tags: ['bestpractice'],
  processPage: function (page) {
    let score = 100;
    let advice = '';
    const firstPartyRequests = page.firstParty.requests;
    const thirdPartyRequests = page.thirdParty.requests;
    const firstPartyTransferSizeBytes = page.firstParty.transferSize;
    const thirdPartyTransferSizeBytes = page.thirdParty.transferSize;
    const firstPartySize = util.formatBytes(firstPartyTransferSizeBytes);
    const thirdPartySize = util.formatBytes(thirdPartyTransferSizeBytes);

    const thirdPartyPercent =
      thirdPartyRequests > 0
        ? (thirdPartyRequests / (firstPartyRequests + thirdPartyRequests)) * 100
        : 0;

    if (thirdPartyRequests > firstPartyRequests) {
      score -= 50;
      advice =
        `The page makes more requests to third-party domains (${thirdPartyRequests} requests, ${thirdPartySize}) than to first-party domains (${firstPartyRequests} requests, ${firstPartySize}). Consider reducing third-party dependencies.`;
    } else if (thirdPartyPercent > 10) {
      score -= 50;
      advice =
        `Approximately ${Math.round(thirdPartyPercent)}% of requests are made to third-party domains (${thirdPartyRequests} requests, ${thirdPartySize}). In comparison, first-party requests account for ${firstPartyRequests} requests and ${firstPartySize}.`;
    }

    if (thirdPartyTransferSizeBytes > firstPartyTransferSizeBytes) {
      score -= 50;
      advice +=
        ` The page transfers more data from third-party domains (${thirdPartySize}) than from first-party sources (${firstPartySize}). Review third-party content to optimize performance.`;
    }

    if (advice !== '') {
      advice +=
        ` The regular expression "${page.firstPartyRegEx}" was used to determine first-party versus third-party requests.`;
    }

    return {
      score: Math.max(0, score),
      offending: [],
      advice: advice
    };
  }
};
