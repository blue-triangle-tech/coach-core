(function (util) {
  'use strict';

  const offending = [];
  const links = document.getElementsByTagName('link');

  for (let i = 0, len = links.length; i < len; i++) {
    if (links[i].media === 'print') {
      offending.push(util.getAbsoluteURL(links[i].href));
    }
  }

  const score = offending.length * 10;

  return {
    id: 'cssPrint',
    title: 'Avoid loading dedicated print stylesheets',
    description:
      'Loading a separate stylesheet specifically for print adds unnecessary overhead, even if it’s not used during normal page loads. Instead, include print-specific styles within your main CSS file using an @media print query. This approach reduces additional HTTP requests and improves load performance.',
    advice:
      offending.length > 0
        ? `The page includes ${util.plural(offending.length, 'print stylesheet')}. Consider using @media print within your main stylesheet instead to reduce unnecessary resource loading.`
        : '',
    score: Math.max(0, 100 - score),
    weight: 1,
    offending: offending,
    tags: ['performance', 'css']
  };
})(util);
