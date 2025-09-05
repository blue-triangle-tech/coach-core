'use strict';

module.exports = {
  id: 'documentRedirect',
  title: 'Avoid redirecting the main document',
  description:
  `<p>Redirecting the main document introduces additional delay before the page can start loading, which negatively impacts performance. Ideally, users should be directed to the correct final URL without intermediate redirects.</p>
  <p>One exception is upgrading users from HTTP to HTTPS, which is a necessary and recommended security practice. In all other cases, avoid unnecessary redirects of the main document to ensure a faster loading experience.</p>`,
  weight: 9,
  tags: ['performance'],
  processPage: function (page) {
    let score = page.documentRedirects > 0 ? 0 : 100;
    let advice =
      page.documentRedirects > 0 ? 
        `The main document is redirected ${page.documentRedirects} time(s). To improve performance, remove unnecessary redirects and point users directly to the final destination.`
        : '';
    // if a HTTP redirects to HTTPS don't hurt that because that is
    // really nice :)
    if (page.documentRedirects === 1 && page.url !== page.finalUrl) {
      // do we redirect to an HTTP page?
      if (
        page.url.indexOf('http:') > -1 &&
        page.finalUrl.indexOf('https') > -1
      ) {
        advice = `The page redirects from HTTP to HTTPS. This is a recommended and secure practice.`;
        score = 100;
      }
    }

    return {
      score: score,
      offending: page.redirectChain,
      advice: advice
    };
  }
};
