(function () {
  'use strict';

  const offending = [];
  let advice = `No layout shift was detected on the page.`;
  let score = 0;
  let max = 0;
  const supported = PerformanceObserver.supportedEntryTypes;
  if (!supported || supported.indexOf('layout-shift') === -1) {
    advice = 'Layout Shift is not supported in this browser';
  } else {
    // See https://web.dev/layout-instability-api
    // https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver#max-session-gap1s-limit5s
    let curr = 0;
    let firstTs = Number.NEGATIVE_INFINITY;
    let prevTs = Number.NEGATIVE_INFINITY;
    const observer = new PerformanceObserver(() => {});
    observer.observe({ type: 'layout-shift', buffered: true });
    const list = observer.takeRecords();
    for (let entry of list) {
      if (entry.hadRecentInput) {
        continue;
      }
      if (entry.startTime - firstTs > 5000 || entry.startTime - prevTs > 1000) {
        firstTs = entry.startTime;
        curr = 0;
      }
      prevTs = entry.startTime;
      curr += entry.value;
      max = Math.max(max, curr);
    }
    if (max <= 0.1) {
      score = 100;
    } else if (max > 0.25) {
      score = 0;
      advice = `CLS is Poor: ${max.toFixed(4)}. Review page behavior during load to identify and address layout instability.`;
    } else {
      score = 50;
      advice = `CLS Needs Improvement: ${max.toFixed(4)}. Evaluate layout behavior to determine whether it impacts user experience.`;
    }
  }

  return {
    id: 'cumulativeLayoutShift',
    title: 'Improve Cumulative Layout Shift (CLS)',
    description:
    `<p>Cumulative Layout Shift (CLS) is a Core Web Vital that measures the visual stability of a page. It quantifies how often elements move unexpectedly during loading or interaction. A low CLS score indicates a stable experience, while higher scores suggest a disruptive user experience.</p>
    <p>Shifts caused by late-loading images, fonts, or injected content can frustrate users. To improve CLS, reserve space for dynamic content, avoid inserting new elements above existing ones, and preload critical fonts and assets.</p>`,
    advice,
    score,
    weight: 8,
    offending,
    tags: ['bestpractice']
  };
})();
