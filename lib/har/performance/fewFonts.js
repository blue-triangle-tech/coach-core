'use strict';
const util = require('../util');

module.exports = {
  id: 'fewFonts',
  title: 'Limit the number of web font requests',
  description:
  `<p>Fonts are render-blocking resources that can delay text display and impact the user experience. Loading too many font files increases page weight and can cause visual issues such as the flash of invisible text (FOIT) or flash of unstyled text (FOUT).</p>
  <p>Only include fonts that are essential for conveying your brand or design. Consolidate font usage and limit the number of variants to reduce loading time and layout shifts.</p>`,
  weight: 2,
  tags: ['performance', 'font'],
  processPage: function (page) {
    const urls = page.assets
      .filter((asset) => asset.type === 'font')
      .map((asset) => asset.url);

    // only hurt if we got more than one font
    let score =
      urls.length > 1
        ? 100 - urls.length * 10 < 0
          ? 0
          : 100 - urls.length * 10
        : 100;

    return {
      score: score,
      offending: urls,
      advice:
        score < 100
          ? `The page includes ${util.plural(urls.length, 'font request')}. Consider reducing the number of fonts to minimize loading delays and improve rendering performance.`
          : ''
    };
  }
};
