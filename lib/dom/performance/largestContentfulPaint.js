(function (util) {
  'use strict';
  let score = 100;
  let advice = '';
  const offending = [];
  const supported = PerformanceObserver.supportedEntryTypes;
  if (!supported || supported.indexOf('largest-contentful-paint') === -1) {
    advice = 'Largest contentful paint is not supported in this browser';
  } else {
    const observer = new PerformanceObserver(() => {});
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    const entries = observer.takeRecords();
    if (entries.length > 0) {
      const largestEntry = entries[entries.length - 1];
      const good = 2500;
      const needImprovement = 4000;

      const lcp = {
        url: largestEntry.url,
        renderTime: Number(
          Math.max(largestEntry.renderTime, largestEntry.loadTime).toFixed(0)
        ),
        tagName: largestEntry.element ? largestEntry.element.tagName : '',
        tag: largestEntry.element
          ? largestEntry.element.cloneNode(false).outerHTML
          : ''
      };
      if (lcp.renderTime <= good) {
        `Largest contentful paint is good ${util.ms(lcp.renderTime)}.`;
      } else if (lcp.renderTime <= needImprovement) {
        score = 80;
        advice = `LCP Needs Improvement: ${util.ms(lcp.renderTime)}. Optimizing image loading or server response time may help.`;
        offending.push(lcp.url || lcp.tag);
      } else if (lcp.renderTime > needImprovement) {
        score = 0;
        advice = `LCP is Poor: ${util.ms(lcp.renderTime)}. Consider prioritizing the largest image or text block and reducing critical load bottlenecks.`;
        offending.push(lcp.url || lcp.tag);
      }

      if (lcp.tagName === 'IMG') {
        if (largestEntry.element.fetchPriority != 'high') {
          score -= 5;
          advice +=
            ' Consider adding fetchpriority="high" to the LCP image to improve load prioritization in supported browsers like Chrome.';
        }
        if (largestEntry.element.loading === 'lazy') {
          score -= 20;
          advice +=
            ' The LCP image is being lazy-loaded using the "loading=lazy" attribute. This can delay rendering and should be avoided for the primary visual element.';
        }
      }
    }
  }

  return {
    id: 'largestContentfulPaint',
    title: 'Optimize Largest Contentful Paint (LCP)',
    description:
      `Largest Contentful Paint (LCP) is a core Google Web Vital that measures how long it takes for the largest visible image or text block within the viewport to render, starting from the moment the page begins loading. To meet Google's performance standards, the LCP element should appear within 2.5 seconds. Times above 4.0 seconds are considered poor and may negatively impact user experience and search rankings.`,
    advice: advice,
    score: Math.max(0, score),
    weight: 7,
    offending: offending,
    tags: ['performance']
  };
})(util);
