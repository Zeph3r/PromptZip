(() => {
  const DEFAULT_SETTINGS = {
    threshold: 20000,
    compressionMode: 'DEFLATE',
    enabled: true,
  };

  const ZIP_FILE_NAME = 'chatgpt_paste.zip';
  const TXT_FILE_NAME = 'pasted_text.txt';
  const REPLACEMENT_PROMPT =
    'I uploaded a compressed archive containing the pasted data. Please analyze it.';

  let settings = { ...DEFAULT_SETTINGS };
  let observer = null;

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
        settings = {
          threshold: normalizeThreshold(stored.threshold),
          compressionMode: normalizeCompressionMode(stored.compressionMode),
          enabled: Boolean(stored.enabled),
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

  function startObserver() {
    if (observer) {
      return;
    }

    observer = new MutationObserver(() => {
      attachHandlerToAllTextareas();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    attachHandlerToAllTextareas();
  }

  function attachHandlerToAllTextareas() {
    const textareas = document.querySelectorAll('textarea');
    for (const textarea of textareas) {
      if (textarea.dataset.promptzipPasteListenerAttached === 'true') {
        continue;
      }

      textarea.dataset.promptzipPasteListenerAttached = 'true';
      textarea.addEventListener('paste', onPaste, true);
    }
  }

  async function onPaste(event) {
    if (!settings.enabled) {
      return;
    }

    const clipboardData = event.clipboardData;
    if (!clipboardData) {
      return;
    }

    const pastedText = clipboardData.getData('text/plain') || clipboardData.getData('text');
    if (!pastedText || pastedText.length <= settings.threshold) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    try {
      const zipFile = await createZipFile(pastedText, settings.compressionMode);
      const uploaded = uploadZipToChatGPT(zipFile);

      if (!uploaded) {
        console.warn('PromptZip: Could not find ChatGPT file input for upload.');
        return;
      }

      setPromptText(REPLACEMENT_PROMPT, event.currentTarget);
    } catch (error) {
      console.error('PromptZip: Failed to process pasted text.', error);
    }
  }

  async function createZipFile(content, compressionMode) {
    const zip = new JSZip();
    zip.file(TXT_FILE_NAME, content);

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: compressionMode,
    });

    return new File([blob], ZIP_FILE_NAME, { type: 'application/zip' });
  }

  function uploadZipToChatGPT(file) {
    const fileInput = findUploadInput();
    if (!fileInput) {
      return false;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  }

  function findUploadInput() {
    const inputs = document.querySelectorAll('input[type="file"]');
    for (const input of inputs) {
      if (input.disabled) {
        continue;
      }
      return input;
    }
    return null;
  }

  function setPromptText(message, sourceTextarea) {
    const textarea = sourceTextarea instanceof HTMLTextAreaElement ? sourceTextarea : document.querySelector('textarea');
    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.value = message;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') {
      return;
    }

    if (changes.threshold) {
      settings.threshold = normalizeThreshold(changes.threshold.newValue);
    }

    if (changes.compressionMode) {
      settings.compressionMode = normalizeCompressionMode(changes.compressionMode.newValue);
    }

    if (changes.enabled) {
      settings.enabled = Boolean(changes.enabled.newValue);
    }
  });

  loadSettings().then(() => {
    if (document.body) {
      startObserver();
      return;
    }

    window.addEventListener(
      'DOMContentLoaded',
      () => {
        startObserver();
      },
      { once: true }
    );
  });
})();
