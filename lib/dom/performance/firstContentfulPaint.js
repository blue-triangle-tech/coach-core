(function (util) {
  'use strict';
  let score = 100;
  let advice = '';
  const good = 1800;
  const needImprovement = 3000;

  const fcpArray = performance.getEntriesByName('first-contentful-paint');
  if (fcpArray.length > 0) {
    const fcp = fcpArray[0].startTime;
    if (fcp <= good) {
      `FCP is Good: ${util.ms(fcp)}.`;
    } else if (fcp <= needImprovement) {
      score = 50;
      advice = `FCP Needs Improvement: (${util.ms(
        fcp
      )}). Consider optimizing render-blocking resources and server response time.`;
    } else {
      score = 0;
      advice = `FCP is Poor: (${util.ms(
        fcp
      )}). Improvements may be needed in server performance, resource prioritization, or critical rendering path optimizations.`;

      let t = window.performance.getEntriesByType('navigation')[0];
      if (t) {
        if (Number(t.responseStart.toFixed(0)) > 1000) {
          advice += `The Time to First Byte (TTFB) is high at ${util.ms(
            t.responseStart
          )}. Reducing server response time can help improve First Contentful Paint.`;
        }
      }
    }
  } else {
    advice = 'There was no FCP measured for this paint.';
  }
  return {
    id: 'firstContentfulPaint',
    title: 'Optimize First Contentful Paint (FCP)',
    description:
      'First Contentful Paint (FCP) measures the time it takes for the browser to display the first visible element after the page starts loading. This includes text, images (including background images), svg elements, or canvas elements that are not completely white. A faster FCP helps users see that the page is loading and improves their overall experience.',
    advice: advice,
    score: Math.max(0, score),
    weight: 7,
    offending: [],
    tags: ['performance']
  };
})(util);
