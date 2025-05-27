(function () {
  'use strict';

  const max = 60;
  const title = document.title;
  let score = 100;
  let message = '';

  if (title.length === 0) {
    message = `The page is missing a title element. Add a <title> tag to define the document's title and improve clarity for users and search engines.`;
    score = 0;
  } else if (title.length > max) {
    message =
     `The title is too long by ${title.length - max} characters. The recommended maximum length is ${max} characters to ensure proper display in search results and browser tabs.`;
    score = 50;
  }

  return {
    id: 'pageTitle',
    title: 'Use a concise and relevant page title',
    description:
      `<p>A page title is a critical element for both user experience and search engine indexing. It appears in browser tabs, search engine results, and link previews. A clear, concise title helps users understand the purpose of the page at a glance.</p>
      <p>To ensure readability and proper display, keep the title within the recommended length - typically under 60 characters.</p>`,
    advice: message,
    score: score,
    weight: 5,
    offending: [],
    tags: ['bestpractice']
  };
})();
