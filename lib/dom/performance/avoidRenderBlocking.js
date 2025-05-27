(function (util) {
  'use strict';

  const offending = [];
  const styles = util.getCSSFiles(document.head);
  const scripts = util.getSynchJSFiles(document.head);
  const docDomain = document.domain;
  const domains = [];
  // TODO does preconnect really matter when you are inside of head?
  const preconnects = util.getResourceHintsHrefs('preconnect');
  const preconnectDomains = preconnects.map(function (preconnect) {
    return util.getHostname(preconnect);
  });
  let blockingCSS = 0;
  let blockingJS = 0;
  let message = '';
  let score = 0;

  function testByType(assetUrl) {
    const domain = util.getHostname(assetUrl);
    // if it is from different domain or not
    if (domain !== docDomain) {
      offending.push(assetUrl);
      // is this the first time this domain is used?
      if (!util.exists(domain, domains)) {
        // hurt depending on if it's preconnected or not
        score += util.exists(domain, preconnectDomains) ? 5 : 10;
        domains.push(domain);
      }
      score += 5;
    } else {
      offending.push(assetUrl);
      score += 5;
    }
  }

  // TODO do we have a way to check if we different domains act as one for H2?
  // know we don't even check it
  if (util.isHTTP2()) {
    if (styles.length > 0) {
      message = '';
      // check the size
      styles.forEach(function (url) {
        if (util.getTransferSize(url) > 14500) {
          offending.push(url);
          score += 5;
          blockingCSS++;
          message +=
          `The stylesheet at ${url} exceeds the recommended TCP window size of 14.5 kB. Reducing its size can help improve page rendering performance.`
          }
      });
    }
    if (scripts.length > 0) {
      score += scripts.length * 10;
      scripts.forEach(function (url) {
        offending.push(url);
        blockingJS++;
      });
      message +=
        "Avoid loading synchronous JavaScript in the head section. Rendering should not depend on JavaScript whenever possible.";
    }
  } else if (util.isHTTP3()) {
    // Recommendations for HTTP3 to come
  } else {
    // we are using HTTP/1
    styles.forEach(function (style) {
      testByType(style);
    });
    blockingCSS = styles.length;
    scripts.forEach(function (script) {
      testByType(script);
    });
    blockingJS = scripts.length;
  }

  if (offending.length > 0) {
    message += `The page has ${util.plural(
      blockingCSS,
      'render blocking CSS request'
    )} and ${util.plural(
      blockingJS,
      'blocking JavaScript request'
    )} inside of head.`;
  }

  return {
    id: 'avoidRenderBlocking',
    title: 'Minimize delays in the critical rendering path',
    description:
      `<p>The critical rendering path refers to the sequence of steps the browser takes to render the initial view of a page. Resources requested within the <head> can delay this process, as each request must be resolved before rendering can begin.</p>
      <p>To optimize performance:</p>
      <ul>
      <li>Avoid loading JavaScript synchronously in the head. Rendering should not depend on JavaScript execution.</li>
      <li>Serve resources from the same domain as the main document to reduce DNS lookup overhead.</li>
      <li>Inline critical CSS to shorten the rendering path and accelerate the initial page load.</li>
      </ul>`,
    advice: message,
    score: Math.max(0, 100 - score),
    weight: 10,
    offending: offending,
    tags: ['performance']
  };
})(util);
