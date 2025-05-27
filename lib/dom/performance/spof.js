(function (util) {
  'use strict';

  const offending = [];
  const offendingDomains = [];
  // simplify and only look for css & js spof
  const docDomain = document.domain;
  // do we have any CSS loaded inside of head from a different domain?
  const styles = util.getCSSFiles(document.head);
  let score = 0;

  styles.forEach(function (style) {
    const styleDomain = util.getHostname(style);
    if (styleDomain !== docDomain) {
      offending.push(style);
      if (offendingDomains.indexOf(styleDomain) === -1) {
        offendingDomains.push(styleDomain);
        score += 10;
      }
    }
  });

  // do we have any JS loaded inside of head from a different domain?
  const scripts = util.getSynchJSFiles(document.head);

  scripts.forEach(function (script) {
    const scriptDomain = util.getHostname(script);
    if (scriptDomain !== docDomain) {
      offending.push(script);
      if (offendingDomains.indexOf(scriptDomain) === -1) {
        offendingDomains.push(scriptDomain);
        score += 10;
      }
    }
  });

  return {
    id: 'spof',
    title: 'Avoid front-end single points of failure',
    description:
    `<p>A single point of failure (SPOF) on the front end can prevent a page from rendering if a critical resource, such as a JavaScript file, CSS file, or font, fails to load or loads too slowly. This often results in an empty or non-interactive page for the user. To mitigate this risk, avoid loading blocking resources - especially external ones - synchronously in the head section of the document.</p>
    <p>Instead, load non-critical assets asynchronously or defer them to ensure the page remains responsive and resilient under varying network conditions.</p>`,
    advice:
      offending.length > 0
        ? `The page includes ${util.plural(offending.length, 'resource')} in the head section that may introduce a single point of failure. Consider loading these resources asynchronously or moving them outside the document head to reduce blocking risk.`
        : '',
    score: Math.max(0, 100 - score),
    weight: 7,
    offending: offending,
    tags: ['performance', 'css', 'js']
  };
})(util);
