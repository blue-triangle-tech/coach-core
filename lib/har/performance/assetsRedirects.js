'use strict';

let util = require('../util');

var redirect = [301, 302, 303, 305, 306, 307];

function isRedirect(asset) {
  return redirect.indexOf(asset.status) > -1;
}

module.exports = {
  id: 'assetsRedirects',
  title: 'Avoid unnecessary redirects',
  description:
    `<p>Redirects add extra network requests and delay the loading of resources, which can negatively affect page performance. This impact is even more pronounced on slower connections or mobile devices. To improve load times, minimize or eliminate redirects, particularly those from your own domain.</p>
    <p>Audit both first-party and third-party requests to identify and address avoidable redirect chains.</p>`,
  weight: 2,
  tags: ['performance'],
  processPage: function (page) {
    let score = 100;
    let offending = [];
    let sameDomainAsDocument = 0;
    page.assets.forEach(function (asset) {
      // skip the main document if that is redirected
      // it's caught the ine documentRedirect advice
      if (page.url !== asset.url && isRedirect(asset)) {
        offending.push(asset.url);
        score -= 10;
        if (page.baseDomain === util.getHostname(asset.url)) {
          sameDomainAsDocument++;
        }
      }
    });

    return {
      score: Math.max(0, score),
      offending: offending,
      advice:
        score < 100
          ? `The page has ${util.plural(offending.length, 'redirect')}. ${
            sameDomainAsDocument > 0 ? 
            `${sameDomainAsDocument} of these originate from the base domain and should be resolved. ` 
            : ''
          }${
            offending.length > sameDomainAsDocument ? 
            `${util.plural(offending.length - sameDomainAsDocument,'redirect')} originate from other domains and may be related to external assets. Consider reviewing third-party integrations for unnecessary redirects.` 
            : ''}`
        : ''
    };
  }
};
