'use strict';

module.exports = {
  id: 'strictTransportSecurityHeader',
  title:
    'Set a Strict-Transport-Security header',
  description:
  `<p>The Strict-Transport-Security (HSTS) header instructs browsers to only access a site over HTTPS for a specified period of time. This helps protect against protocol downgrade attacks and ensures all future requests are made securely, without falling back to HTTP.</p>
    <p>For maximum effectiveness, the header should:</p>
    <ul>
    <li>Include a max-age directive of at least six months (15768000 seconds).</li>
    <li>Include the includeSubDomains directive if applicable.</li>
    <li>Optionally use preload if submitting to browser preload lists.</li>
    </ul>`,
  weight: 6,
  tags: ['headers', 'privacy'],
  processPage: function (page) {
    const offending = [];
    let score = 100;
    let advice = '';
    const finalUrl = page.finalUrl;
    if (finalUrl.indexOf('https://') > -1) {
      score;
      page.assets.forEach(function (asset) {
        if (asset.url === finalUrl) {
          const headers = asset.headers.response;
          if (headers['strict-transport-security']) {
            score = 100;
            const h = headers['strict-transport-security'][0];
            if (h.indexOf('includeSubDomains') === -1) {
              score = 90;
              advice =
                `The Strict-Transport-Security header is set, but the "includeSubDomains" directive is missing. Consider adding it to ensure full coverage.`;
            }
            if (h.indexOf('max-age=') === -1) {
              score = 0;
              advice =
                `The Strict-Transport-Security header is present but missing a "max-age" directive. The header is incomplete and not correctly configured.`;
            } else {
              const parts = h.split(';');
              if (parts[0].startsWith('max-age=')) {
                const time = parts[0].substring(
                  parts[0].indexOf('=') + 1,
                  parts[0].length
                );
                const minSixMonth = 15768000;
                if (time < minSixMonth) {
                  score -= 20;
                  advice +=
                    ` The "max-age" value is lower than six months. Increase it to at least 15768000 seconds for improved security.`;
                }
              }
            }
          } else {
            offending.push(asset.url);
          }
        }
      });
    }
    if (score === undefined) {
      advice =
        `The site does not use a Strict-Transport-Security header. Set one to ensure all future connections are made securely over HTTPS.`;
      score = 0;
    }
    return {
      score: score,
      offending: offending,
      advice: advice
    };
  }
};
