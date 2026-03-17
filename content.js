(() => {
  const DEFAULT_REPLACEMENT_MESSAGE =
    'I uploaded a compressed archive containing the pasted data. Please analyze it.';

  const DEFAULT_SETTINGS = {
    threshold: 20000,
    compressionMode: 'DEFLATE',
    enabled: true,
    setMessageAfterUpload: true,
    replacementMessage: DEFAULT_REPLACEMENT_MESSAGE,
  };

  const ZIP_FILE_NAME = 'chatgpt_paste.zip';
  const TXT_FILE_NAME = 'pasted_text.txt';

  let settings = { ...DEFAULT_SETTINGS };
  let observer = null;

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
        settings = {
          threshold: normalizeThreshold(stored.threshold),
          compressionMode: normalizeCompressionMode(stored.compressionMode),
          enabled: Boolean(stored.enabled),
          setMessageAfterUpload: stored.setMessageAfterUpload !== false,
          replacementMessage: normalizeReplacementMessage(stored.replacementMessage),
        };
        resolve(settings);
      });
    });
  }

  function normalizeThreshold(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_SETTINGS.threshold;
  }

  function normalizeCompressionMode(value) {
    return value === 'STORE' || value === 'DEFLATE' ? value : DEFAULT_SETTINGS.compressionMode;
  }

  function normalizeReplacementMessage(value) {
    if (typeof value !== 'string') return DEFAULT_REPLACEMENT_MESSAGE;
    const t = value.trim();
    return t.length > 0 ? value : DEFAULT_REPLACEMENT_MESSAGE;
  }

  function isEditableTarget(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('textarea, [contenteditable]');
  }

  function startObserver() {
    if (observer) return;
    document.addEventListener('paste', onPaste, true);
    observer = { disconnect: () => document.removeEventListener('paste', onPaste, true) };
  }

  async function onPaste(event) {
    if (!settings.enabled) return;

    const target = event.target;
    if (!isEditableTarget(target)) return;

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text/plain') || clipboardData.getData('text');
    if (!pastedText) return;
    if (pastedText.length <= settings.threshold) return;

    event.preventDefault();
    event.stopPropagation();

    const editableEl = target.closest('textarea, [contenteditable]');

    try {
      const zipFile = await createZipFile(pastedText, settings.compressionMode);
      const uploaded = uploadZipToChatGPT(zipFile);

      if (!uploaded) {
        console.warn('[PromptZip] Could not find file input; restored pasted text.');
        setPromptText(pastedText, editableEl);
        return;
      }

      if (settings.setMessageAfterUpload) {
        const msg = (settings.replacementMessage || '').trim();
        setPromptText(msg.length > 0 ? msg : DEFAULT_REPLACEMENT_MESSAGE, editableEl);
      } else {
        setPromptText('', editableEl);
      }
    } catch (error) {
      console.error('[PromptZip] Failed to process paste.', error);
      setPromptText(pastedText, editableEl);
    }
  }

  async function createZipFile(content, compressionMode) {
    const zip = new JSZip();
    zip.file(TXT_FILE_NAME, content);
    const blob = await zip.generateAsync({ type: 'blob', compression: compressionMode });
    return new File([blob], ZIP_FILE_NAME, { type: 'application/zip' });
  }

  function uploadZipToChatGPT(file) {
    const fileInput = findUploadInput();
    if (!fileInput) return false;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('input', { bubbles: true }));
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function findAllFileInputs(root = document) {
    const inputs = [];
    const walk = (node) => {
      if (!node) return;
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'INPUT' && (node.type === 'file' || node.getAttribute?.('type') === 'file')) {
          inputs.push(node);
        }
        if (node.shadowRoot) walk(node.shadowRoot);
      }
      for (const child of node.children || []) walk(child);
    };
    walk(root);
    return inputs;
  }

  function findUploadInput() {
    for (const input of findAllFileInputs(document.body)) {
      if (!input.disabled) return input;
    }
    return null;
  }

  function setPromptText(message, editableEl) {
    const el = editableEl || document.querySelector('textarea, [contenteditable]');
    if (!el) return;
    el.focus();
    if (el.tagName === 'TEXTAREA') {
      el.value = message;
    } else if (el.isContentEditable) {
      el.textContent = message;
      el.innerText = message;
    } else {
      return;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (changes.threshold) settings.threshold = normalizeThreshold(changes.threshold.newValue);
    if (changes.compressionMode) {
      settings.compressionMode = normalizeCompressionMode(changes.compressionMode.newValue);
    }
    if (changes.enabled) settings.enabled = Boolean(changes.enabled.newValue);
    if (changes.setMessageAfterUpload !== undefined) {
      settings.setMessageAfterUpload = changes.setMessageAfterUpload.newValue !== false;
    }
    if (changes.replacementMessage) {
      settings.replacementMessage = normalizeReplacementMessage(changes.replacementMessage.newValue);
    }
  });

  loadSettings()
    .then(() => {
      if (document.body) startObserver();
      else window.addEventListener('DOMContentLoaded', () => startObserver(), { once: true });
    })
    .catch(() => {});
})();
