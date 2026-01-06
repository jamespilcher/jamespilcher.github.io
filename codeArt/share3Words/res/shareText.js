// shareText.js
// Shareable text box with URL hash encoding

// --- URL-safe base64 helpers ---



function toUrlSafeBase64(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromUrlSafeBase64(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return b64;
}

function compressText(str) {
  // Simple base64 encode, URL safe
  return toUrlSafeBase64(btoa(unescape(encodeURIComponent(str))));
}
function decompressText(str) {
  try {
    return decodeURIComponent(escape(atob(fromUrlSafeBase64(str))));
  } catch (e) {
    return '';
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const shareTextElem = document.getElementById('share-text');
  const shareTextUrlElem = document.getElementById('share-text-url');
  const shareTextBtn = document.getElementById('share-text-btn');
  
  // default to current url
  shareTextUrlElem.value = location.href;

  // Auto-grow textarea height to fit content, no scrollbars
  function autoGrowTextarea() {
    shareTextElem.style.height = '1px';
    shareTextElem.style.height = (shareTextElem.scrollHeight) + 'px';
    shareTextElem.style.overflow = 'hidden';
  }
  shareTextElem.addEventListener('input', autoGrowTextarea);

  // Only allow 2 spaces (3 segments), no leading spaces, ignore double spaces, max 200 chars, remove auto full stop after double space, force lower case
  function enforceTwoSpaces(e) {
    let val = shareTextElem.value;
    // Remove leading spaces
    val = val.replace(/^\s+/, '');
    // Remove double spaces
    while (/  /.test(val)) {
      val = val.replace(/  /g, ' ');
    }
    // Remove auto full stop after double space (macOS feature)
    // If a full stop is present after a space, and the previous char is a space, remove the full stop
    val = val.replace(/( )\./g, '$1');
    // Force lower case
    val = val.toLowerCase();
    let spaceCount = (val.match(/ /g) || []).length;
    if (spaceCount > 2) {
      let parts = val.split(' ');
      val = parts.slice(0, 3).join(' ');
    }
    // Enforce max 200 characters
    if (val.length > 200) {
      val = val.slice(0, 200);
    }
    shareTextElem.value = val;
    autoGrowTextarea(); // Ensure auto-grow after enforcing
    updateTextShareUrl(); // Ensure URL is updated after enforcing
  }
  shareTextElem.addEventListener('input', enforceTwoSpaces);

  async function updateTextShareUrl() {
    // Only use up to 2 spaces (3 segments), no leading/double spaces, max 200 chars
    let text = shareTextElem.value.replace(/^\s+/, '');
    while (/  /.test(text)) {
      text = text.replace(/  /g, ' ');
    }
    text = text.split(' ').slice(0, 3).join(' ');
    if (text.length > 200) {
      text = text.slice(0, 200);
    }
    const compressed = compressText(text);
    const url = location.origin + location.pathname + '#' + compressed;
    shareTextUrlElem.value = url;
    if (location.hash !== '#' + compressed) {
      history.replaceState(null, '', '#' + compressed);
    }
  }
  shareTextElem.addEventListener('input', updateTextShareUrl);

  shareTextBtn.addEventListener('click', async () => {
    let url = shareTextUrlElem.value;
    if (navigator.share) {
      try {
        await navigator.share({ url, title: 'Shareable text!' });
      } catch (e) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      shareTextBtn.textContent = 'Copied!';
      setTimeout(() => { shareTextBtn.textContent = 'Share'; }, 1200);
    } else {
      shareTextUrlElem.select();
      document.execCommand('copy');
      shareTextBtn.textContent = 'Copied!';
      setTimeout(() => { shareTextBtn.textContent = 'Share'; }, 1200);
    }
  });

  async function loadTextFromHash() {
    const hash = location.hash.replace(/^#/, '');
    if (!hash) {
      autoGrowTextarea();
      return;
    }
    try {
      let text = decompressText(hash);
      text = text.replace(/^\s+/, '');
      while (/  /.test(text)) {
        text = text.replace(/  /g, ' ');
      }
      text = text.split(' ').slice(0, 3).join(' ');
      if (text.length > 200) {
        text = text.slice(0, 200);
      }
      shareTextElem.value = text;
      updateTextShareUrl();
      autoGrowTextarea();
    } catch (e) {
      autoGrowTextarea();
    }
  }

  loadTextFromHash();
});

