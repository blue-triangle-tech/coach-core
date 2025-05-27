(function () {
  'use strict';

  let score = 100;
  let message = '';
  const docType = document.doctype;

  if (docType === null) {
    message = `The page is missing a doctype declaration. To ensure standards-compliant rendering, add <!DOCTYPE html> at the beginning of the document.`;
    score = 0;
  } else if (
    !(
      docType.name.toLowerCase() === 'html' &&
      (docType.systemId === '' ||
        docType.systemId.toLowerCase() === 'about:legacy-compat')
    )
  ) {
    message =
      `The page does not use the HTML5 doctype. For consistent behavior across browsers, use <!DOCTYPE html>.`;
    score = 25;
  }

  return {
    id: 'doctype',
    title: 'Declare a doctype in your document',
    description:
     `<p>The !DOCTYPE declaration informs the browser which version of HTML the page is using. This helps the browser render the page in standards mode rather than quirks mode, ensuring consistent behavior across different environments.</p>
      <p>For modern web development, always use the HTML5 doctype.</p>`,
    advice: message,
    score: score,
    weight: 2,
    offending: [],
    tags: ['bestpractice']
  };
})();
