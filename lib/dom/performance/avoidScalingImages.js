(function (util) {
  'use strict';

  const minLimit = 100;
  const offending = [];
  const images = Array.prototype.slice.call(
    document.getElementsByTagName('img')
  );
  let score = 0;
  let message = '';

  for (let i = 0, len = images.length; i < len; i++) {
    const img = images[i];

    // skip svg images and images that are 0 (carousel etc)
    if (img.clientWidth + minLimit < img.naturalWidth && img.clientWidth > 0) {
      // message = message + ' ' + util.getAbsoluteURL(img.currentSrc) + ' [browserWidth:' + img.clientWidth + ' naturalWidth: ' + img.naturalWidth +']';
      offending.push(util.getAbsoluteURL(img.currentSrc));
      score += 10;
    }
  }

  if (score > 0) {
    message = `The page includes ${util.plural(score / 10, 'image')} scaled by more than ${minLimit} pixels. Consider serving appropriately sized images to avoid unnecessary browser-side scaling.`;
  }

  return {
    id: 'avoidScalingImages',
    title: "Avoid browser-side image scaling",
    description:
      `<p>While it’s convenient to scale images in the browser to support various devices, doing so negatively impacts performance - especially on mobile. Browser-side scaling increases CPU usage and forces users to download larger image files than necessary, resulting in wasted bandwidth and slower load times.</p>
      <p>Instead, generate multiple image sizes on the server and deliver the appropriate version based on the user's device and resolution.</p>`,
    advice: message,
    score: Math.max(0, 100 - score),
    weight: 5,
    offending: offending,
    tags: ['performance', 'image']
  };
})(util);
