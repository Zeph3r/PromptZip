const DEFAULT_SETTINGS = {
  threshold: 20000,
  compressionMode: 'DEFLATE',
  enabled: true,
};

const thresholdInput = document.getElementById('threshold');
const compressionModeSelect = document.getElementById('compressionMode');
const enabledCheckbox = document.getElementById('enabled');
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
    if (statusElement.textContent === message) {
      statusElement.textContent = '';
    }
  }, 1500);
}

function loadForm() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    thresholdInput.value = normalizeThreshold(stored.threshold);
    compressionModeSelect.value = normalizeCompressionMode(stored.compressionMode);
    enabledCheckbox.checked = Boolean(stored.enabled);
  });
}

function saveSettings() {
  const nextSettings = {
    threshold: normalizeThreshold(thresholdInput.value),
    compressionMode: normalizeCompressionMode(compressionModeSelect.value),
    enabled: enabledCheckbox.checked,
  };

  thresholdInput.value = String(nextSettings.threshold);

  chrome.storage.sync.set(nextSettings, () => {
    showStatus('Settings saved');
  });
}

thresholdInput.addEventListener('change', saveSettings);
compressionModeSelect.addEventListener('change', saveSettings);
enabledCheckbox.addEventListener('change', saveSettings);

document.addEventListener('DOMContentLoaded', loadForm);
