const DEFAULT_REPLACEMENT_MESSAGE =
  'I uploaded a compressed archive containing the pasted data. Please analyze it.';

const DEFAULT_SETTINGS = {
  threshold: 20000,
  compressionMode: 'DEFLATE',
  enabled: true,
  setMessageAfterUpload: true,
  replacementMessage: DEFAULT_REPLACEMENT_MESSAGE,
};

const thresholdInput = document.getElementById('threshold');
const compressionModeSelect = document.getElementById('compressionMode');
const enabledCheckbox = document.getElementById('enabled');
const setMessageAfterUploadCheckbox = document.getElementById('setMessageAfterUpload');
const replacementMessageTextarea = document.getElementById('replacementMessage');
const messageField = document.getElementById('messageField');
const statusElement = document.getElementById('status');

function normalizeThreshold(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_SETTINGS.threshold;
}

function normalizeCompressionMode(value) {
  return value === 'STORE' || value === 'DEFLATE' ? value : DEFAULT_SETTINGS.compressionMode;
}

function showStatus(message) {
  statusElement.textContent = message;
  window.setTimeout(() => {
    if (statusElement.textContent === message) statusElement.textContent = '';
  }, 1500);
}

function updateMessageFieldVisibility() {
  const on = setMessageAfterUploadCheckbox.checked;
  messageField.style.display = on ? '' : 'none';
  replacementMessageTextarea.disabled = !on;
}

function loadForm() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    thresholdInput.value = normalizeThreshold(stored.threshold);
    compressionModeSelect.value = normalizeCompressionMode(stored.compressionMode);
    enabledCheckbox.checked = Boolean(stored.enabled);
    setMessageAfterUploadCheckbox.checked = stored.setMessageAfterUpload !== false;
    replacementMessageTextarea.value =
      typeof stored.replacementMessage === 'string' && stored.replacementMessage.trim()
        ? stored.replacementMessage
        : DEFAULT_REPLACEMENT_MESSAGE;
    updateMessageFieldVisibility();
  });
}

function saveSettings() {
  const nextSettings = {
    threshold: normalizeThreshold(thresholdInput.value),
    compressionMode: normalizeCompressionMode(compressionModeSelect.value),
    enabled: enabledCheckbox.checked,
    setMessageAfterUpload: setMessageAfterUploadCheckbox.checked,
    replacementMessage: setMessageAfterUploadCheckbox.checked
      ? replacementMessageTextarea.value.trim() || DEFAULT_REPLACEMENT_MESSAGE
      : replacementMessageTextarea.value,
  };
  thresholdInput.value = String(nextSettings.threshold);
  chrome.storage.sync.set(nextSettings, () => showStatus('Settings saved'));
}

thresholdInput.addEventListener('change', saveSettings);
compressionModeSelect.addEventListener('change', saveSettings);
enabledCheckbox.addEventListener('change', saveSettings);
setMessageAfterUploadCheckbox.addEventListener('change', () => {
  updateMessageFieldVisibility();
  saveSettings();
});
replacementMessageTextarea.addEventListener('change', saveSettings);
replacementMessageTextarea.addEventListener('blur', saveSettings);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadForm);
} else {
  loadForm();
}
