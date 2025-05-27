(function (util) {
  'use strict';

  const maxLength = 155;
  let score = 100;
  let message = '';
  let metas = Array.prototype.slice.call(
    document.querySelectorAll('meta[name][content]')
  );
  metas = metas.filter(
    util.caseInsensitiveAttributeValueFilter('name', 'description')
  );
  const description = metas.length > 0 ? metas[0].getAttribute('content') : '';

  if (description.length === 0) {
    message = `The page is missing a meta description. Add a <meta name="description"> tag to provide a summary of the page content.`;
    score = 0;
  } else if (description.length > maxLength) {
    message =
      `The meta description is too long at ${description.length} characters. The recommended maximum length is ${maxLength} characters to ensure proper display in search results.`;
    score = 50;
  }

  // http://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf
  // https://d2eeipcrcdle6.cloudfront.net/seo-cheat-sheet.pdf

  return {
    id: 'metaDescription',
    title: 'Include a meta description for your page',
    description:
      `<p>A meta description provides a concise summary of a page’s content. While it does not directly impact search rankings, it can influence how your page appears in search engine results and may improve click-through rates.</p>
      <p>To ensure clarity and effectiveness, keep meta descriptions concise and relevant. The recommended length is typically under 160 characters.</p>`,
    advice: message,
    score: score,
    weight: 5,
    offending: [],
    tags: ['bestpractice']
  };
})(util);
