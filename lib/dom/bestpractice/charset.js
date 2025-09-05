(function () {
  'use strict';

  let score = 100;
  let message = '';
  const charSet = document.characterSet;

  if (charSet === null) {
    message =
      `The page is missing a declared character set. This can cause inconsistent text rendering across browsers. Include a <meta charset="UTF-8"> tag in the document head.`;
    score = 0;
  } else if (charSet !== 'UTF-8') {
    message = `The document does not specify UTF-8 as the character encoding. Using UTF-8 ensures reliable handling of multilingual and special characters.`;
    score = 50;
  }

  return {
    id: 'charset',
    title: 'Declare a character encoding in your document',
    description:
      `<p>Declaring a character encoding, such as UTF-8, ensures that the browser interprets and displays text correctly. UTF-8 is the recommended standard as it supports a wide range of characters, punctuation, and symbols across multiple languages.</p>
      <p>Omitting the character set can lead to unpredictable rendering or encoding issues, particularly for international or special characters.</p>`,
    advice: message,
    score: score,
    weight: 2,
    offending: [],
    tags: ['bestpractice']
  };
})();
