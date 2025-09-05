'use strict';

let util = require('../util');

module.exports = {
  id: 'fewRequestsPerDomain',
  title: 'Avoid excessive requests per domain on HTTP/1',
  description:
    `<p>Under HTTP/1, browsers limit the number of concurrent connections per domain. If too many requests are made to the same domain, additional requests are queued, which can delay loading and impact performance.</p>
    <p>To improve load efficiency under HTTP/1, reduce the number of requests per domain or consider upgrading to HTTP/2 or HTTP/3, where multiplexing allows more flexible handling of concurrent resource loading. However, performance on HTTP/2 and HTTP/3 may still vary depending on server configuration and request prioritization. Always review loading behavior using network waterfall data to ensure efficient delivery.</p>`,
  weight: 5,
  tags: ['performance', 'HTTP/1'],
  processPage: function (page) {
    let limit = 30;
    if (util.isHTTP2(page)) {
      return {
        score: 100,
        offending: [],
        advice:
          `While HTTP/2 allows multiplexing, performance can still vary depending on how requests are prioritized and delivered. Review network trace data to verify resource loading behavior.`
      };
    } else if (util.isHTTP3(page)) {
      return {
        score: 100,
        offending: [],
        advice:
          `HTTP/3 is still evolving, and best practices are not yet fully established. Monitor performance and review resource delivery in network trace data to ensure efficient behavior.`
      };
    }

    const infoPerDomain = page.domains;
    let offending = [];
    let domainAndRequests = {};
    let score = 100;
    let advice = '';
    Object.keys(infoPerDomain).reduce((result, domain) => {
      if (infoPerDomain[domain].requests > limit) {
        score -= 10;
        offending.push(domain);
        domainAndRequests[domain] = infoPerDomain[domain].requests;
      }
      return domainAndRequests;
    });

    if (score < 100) {
      advice =
        `The page includes ${util.plural(offending.length, 'domain')} serving more than ${limit} requests each. Reducing the number of requests per domain can help improve loading performance under HTTP/1.`;

      Object.keys(domainAndRequests).forEach(function (domain) {
        advice +=
          domain +
          ' got ' +
          util.plural(domainAndRequests[domain], 'request') +
          '. ';
      });
      advice += `To improve performance, consider reducing requests per domain or transitioning to HTTP/2 or HTTP/3 where appropriate.`;
    }

    return {
      score: Math.max(0, score),
      offending: offending,
      advice: advice
    };
  }
};
