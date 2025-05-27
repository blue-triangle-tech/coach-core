'use strict';
module.exports = {
  id: 'cpuTimeSpentInRendering',
  title: 'Avoid excessive CPU time spent on rendering',
  description:
  `<p>Efficient rendering is essential for delivering a responsive experience. If the browser spends too much time rendering, it can delay interactivity and negatively impact perceived performance.</p>
  <p>This metric is device-dependent but generally, rendering should complete within 500 milliseconds. Higher durations may indicate layout thrashing, inefficient styles, or complex visual structures that need optimization.</p>`,
  weight: 7,
  tags: ['performance', 'CSS'],
  processPage: function (page) {
    if (page.cpu && page.cpu.categories) {
      // 500 ms limit, it's high!
      const limit = 500;
      if (page.cpu.categories.Rendering >= limit) {
        const offending = [];
        for (let name of Object.keys(page.cpu.events)) {
          offending.push(name + ':' + page.cpu.events[name] + ' ms');
        }
        return {
          score: 0,
          offending: offending,
          advice:
            `The page spent ${page.cpu.categories.Rendering} ms rendering content, which exceeds the recommended threshold.`
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
          `CPU rendering time data is only available when the page is tested in a browser that provides performance profiling.`
      };
    }
  }
};
