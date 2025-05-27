'use strict';

module.exports = {
  id: 'avoidRenderBlocking',
  title: 'Avoid slowing down the critical rendering path',
  description:
  `<p>The critical rendering path refers to the sequence of steps the browser takes to render visible content on the screen. Each blocking resource, such as a JavaScript or CSS file requested in the head, can delay this process and slow down the time to first paint.</p>
  <p>To optimize the rendering path:</p>
  <ul>
  <li>Avoid loading synchronous JavaScript in the head.</li>
  <li>Use inlined CSS for above-the-fold content to reduce blocking.</li>
  <li>Serve assets from the same domain to minimize DNS lookups and connection setup delays.</li>
  <li>Combine or defer non-critical resources to prevent unnecessary blocking.</li>
  </ul>`,
  weight: 10,
  tags: ['performance'],
  processPage: function (page, domAdvice, options) {
    let score = 100;
    let advice = '';
    let blockingJS = 0;
    let blockingCSS = 0;
    const blockingResources = [];
    const potentiallyBlockingResources = [];

    if (
      (options.browser && options.browser === 'chrome') ||
      options.browser === 'edge'
    ) {
      if (page.renderBlocking && Object.keys(page.renderBlocking).length > 0) {
        // we use Chrome(ium) and have render blocking info
        advice = '';
        for (let asset of page.assets) {
          if (
            (asset.renderBlocking && asset.renderBlocking === 'blocking') ||
            asset.renderBlocking === 'in_body_parser_blocking'
          ) {
            if (asset.type === 'javascript') {
              blockingJS++;
              blockingResources.push(asset.url);
            } else if (asset.type === 'css') {
              blockingCSS++;
            }
          } else if (
            asset.renderBlocking &&
            asset.renderBlocking === 'potentially_blocking'
          ) {
            potentiallyBlockingResources.push(asset.url);
          }
        }
        advice =
          `The page has ${page.renderBlocking.blocking} blocking requests and ${page.renderBlocking.in_body_parser_blocking} blocking requests within the body parsing phase (${blockingJS} JavaScript and ${blockingCSS} CSS).
            ${(page.renderBlocking.potentiallyBlocking > 0 ?
              ` There are ${page.renderBlocking.potentiallyBlocking} potentially render-blocking requests. Review the following to determine if they delay rendering: ${potentiallyBlockingResources.join(', ')}.`
              : '')}`;

        score = Math.max(
          0,
          100 - (blockingJS * 10 + page.renderBlocking.potentiallyBlocking)
        );
      }
      if (advice === '' && blockingCSS === 0) {
        advice = 'No render-blocking resources were detected.';
      } else if (advice === '' && blockingCSS === 1) {
        advice =
          'One render-blocking CSS file was found. Inlining critical styles could speed up the initial render, but evaluate whether it may impact long-term performance or caching.';
      } else if (advice === '' && blockingCSS > 1) {
        advice = `There are ${blockingCSS} render-blocking CSS files. Consider combining or inlining them to reduce delays in the initial render.`;
      }
      return {
        score: score,
        offending: blockingResources,
        advice: advice
      };
    } else {
      return {};
    }
  }
};
