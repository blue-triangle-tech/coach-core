(function (util) {
  'use strict';

  const offending = [];
  let score = 0;
  let totalDuration = 0;
  let totalBlockingTime = 0;
  let longTasksBeforeFirstContentfulPaint = 0;
  let totalDurationFirstContentFulPaint = 0;
  let advice = 'No long CPU tasks were detected on this page.';

  const supported = PerformanceObserver.supportedEntryTypes;
  if (!supported || supported.indexOf('longtask') === -1) {
    advice = 'The Long Tasks API is not supported in this browser.';
  } else {
    const longTaskObserver = new PerformanceObserver(() => {});
    longTaskObserver.observe({ type: 'longtask', buffered: true });
    const fcp =
      performance.getEntriesByName('first-contentful-paint').length > 0
        ? performance.getEntriesByName('first-contentful-paint')[0].startTime
        : undefined;

    for (let entry of longTaskObserver.takeRecords()) {
      score += 20;
      totalDuration += entry.duration;
      if (fcp && entry.startTime < fcp) {
        longTasksBeforeFirstContentfulPaint++;
        totalDurationFirstContentFulPaint += entry.duration;
      } else if (fcp && entry.startTime > fcp) {
        totalBlockingTime += entry.duration - 50;
      }
      offending.push(entry.name);
    }
  }

  return {
    id: 'longTasks',
    title: 'Avoid long tasks that block the main thread',
    description:
      `<p>Long tasks block the main thread and can cause the page to become unresponsive to user input. This often results in a visibly "frozen" interface, which degrades the user experience. These tasks typically involve heavy JavaScript execution or inefficient rendering operations.</p>
      <p>The impact of long tasks varies depending on the user's device performance.</p>`,
    advice:
      offending.length > 0
        ? `The page contains ${util.plural(offending.length, 'long task')} totaling ${util.ms(totalDuration.toFixed(0))}. The total blocking time is ${util.ms(totalBlockingTime)}${
  longTasksBeforeFirstContentfulPaint > 0
        ? `, including ${util.plural(
            longTasksBeforeFirstContentfulPaint,
            'long task'
          )} before First Contentful Paint, with a combined duration of ${util.ms(
            totalDurationFirstContentFulPaint
          )}.`
        : '.'
        } Consider profiling the main thread to locate and optimize these tasks, especially on devices that match your target audience.`
        : advice,
    score: Math.max(0, 100 - score),
    weight: 8,
    offending: offending,
    tags: ['performance', 'js']
  };
})(util);
