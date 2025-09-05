'use strict';
module.exports = {
  id: 'cpuTimeSpentInScripting',
  title: 'Avoid excessive JavaScript execution time',
  description:
  `<p>Executing large amounts of JavaScript can delay page load, block rendering, and reduce responsiveness. While this measurement varies based on device performance, spending more than 1000 milliseconds on script execution is considered excessive and may negatively impact the user experience.</p>
  <p>Optimize scripts by minimizing unused code, deferring non-critical functionality, and reducing complex logic on page load.</p>`,
  weight: 7,
  tags: ['performance', 'JavaScript'],
  processPage: function (page) {
    if (page.cpu && page.cpu.categories) {
      // 1000 ms limit, it's high!
      const limit = 1000;
      if (page.cpu.categories.Scripting >= limit) {
        const offending = [];
        for (let name of Object.keys(page.cpu.events)) {
          offending.push(name + ':' + page.cpu.events[name] + ' ms');
        }
        return {
          score: 0,
          offending: offending,
          advice:
            `The page spent ${page.cpu.categories.Scripting} ms executing JavaScript, which exceeds the recommended threshold.`
        };
      } else {
        return {
          score: 100,
          offending: [],
          advice: ''
        };
      }
    } else {
      return {
        score: 100,
        offending: [],
        advice:
          `CPU execution time data is only available when the page is tested in a browser that supports detailed performance profiling.`
      };
    }
  }
};
