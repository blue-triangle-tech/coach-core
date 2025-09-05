'use strict';

module.exports = {
  id: 'contentSecurityPolicyHeader',
  title:
    'Use a Content-Security-Policy header to protect against XSS',
  description:
    `<p>A Content-Security-Policy (CSP) header defines which sources of content are allowed to load on a page. By restricting scripts, styles, images, and other assets to trusted origins, CSP provides a strong defense against Cross-Site Scripting (XSS) and other injection attacks.</p>
    <p>CSP is widely supported across modern browsers and can be deployed with minimal changes to existing infrastructure. For testing and gradual rollout, you can begin with a Content-Security-Policy-Report-Only header, which logs violations without blocking content.</p>`,
  weight: 5,
  tags: ['privacy', 'bestpractice', 'headers'],
  processPage: function (page) {
    const offending = [];
    let score = 0;
    let advice = '';
    const finalUrl = page.finalUrl;
    page.assets.forEach(function (asset) {
      if (asset.url === finalUrl) {
        if (asset.headers.response['content-security-policy']) {
          const maxLength = 150;
          if (
            asset.headers.response['content-security-policy'].length > maxLength
          ) {
            score = 50;
            advice =
             `The site uses a Content-Security-Policy header - good. However, it is lengthy (${asset.headers.response['content-security-policy'].length} characters), which may suggest a high number of third-party sources. Consider tightening the policy to reduce exposure and improve user security.`;
          } else {
            score = 100;
          }
        } else {
          offending.push(asset.url);
        }
      }
    });
    if (score === 0) {
      advice =
        `The page does not use a Content-Security-Policy header. Set a CSP header to reduce the risk of Cross-Site Scripting (XSS) and other injection attacks. You may start with a Content-Security-Policy-Report-Only header to test for violations without blocking content. Create a CSP using Blue Triangle's CSP Manager.`;
    }
    return {
      score: score,
      offending: offending,
      advice: advice
    };
  }
};
