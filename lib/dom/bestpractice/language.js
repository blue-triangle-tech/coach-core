(function () {
  'use strict';

  const html = document.getElementsByTagName('html');
  const language = html[0].getAttribute('lang');
  let score = 100;
  let message = '';

  if (html.length > 0) {
    if (language === null) {
      score = 0;
      message =
        `The page is missing a language attribute in the <html> tag. Define it using <html lang="YOUR_LANGUAGE_CODE"> to improve accessibility and content interpretation.`;
    }
  } else {
    score = 0;
    message = `The page does not include an <html> tag. Ensure that the document structure begins with a valid <html> element and includes a lang attribute.`;
  }

  return {
    id: 'language',
    title: 'Declare a language for your document',
    description:
    `<p>Declaring the primary language of a document using the lang attribute in the html tag helps browsers, screen readers, and search engines interpret the content correctly. It improves accessibility and enables accurate language-specific processing.</p>`,
    advice: message,
    score: score,
    weight: 3,
    offending: [],
    tags: ['bestpractice']
  };
})();
