'use strict';

const contact = document.querySelector('.contact');
const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
const emailLink = document.querySelector('.email-address');

// The native disclosure and all email links also work without JavaScript.
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(emailLink.textContent.trim());
    copyStatus.textContent = 'Email address copied.';
  } catch {
    // Clipboard access may be unavailable on local files or denied by the visitor.
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(emailLink);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Select and copy the address above, or use one of the email links.';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contact.open) {
    contact.open = false;
    contact.querySelector('summary').focus();
  }
});

document.addEventListener('click', (event) => {
  if (contact.open && !contact.contains(event.target)) contact.open = false;
});

contact.addEventListener('toggle', () => {
  if (!contact.open) copyStatus.textContent = '';
});

// Load animation bytes only on request; every preview is still by default.
document.querySelectorAll('.preview').forEach((preview) => {
  const image = preview.querySelector('img');
  const button = preview.querySelector('button');
  const poster = image.getAttribute('src');
  const setPlaying = (playing) => {
    image.src = playing ? image.dataset.animation : poster;
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', `${playing ? 'Stop' : 'Play'} ${button.dataset.label} preview`);
    button.textContent = playing ? 'Stop preview' : 'Play preview';
  };
  button.hidden = false;
  button.addEventListener('click', () => {
    setPlaying(button.getAttribute('aria-pressed') !== 'true');
  });
  image.addEventListener('error', () => {
    if (button.getAttribute('aria-pressed') === 'true') setPlaying(false);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && button.getAttribute('aria-pressed') === 'true') setPlaying(false);
  });
});
