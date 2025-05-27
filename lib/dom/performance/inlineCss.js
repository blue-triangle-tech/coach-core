(function (util) {
  'use strict';

  const offending = [];
  const cssFilesInHead = util.getCSSFiles(document.head);
  const styles = Array.prototype.slice.call(
    window.document.head.getElementsByTagName('style')
  );
  let message = '';
  let score = 0;

  // If we use HTTP/2, do CSS request in head and inline CSS
  if (util.isHTTP2() && cssFilesInHead.length > 0 && styles.length > 0) {
    score += 5;
    message =
      'The page includes both inline CSS and external CSS requests while using an HTTP/2-style connection. For users on slower networks, fully inlining critical styles may improve perceived performance. Consider testing to compare results.';
  } else if (
    util.isHTTP2() &&
    styles.length > 0 &&
    cssFilesInHead.length === 0
  ) {
    // If we got inline styles with HTTP/2
    message +=
      'The page uses inline CSS and is served over HTTP/2. If your users often access the site over slow connections, inlining may help reduce rendering delays.';
  } else if (util.isHTTP2() && cssFilesInHead.length > 0) {
    // we have HTTP/2 and do CSS requests in HEAD.
    message +=
      'Inlining CSS is generally faster than relying on external CSS files during the initial render.';
  }

  if (util.isHTTP3()) {
    message =
      'The page is delivered over HTTP/3. As best practices for HTTP/3 are still emerging, monitor performance data to determine whether inlining provides benefits in your specific case.';
  }
  // If we have HTTP/1
  else if (!util.isHTTP2()) {
    // and files served inside of head, inline them instead
    if (cssFilesInHead.length > 0 && styles.length === 0) {
      score += 10 * cssFilesInHead.length;
      message =
       `The page makes ${util.plural(cssFilesInHead.length, 'CSS request')} in the head section. Consider inlining critical styles to speed up the initial render and defer loading of non-critical styles.`;
      offending.push.apply(offending, cssFilesInHead);
    }
    // If we inline CSS and request CSS files inside of head
    if (styles.length > 0 && cssFilesInHead.length > 0) {
      score += 10;
      message +=
        `The page uses both inline styles and ${util.plural(cssFilesInHead.length, 'external CSS file')} in the head section. For better performance, consider relying solely on inlined CSS for critical content and loading the rest asynchronously.`;
      offending.push.apply(offending, cssFilesInHead);
    }
  }

  return {
    id: 'inlineCss',
    title: 'Inline CSS for faster first render',
    description:
    `<p>Inlining critical CSS can significantly improve the time it takes for a page to start rendering. While traditionally avoided for maintainability reasons, inlining is now a recommended technique for optimizing performance - particularly for users on slow or unreliable connections.</p>
    <p>For pages delivered over HTTP/1 or HTTP/2, consider inlining CSS that is required for above-the-fold content to avoid render-blocking requests. Load and cache the remaining CSS asynchronously. This strategy is especially useful for servers that prioritize HTML over CSS, as it ensures critical styles are applied without delay.</p>
    <p>With HTTP/2, results may vary based on how your server handles prioritization and whether HTTP/2 Server Push is supported. HTTP/3 introduces new variables, and best practices are still evolving. Use performance testing and waterfall charts to determine what approach works best for your specific audience and delivery stack.</p>`,
    advice: message,
    score: Math.max(0, 100 - score),
    weight: 7,
    offending: offending,
    tags: ['performance', 'css']
  };
})(util);
